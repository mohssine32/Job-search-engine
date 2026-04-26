import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // Apply global validation to all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
            // Strip properties that are not defined in DTOs
      whitelist: true,
            // Reject requests containing non-whitelisted properties
      forbidNonWhitelisted: true,
          // Automatically transform payloads to DTO types
      transform: true,
    }),
  );

  app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost'],
    credentials: true,
  });
  
  // Utilisez process.cwd() pour le chemin absolu
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();