// src/auth/strategies/jwt.strategy.ts
// Objectif de JwtStrategy
//👉 Ce fichier permet à NestJS de :

//Lire le token JWT envoyé dans les requêtes

//Le vérifier (valide ou expiré ?)

//Retrouver l’utilisateur correspondant dans la base

//Injecter l’utilisateur dans req.user



import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service'; // <-- 1. Importer UsersService

@Injectable() // pour pouvoir injecter UsersService
export class JwtStrategy extends PassportStrategy(Strategy) {

  // 2. Injecter UsersService dans le constructeur
  constructor(private usersService: UsersService) { 
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraire le token JWT envoyé dans les requêtes
      ignoreExpiration: false, // refuse les tokens expirés
      secretOrKey: 'VOTRE_SECRET_SUPER_SECRET', // Remplacez par votre clé secrète
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // 3. Utiliser le service pour trouver l'utilisateur
    const user = await this.usersService.findOneById(payload.sub); 

    // 4. Si l'utilisateur n'existe plus, rejeter le token
    if (!user) {
      throw new UnauthorizedException("L'utilisateur de ce token n'existe plus.");
    }

    // 5. Si tout va bien, retourner l'objet utilisateur (ou juste les infos utiles)
    // C'est cet objet qui sera attaché à `req.user` dans le controller
    return { id: user.id, email: user.email, role: user.role };
  }
  
}