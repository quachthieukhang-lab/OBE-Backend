import { PartialType } from '@nestjs/swagger';
import { CreateNienKhoaDto } from './create-nien-khoa.dto';

export class UpdateNienKhoaDto extends PartialType(CreateNienKhoaDto) {}
