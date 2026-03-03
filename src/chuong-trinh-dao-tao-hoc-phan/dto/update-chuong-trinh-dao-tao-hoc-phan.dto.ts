import { PartialType } from '@nestjs/swagger';
import { CreateChuongTrinhDaoTaoHocPhanDto } from './create-chuong-trinh-dao-tao-hoc-phan.dto';

export class UpdateChuongTrinhDaoTaoHocPhanDto extends PartialType(CreateChuongTrinhDaoTaoHocPhanDto) {}
