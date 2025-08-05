// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // On a besoin de UsersService
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,    // Importer pour avoir accès à UsersService
    PassportModule,
    JwtModule.register({
      secret: 'VOTRE_SECRET_SUPER_SECRET', // !! À METTRE DANS UNE VARIABLE D'ENVIRONNEMENT !!
      signOptions: { expiresIn: '1d' }, // Le token expirera après 1 jour
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Nous ajouterons les stratégies plus tard
})
export class AuthModule {}