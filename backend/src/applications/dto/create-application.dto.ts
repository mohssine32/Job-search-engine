// src/applications/dto/create-application.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobOfferId: string;
}