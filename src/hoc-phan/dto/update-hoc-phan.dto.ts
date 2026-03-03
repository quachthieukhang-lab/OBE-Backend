import { PartialType } from '@nestjs/swagger';
import { CreateHocPhanDto } from './create-hoc-phan.dto';

export class UpdateHocPhanDto extends PartialType(CreateHocPhanDto) {}
