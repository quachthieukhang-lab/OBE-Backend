import { PartialType } from '@nestjs/swagger';
import { CreateChuongTrinhDaoTaoDto } from './create-chuong-trinh-dao-tao.dto';

export class UpdateChuongTrinhDaoTaoDto extends PartialType(CreateChuongTrinhDaoTaoDto) {}
