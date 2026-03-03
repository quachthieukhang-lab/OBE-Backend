import { Module } from '@nestjs/common';
import { ChuongTrinhDaoTaoNienKhoaService } from './chuong-trinh-dao-tao-nien-khoa.service';
import { ChuongTrinhDaoTaoNienKhoaController } from './chuong-trinh-dao-tao-nien-khoa.controller';

@Module({
  controllers: [ChuongTrinhDaoTaoNienKhoaController],
  providers: [ChuongTrinhDaoTaoNienKhoaService],
})
export class ChuongTrinhDaoTaoNienKhoaModule {}
