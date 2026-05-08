// src/admin/admin.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getRecruiters() {
    return this.prisma.user.findMany({
      where: { role: 'RECRUITER' },
      select: {
        id: true,
        email: true,
        createdAt: true,
        _count: { select: { jobOffers: true } },
      },
    });
  }

  async deleteRecruiter(id: string) {
    const recruiter = await this.prisma.user.findUnique({ where: { id } });
    if (!recruiter) {
      throw new NotFoundException('Recruteur introuvable');
    }
    if (recruiter.role !== 'RECRUITER') {
      throw new ForbiddenException("Cet utilisateur n'est pas un recruteur");
    }

    // Supprimer les offres du recruteur (les candidatures seront supprimées en cascade via onDelete: Cascade)
    await this.prisma.jobOffer.deleteMany({ where: { recruiterId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { message: 'Recruteur et ses offres supprimés avec succès' };
  }
}
