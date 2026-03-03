import { Module } from '@nestjs/common';
import { ChuongTrinhDaoTaoHocPhanService } from './chuong-trinh-dao-tao-hoc-phan.service';
import { ChuongTrinhDaoTaoHocPhanController } from './chuong-trinh-dao-tao-hoc-phan.controller';

@Module({
  controllers: [ChuongTrinhDaoTaoHocPhanController],
  providers: [ChuongTrinhDaoTaoHocPhanService],
})
export class ChuongTrinhDaoTaoHocPhanModule {}
