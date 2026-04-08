import { PartialType } from '@nestjs/swagger';
import { CreateObeCalculationDto } from './create-obe-calculation.dto';

export class UpdateObeCalculationDto extends PartialType(CreateObeCalculationDto) {}
