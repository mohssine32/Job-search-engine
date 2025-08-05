// src/job-offers/dto/update-job-offer.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOfferDto } from './create-job-offer.dto';

// UpdateJobOfferDto hérite de toutes les propriétés et validateurs de CreateJobOfferDto,
// mais PartialType() les rend toutes optionnelles.
export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}