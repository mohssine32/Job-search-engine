// src/prisma/prisma.service.ts
// permet à NestJS d'injecter ce service dans d'autres classes (via le système de dépendances).
//`OnModuleInit` : interface NestJS appelée automatiquement **au démarrage du module** (comme un `onInit()`).


import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
//Ce décorateur indique à NestJS que cette classe peut être injectée ailleurs (comme dans un contrôleur ou un autre service).


export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}