// src/applications/applications.controller.ts

import { Controller, Post, Body, UseInterceptors, UploadedFile, Req, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roules.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Response } from 'express';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles('CANDIDATE') // Seuls les candidats peuvent postuler
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('cv')) // <-- 1. L'intercepteur magique
  apply(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile( // <-- 2. Le décorateur pour extraire le fichier
      new ParseFilePipe({ // <-- 3. Des validateurs pour le fichier !
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB max
          new FileTypeValidator({ fileType: 'application/pdf' }), // Uniquement les PDF
        ],
      }),
    )
    file: Express.Multer.File, // Le type du fichier uploadé
    @Req() req: any,
  ) {
    const candidateId = req.user.id;
    
    // On passe tout au service pour qu'il fasse le travail
    return this.applicationsService.create(createApplicationDto, candidateId, file);
  }

  /**
   * Nouvelle route pour récupérer le CV PDF d'une candidature
   * Accessible via GET /applications/:id/cv
   * Renvoie le fichier PDF stocké en base (champ cvData)
   */
  @Get(':id/cv')
  async getCv(@Param('id') id: string, @Res() res: Response) {
    // On récupère l'application par son id
    const application = await this.applicationsService.findById(id);
    // Si pas de candidature ou pas de CV, on renvoie une erreur 404
    if (!application || !application.cvData) {
      throw new NotFoundException('CV non trouvé');
    }
    // On prépare la réponse HTTP pour renvoyer un PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="cv.pdf"'
    });
    // On envoie le buffer du PDF
    res.send(application.cvData);
  }
}