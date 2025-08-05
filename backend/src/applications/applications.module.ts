// src/applications/applications.module.ts

import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Assurez-vous d'avoir cet import

@Module({
  imports: [PrismaModule], // <-- Assurez-vous que PrismaModule est dans les imports
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}