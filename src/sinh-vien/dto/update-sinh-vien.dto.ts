import { PartialType } from '@nestjs/swagger';
import { CreateSinhVienDto } from './create-sinh-vien.dto';

export class UpdateSinhVienDto extends PartialType(CreateSinhVienDto) {}
