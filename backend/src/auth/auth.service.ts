// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
//aprés que l'utilisateur entrée son email et son mot de passe
  // Étape 1: Valider si l'utilisateur existe et si le mot de passe est correct
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Retourne l'utilisateur sans son mot de passe
    }
    return null; // Échec de l'authentification
  }

  // Étape 2: Générer un token JWT pour un utilisateur validé
  //Générer un JWT lors du login si l'utilisateur et validé et son mot de passe est correct
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload), // Retourne le token JWT dépuis le service JwtService
    };
  }
}