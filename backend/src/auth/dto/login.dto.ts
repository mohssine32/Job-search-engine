// src/auth/dto/login.dto.ts

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: "Veuillez fournir une adresse email valide." })
  @IsNotEmpty({ message: "L'email ne doit pas être vide." })
  email: string;

  @IsString({ message: "Le mot de passe doit être une chaîne de caractères." })
  @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide." })
  password: string;
}