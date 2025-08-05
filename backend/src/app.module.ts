// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobOffersModule } from './job-offers/job-offers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    JobOffersModule, 
    UsersModule, 
    AuthModule, 
    ApplicationsModule
  ],
  controllers: [AppController],
  providers: [AppService], // <-- On ne garde que AppService ici !
})
export class AppModule {}