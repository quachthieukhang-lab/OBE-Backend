import { PartialType } from '@nestjs/swagger';
import { CreateCloCoMappingDto } from './create-clo-co-mapping.dto';

export class UpdateCloCoMappingDto extends PartialType(CreateCloCoMappingDto) {}
