// Fichier : src/job-offers/job-offers.service.ts (Version CORRECTE et COMPLÈTE)

// src/job-offers/job-offers.service.ts

import { 
  Injectable, 
  HttpException, 
  HttpStatus, 
  NotFoundException,    // <-- Maintenant importé
  ForbiddenException    // <-- Maintenant importé
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { ContractType } from '@prisma/client';

// ... le reste de votre code reste identique ...

// On définit une interface pour les filtres, pour que ce soit plus propre
interface FindAllFilters {
  city?: string;
  contractType?: ContractType;
  salaryMin?: number;
}

type UserRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN' | null;

type UserPayload = {
  id: string;
  email: string;
  role: string;
};


@Injectable()
export class JobOffersService {
  constructor(private prisma: PrismaService) {}

  private toDbLogoUrl(offer: {
    id: string;
    logoUrl?: string | null;
    logoMimeType?: string | null;
  }) {
    if (!offer.logoMimeType) {
      return offer.logoUrl ?? null;
    }

    if (!offer.logoUrl || offer.logoUrl.startsWith('/uploads/')) {
      return `/job-offers/logo/${offer.id}`;
    }

    return offer.logoUrl;
  }

  // 1. CRÉER une offre
  async create(createJobOfferDto: CreateJobOfferDto, recruiterId: string, logo?: Express.Multer.File) {
    const recruiter = await this.prisma.user.findUnique({ where: { id: recruiterId } });
    if (!recruiter || recruiter.role !== 'RECRUITER') {
      throw new HttpException('Recruteur non valide', HttpStatus.BAD_REQUEST);
    }
    const createdOffer = await this.prisma.jobOffer.create({
      data: {
        ...createJobOfferDto,
        recruiterId: recruiterId,
        logoData: logo?.buffer,
        logoMimeType: logo?.mimetype,
      },
    });

    if (logo) {
      return this.prisma.jobOffer.update({
        where: { id: createdOffer.id },
        data: { logoUrl: `/job-offers/logo/${createdOffer.id}` },
      });
    }

    return createdOffer;
  }

  // 2. LIRE toutes les offres (avec les filtres) - Avec logique de rôle
  async findAll(filters: FindAllFilters, userId?: string | null, userRole?: UserRole) {
    // Construire les conditions WHERE
    const where: any = {};

    // Si c'est un RECRUTEUR connecté, ne montrer que ses offres
    if (userRole === 'RECRUITER' && userId) {
      where.recruiterId = userId;
    }
    // Si c'est un CANDIDAT ou non connecté, montrer TOUTES les offres
    // (pas de filtre supplémentaire)

    // Appliquer les filtres optionnels
    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters.contractType) {
      where.contractType = filters.contractType;
    }
    if (filters.salaryMin !== undefined) {
      where.salaryMin = { gte: filters.salaryMin };
    }

    const offers = await this.prisma.jobOffer.findMany({
      where,
      select: {
        id: true,
        title: true,        // ✅ Titre
        companyName: true,  // ✅ Company (directement depuis l'offre)
        logoUrl: true,      // ✅ Logo de l'entreprise
        logoMimeType: true,
        city: true,         // ✅ City
        salaryMin: true,    // ✅ Salaire min
        salaryMax: true,    // ✅ Salaire max
        contractType: true, // ✅ Type de contrat
        createdAt: true,    // ✅ Date de création
      },
      orderBy: {
        createdAt: 'desc'   // ✅ Tri par date de création
      }
    });

    return offers.map(({ logoMimeType, ...offer }) => ({
      ...offer,
      logoUrl: this.toDbLogoUrl({
        id: offer.id,
        logoUrl: offer.logoUrl,
        logoMimeType,
      }),
    }));
  }

  async getLogoByOfferId(id: string) {
    return this.prisma.jobOffer.findUnique({
      where: { id },
      select: {
        logoData: true,
        logoMimeType: true,
      },
    });
  }

  // 3. LIRE une seule offre
  async findOne(id: string) {
    const offer = await this.prisma.jobOffer.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: {
            id: true,
            email: true,
          }
        }
      }
    });

    if (!offer) {
      return null;
    }

    return {
      ...offer,
      logoUrl: this.toDbLogoUrl({
        id: offer.id,
        logoUrl: offer.logoUrl,
        logoMimeType: offer.logoMimeType,
      }),
    };
  }

  // 4. METTRE À JOUR une offre
  async update(id: string, updateJobOfferDto: UpdateJobOfferDto, logo?: Express.Multer.File) {
    const jobOffer = await this.prisma.jobOffer.findUnique({ where: { id } });
    if (!jobOffer) {
      throw new HttpException("Offre d'emploi non trouvée", HttpStatus.NOT_FOUND);
    }

    const updateData: any = { ...updateJobOfferDto };
    if (logo) {
      updateData.logoData = logo.buffer;
      updateData.logoMimeType = logo.mimetype;
      updateData.logoUrl = `/job-offers/logo/${id}`;
    }
    
    return this.prisma.jobOffer.update({
      where: { id },
      data: updateData,
    });
  }

  // 5. SUPPRIMER une offre
  
  async remove(id: string, userId: string) {
  const jobOffer = await this.prisma.jobOffer.findUnique({ where: { id } });

  if (!jobOffer) {
    throw new HttpException("Offre d'emploi non trouvée", HttpStatus.NOT_FOUND);
  }

  // Vérification que l'utilisateur est bien le recruteur de l'offre
  if (jobOffer.recruiterId !== userId) {
    throw new HttpException("Action non autorisée", HttpStatus.FORBIDDEN);
  }

  const deletedOffer = await this.prisma.$transaction(async (tx) => {
    await tx.application.deleteMany({ where: { jobOfferId: id } });

    return tx.jobOffer.delete({ where: { id } });
  });

  return deletedOffer;
}
  // return application for each job offer
  async getApplicationsForOffer(jobOfferId: string, recruiter: UserPayload) {
    // 1. D'abord, trouver l'offre d'emploi
    const jobOffer = await this.prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
    });

    // Si l'offre n'existe pas, renvoyer une erreur 404
    if (!jobOffer) {
      throw new NotFoundException(`L'offre d'emploi avec l'ID "${jobOfferId}" n'a pas été trouvée.`);
    }

    // 2. VÉRIFICATION DE SÉCURITÉ CRUCIALE : est-ce que le recruteur connecté est le propriétaire de l'offre ?
    if (jobOffer.recruiterId !== recruiter.id) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à voir les candidatures pour cette offre.");
    }

    // 3. Si tout est bon, récupérer les candidatures pour cette offre.
    // On inclut les informations du candidat pour les afficher (sauf son mot de passe, bien sûr !)
    return this.prisma.application.findMany({
      where: {
        jobOfferId: jobOfferId,
      },
      include: {
        candidate: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }



///écupérer les offres d'un recruteur spécifique
  async findMyOffers(recruiterId: string) {
    return this.prisma.jobOffer.findMany({
      where: {
        recruiterId: recruiterId, // On ne prend que les offres du recruteur connecté
      },
      // On inclut un comptage des relations 'applications'
      include: {
        _count: {
          select: {
            applications: true, // Compte le nombre d'applications pour chaque offre
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


}
  
