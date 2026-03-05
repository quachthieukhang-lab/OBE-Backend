import { Module } from '@nestjs/common';
import { CachDanhGiaService } from './cach-danh-gia.service';
import { CachDanhGiaController } from './cach-danh-gia.controller';

@Module({
  controllers: [CachDanhGiaController],
  providers: [CachDanhGiaService],
})
export class CachDanhGiaModule {}
