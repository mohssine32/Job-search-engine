import { Module } from '@nestjs/common';
import { JobOffersService } from './job-offers.service';
import { JobOffersController } from './job-offers.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Assurez-vous d'importer PrismaModule

@Module({
  imports: [PrismaModule], // Le service a besoin de Prisma, donc le module doit l'importer
  controllers: [JobOffersController], // Votre controller est déclaré ici
  providers: [JobOffersService],      // Votre service est déclaré ici
})
export class JobOffersModule {}