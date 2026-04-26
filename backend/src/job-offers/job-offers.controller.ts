import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpException, 
  HttpStatus,
  UseGuards,
  Req,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { JobOffersService } from './job-offers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
// DANS src/job-offers/job-offers.controller.ts

// Changez cette ligne :
// Pour celle-ci :
import { ContractType, Role } from '@prisma/client'; // Importez aussi Role
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'; // ← Nouvelle garde
import { RolesGuard } from '../auth/guards/roules.guard';
import { Roles } from '../auth/decorators/roles.decorator'; // <-- 2. Importer le décorateur



//Décorateur  

@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  // --- Route de CRÉATION (Version finale et propre) ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createJobOfferDto: CreateJobOfferDto,
    @Req() req: any,
    @UploadedFile() logo?: Express.Multer.File
  ) {
    console.log('Create job offer body:', req.body);
    console.log('Uploaded logo file:', logo?.originalname, logo?.mimetype, logo?.size);
    // On passe l'ID de l'utilisateur connecté, qui est un recruteur validé.
    // Si un logo est uploadé, on transmet son chemin au service
    return this.jobOffersService.create(createJobOfferDto, req.user.id, logo);
  }

  // --- Route pour LIRE TOUTES les offres ---
  // Candidats → Voient TOUTES les offres
  // Recruteurs → Ne voient QUE leurs propres offres
  @Get()
  @UseGuards(OptionalJwtAuthGuard) // ← Guard optionnelle pour extraire l'user si le token existe
  findAll(
    @Query('city') city?: string,
    @Query('contractType') contractType?: ContractType,
    @Query('salaryMin') salaryMin?: string,
    @Req() req?: any,
  ) {
    const salary = salaryMin ? parseInt(salaryMin, 10) : undefined;
   if (salary !== undefined && isNaN(salary)) {
    throw new HttpException('Le paramètre salaryMin doit être un nombre valide', HttpStatus.BAD_REQUEST);
}
    // Extraire l'utilisateur connecté (s'il existe)
    const user = req?.user;
    const userId = user?.id || null; // ← user.id (pas user.sub !)
    const userRole = user?.role || null;
    
    return this.jobOffersService.findAll({ city, contractType, salaryMin: salary }, userId, userRole);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  findMyOffers(@Req() req: any) {
    return this.jobOffersService.findMyOffers(req.user.id);
  }

  @Get('logo/:id')
  async getLogo(@Param('id') id: string, @Res() res: Response) {
    const logo = await this.jobOffersService.getLogoByOfferId(id);
    if (!logo) {
      throw new HttpException('Logo non trouvé', HttpStatus.NOT_FOUND);
    }

    res.setHeader('Content-Type', logo.logoMimeType || 'application/octet-stream');
    return res.send(logo.logoData);
  }

  // --- Route pour LIRE UNE offre (inchangée, reste publique) ---
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const jobOffer = await this.jobOffersService.findOne(id);
    if (!jobOffer) {
      throw new HttpException("Offre d'emploi non trouvée", HttpStatus.NOT_FOUND);
    }
    return jobOffer;
  }

  // --- Route de MISE À JOUR (Version finale et sécurisée) ---
  @Put(':id')
  @Patch(':id')
  @UseGuards(JwtAuthGuard) // On vérifie juste que l'utilisateur est connecté
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
    @Req() req: any,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    // On passe l'utilisateur entier au service, qui vérifiera les droits de propriété.
    return this.jobOffersService.update(id, updateJobOfferDto, logo);
  }

  // --- Route de SUPPRESSION (Version finale et sécurisée) ---
  @Delete(':id')
@UseGuards(JwtAuthGuard)
async remove(@Param('id') id: string, @Req() req: any) {
  try {
    return await this.jobOffersService.remove(id, req.user.id);
  } catch (err) {
    console.error('Erreur suppression offre :', err);
    throw new HttpException(err.message || 'Impossible de supprimer', err.status || 500);
  }
}

  //Le rôle de cette route est d'afficher la liste de tous les candidats qui ont postulé à UNE SEULE offre 
  // d'emploi spécifique.
  
   @Get(':id/applications')
   @Roles('RECRUITER')
   @UseGuards(JwtAuthGuard, RolesGuard)
  getApplicationsForOffer(
    @Param('id') jobOfferId: string,
    @Req() req: any,
  ) {
    // On passe l'ID de l'offre et l'utilisateur connecté au service
    // Le service se chargera de la logique de vérification
    return this.jobOffersService.getApplicationsForOffer(jobOfferId, req.user);
  }
}