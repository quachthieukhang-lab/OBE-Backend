import { PartialType } from '@nestjs/swagger';
import { CreateCdgCoMappingDto } from './create-cdg-co-mapping.dto';

export class UpdateCdgCoMappingDto extends PartialType(CreateCdgCoMappingDto) {}
