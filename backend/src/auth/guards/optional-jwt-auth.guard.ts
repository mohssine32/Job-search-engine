import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // Si y'a une erreur ou pas de user, on continue quand même (c'est "optionnel")
    // Retourner null si pas de user, sinon retourner le user
    return user || null;
  }
}
