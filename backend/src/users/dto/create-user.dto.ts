// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
//class-validator est une bibliothèque qui vous permet de définir des règles de validation pour vos données en utilisant des "décorateurs" directement sur vos classes TypeScript (vos DTOs).

import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role; // Doit être 'CANDIDATE' ou 'RECRUITER'
}
