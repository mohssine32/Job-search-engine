// src/prisma/prisma.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // 'providers' déclare les services qui appartiennent à ce module.
  // NestJS va créer une instance unique (singleton) de PrismaService.
  providers: [PrismaService],

  // 'exports' rend les services déclarés ici disponibles pour tout autre
  // module qui importera PrismaModule. C'est l'étape la plus importante !
  exports: [PrismaService],
})
export class PrismaModule {}