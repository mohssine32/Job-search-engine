// src/job-offers/dto/create-job-offer.dto.ts
// 1. Importer les types et les outils nécessaires
//DTO c'est un objet qui décrit les données qu'on attend ou qu'on envoie. 


import { ContractType } from '@prisma/client'; // Importe l'enum depuis le client Prisma généré
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsInt, 
  IsEnum,
  Min,
  MaxLength
} from 'class-validator'; //Importation des décorateurs de validation dépuis class-validator

// 2. Définir la classe qui servira de DTO
export class CreateJobOfferDto {

  // 3. Définir chaque propriété avec ses règles de validation

  // Le titre doit être une chaîne de caractères et ne doit pas être vide.
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  // La description doit être une chaîne de caractères et ne doit pas être vide.
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  companyName: string; // <-- AJOUTEZ CETTE LIGNE

  // La ville doit être une chaîne de caractères et ne doit pas être vide.
  @IsString()
  @IsNotEmpty()
  city: string;

  // Le salaire minimum est optionnel (le '?' le rend optionnel dans TypeScript).
  @IsOptional() 
  @IsInt({ message: 'Le salaire minimum doit être un nombre entier.' })
  @Min(0, { message: 'Le salaire ne peut pas être négatif.' })
   salaryMin?: number | null;

  // Le salaire maximum est aussi optionnel.
  @IsOptional()
  @IsInt()
  @Min(0)
   salaryMax?: number | null;  // Accepte number ou null

  // Le type de contrat doit être une des valeurs de notre enum 'ContractType'.
  // C'est très puissant car ça se base directement sur votre schema.prisma !
  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType; // Les valeurs possibles sont 'CDI', 'CDD', 'STAGE', 'ALTERNANCE'
}