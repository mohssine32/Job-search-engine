// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobOffersModule } from './job-offers/job-offers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';

// 👇👇 1. IMPORTEZ CES DEUX ÉLÉMENTS 👇👇
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // 👇👇 2. AJOUTEZ CE BLOC DE CONFIGURATION EN PREMIER 👇👇
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads', // L'URL commencera par /uploads
    }),

    // --- Vos modules existants viennent après ---
    JobOffersModule, 
    UsersModule, 
    AuthModule, 
    ApplicationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}