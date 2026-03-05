import { PartialType } from '@nestjs/swagger';
import { CreateCloPloMappingDto } from './create-clo-plo-mapping.dto';

export class UpdateCloPloMappingDto extends PartialType(CreateCloPloMappingDto) {}
