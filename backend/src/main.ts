import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  console.log('Body:', req.body);
  next();
});


    app.enableCors({
    origin: 'http://localhost:5173', // URL de ton frontend
    credentials: true, // si tu veux gérer les cookies / auth
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
