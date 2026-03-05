import { PartialType } from '@nestjs/swagger';
import { CreateLopHocPhanDto } from './create-lop-hoc-phan.dto';

export class UpdateLopHocPhanDto extends PartialType(CreateLopHocPhanDto) {}
