// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  //Reflector est un outil de NestJS pour lire les métadonnées qu'on a ajoutées avec le décorateur @Roles().
  constructor(private reflector: Reflector) {}



  // canActivate : Cette fonction est appelée automatiquement par NestJS quand un utilisateur essaye d'accéder à une route protégée.
//Elle retourne soit true (accès autorisé), soit false (accès interdit).


  canActivate(context: ExecutionContext): boolean {
    // 1. Obtenir les rôles requis pour cette route (via le décorateur @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est requis, on autorise l'accès
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtenir l'utilisateur de la requête (attaché par JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 3. Vérifier si le rôle de l'utilisateur fait partie des rôles requis
    return requiredRoles.some((role) => user.role === role);
  }
}