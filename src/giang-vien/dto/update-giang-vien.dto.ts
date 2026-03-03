import { PartialType } from '@nestjs/swagger';
import { CreateGiangVienDto } from './create-giang-vien.dto';

export class UpdateGiangVienDto extends PartialType(CreateGiangVienDto) {}
