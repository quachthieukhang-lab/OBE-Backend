import { PartialType } from '@nestjs/swagger';
import { CreateDangKyHocPhanDto } from './create-dang-ky-hoc-phan.dto';

export class UpdateDangKyHocPhanDto extends PartialType(CreateDangKyHocPhanDto) {}
