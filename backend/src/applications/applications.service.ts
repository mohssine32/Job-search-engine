// src/applications/applications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Express } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, candidateId: string, file: Express.Multer.File) {
    // 1. Définir où sauvegarder le fichier et comment le nommer
    const uploadPath = './uploads/cvs';
    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${candidateId}-${uniqueSuffix}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadPath, fileName);
    
    // 2. Écrire le fichier sur le disque
    fs.writeFileSync(filePath, file.buffer);

    // 3. Enregistrer la candidature dans la base de données
    const application = await this.prisma.application.create({
      data: {
        jobOfferId: createApplicationDto.jobOfferId,
        candidateId: candidateId,
        cvData: file.buffer,
      },
    });

    return application;
  }

  /**
   * Récupère une candidature par son id
   * Utile pour la route de téléchargement du CV
   */
  async findById(id: string) {
    return this.prisma.application.findUnique({ where: { id } });
  }
}