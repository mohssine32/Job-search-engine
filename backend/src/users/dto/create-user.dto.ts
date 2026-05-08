// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  @IsNotEmpty()
  password: string;

  @IsEnum(['CANDIDATE', 'RECRUITER'], { message: 'Le rôle doit être CANDIDATE ou RECRUITER' })
  @IsNotEmpty()
  role: Role;
}
