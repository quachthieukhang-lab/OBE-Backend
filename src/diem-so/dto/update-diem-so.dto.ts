import { PartialType } from '@nestjs/swagger';
import { CreateDiemSoDto } from './create-diem-so.dto';

export class UpdateDiemSoDto extends PartialType(CreateDiemSoDto) {}
