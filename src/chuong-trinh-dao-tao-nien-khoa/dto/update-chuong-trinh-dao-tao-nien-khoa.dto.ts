import { PartialType } from '@nestjs/swagger';
import { CreateChuongTrinhDaoTaoNienKhoaDto } from './create-chuong-trinh-dao-tao-nien-khoa.dto';

export class UpdateChuongTrinhDaoTaoNienKhoaDto extends PartialType(CreateChuongTrinhDaoTaoNienKhoaDto) {}
