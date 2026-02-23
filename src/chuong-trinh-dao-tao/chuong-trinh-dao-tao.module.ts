import { Module } from '@nestjs/common';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { ChuongTrinhDaoTaoController } from './chuong-trinh-dao-tao.controller';

@Module({
  controllers: [ChuongTrinhDaoTaoController],
  providers: [ChuongTrinhDaoTaoService],
})
export class ChuongTrinhDaoTaoModule {}
