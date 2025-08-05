// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//On importe la classe AuthGuard depuis @nestjs/passport. C’est une classe générique fournie par NestJS pour 
// utiliser des stratégies d’authentification (comme JWT, local, etc.) via Passport.js.

@Injectable() //: cette classe peut être injectée dans d’autres services, contrôleurs, etc.
export class JwtAuthGuard extends AuthGuard('jwt') {}
// on étend la classe AuthGuard en lui passant 'jwt'
//  comme stratégie. Cela signifie que cette garde va utiliser la stratégie JWT définie ailleurs dans ton projet 