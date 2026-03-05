import { Module } from '@nestjs/common';
import { DangKyHocPhanService } from './dang-ky-hoc-phan.service';
import { DangKyHocPhanController } from './dang-ky-hoc-phan.controller';

@Module({
  controllers: [DangKyHocPhanController],
  providers: [DangKyHocPhanService],
})
export class DangKyHocPhanModule {}
