import { PartialType } from '@nestjs/swagger';
import { CreateCoDto } from './create-co.dto';

export class UpdateCoDto extends PartialType(CreateCoDto) {}
