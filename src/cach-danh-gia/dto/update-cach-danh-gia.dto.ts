import { PartialType } from '@nestjs/swagger';
import { CreateCachDanhGiaDto } from './create-cach-danh-gia.dto';

export class UpdateCachDanhGiaDto extends PartialType(CreateCachDanhGiaDto) {}
