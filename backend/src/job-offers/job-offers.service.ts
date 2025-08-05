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

type UserPayload = {
  id: string;
  email: string;
  role: string;
};


@Injectable()
export class JobOffersService {
  constructor(private prisma: PrismaService) {}

  // 1. CRÉER une offre
  async create(createJobOfferDto: CreateJobOfferDto, recruiterId: string) {
    const recruiter = await this.prisma.user.findUnique({ where: { id: recruiterId } });
    if (!recruiter || recruiter.role !== 'RECRUITER') {
      throw new HttpException('Recruteur non valide', HttpStatus.BAD_REQUEST);
    }
    
    return this.prisma.jobOffer.create({
      data: {
        ...createJobOfferDto,
        recruiterId: recruiterId, // On lie l'offre au recruteur
      },
    });
  }

  // 2. LIRE toutes les offres (avec les filtres)
  async findAll(filters: FindAllFilters) {
    const { city, contractType, salaryMin } = filters;
    
    return this.prisma.jobOffer.findMany({
      where: {
        city: city ? { contains: city, mode: 'insensitive' } : undefined,
        contractType: contractType ? contractType : undefined,
        salaryMin: salaryMin ? { gte: salaryMin } : undefined, // gte = greater than or equal
      },
      include: {
        recruiter: {
          select: {
            id: true,
            email: true, // Ne montrez jamais le mot de passe !
          }
        }
      }
    });
  }

  // 3. LIRE une seule offre
  async findOne(id: string) {
    return this.prisma.jobOffer.findUnique({
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
  }

  // 4. METTRE À JOUR une offre
  async update(id: string, updateJobOfferDto: UpdateJobOfferDto) {
    const jobOffer = await this.prisma.jobOffer.findUnique({ where: { id } });
    if (!jobOffer) {
      throw new HttpException("Offre d'emploi non trouvée", HttpStatus.NOT_FOUND);
    }
    
    return this.prisma.jobOffer.update({
      where: { id },
      data: updateJobOfferDto,
    });
  }

  // 5. SUPPRIMER une offre
  async remove(id: string) {
    const jobOffer = await this.prisma.jobOffer.findUnique({ where: { id } });
    if (!jobOffer) {
      throw new HttpException("Offre d'emploi non trouvée", HttpStatus.NOT_FOUND);
    }

    return this.prisma.jobOffer.delete({
      where: { id },
    });
  }

  
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
}
  
