import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpException, 
  HttpStatus,
  UseGuards,  // <-- À ajouter plus tard pour la sécurité
  Req,      // <-- À ajouter plus tard pour la sécurité
} from '@nestjs/common';

import { JobOffersService } from './job-offers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
// DANS src/job-offers/job-offers.controller.ts

// Changez cette ligne :
// Pour celle-ci :
import { ContractType, Role } from '@prisma/client'; // Importez aussi Role
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roules.guard';
import { Roles } from '../auth/decorators/roles.decorator'; // <-- 2. Importer le décorateur



//Décorateur  

@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  // --- Route de CRÉATION (Version finale et propre) ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // On applique les deux gardes //jwtAuthGuard verifier si JWT valide dans l'en-tête
  @Roles(Role.RECRUITER) //  METADONNÉE !
  create(@Body() createJobOfferDto: CreateJobOfferDto, @Req() req: any) {
    // Le code est propre ! La vérification est faite par les gardes.
    // On passe l'ID de l'utilisateur connecté, qui est un recruteur validé.
    return this.jobOffersService.create(createJobOfferDto, req.user.id);
  }

  // --- Route pour LIRE TOUTES les offres (inchangée, reste publique) ---
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('contractType') contractType?: ContractType,
    @Query('salaryMin') salaryMin?: string,
  ) {
    const salary = salaryMin ? parseInt(salaryMin, 10) : undefined;
   if (salary !== undefined && isNaN(salary)) {
    throw new HttpException('Le paramètre salaryMin doit être un nombre valide', HttpStatus.BAD_REQUEST);
}
    return this.jobOffersService.findAll({ city, contractType, salaryMin: salary });
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
  @Patch(':id')
  @UseGuards(JwtAuthGuard) // On vérifie juste que l'utilisateur est connecté
  update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
    @Req() req: any,
  ) {
    // On passe l'utilisateur entier au service, qui vérifiera les droits de propriété.
    return this.jobOffersService.update(id, updateJobOfferDto);
  }

  // --- Route de SUPPRESSION (Version finale et sécurisée) ---
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // On vérifie juste que l'utilisateur est connecté
  remove(@Param('id') id: string, @Req() req: any) {
    // On passe l'utilisateur entier au service pour la vérification des droits.
    return this.jobOffersService.remove(id);
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