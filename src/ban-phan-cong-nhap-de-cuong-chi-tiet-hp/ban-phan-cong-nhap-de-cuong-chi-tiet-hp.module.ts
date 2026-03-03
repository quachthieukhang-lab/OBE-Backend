import { Module } from '@nestjs/common';
import { BanPhanCongNhapDeCuongChiTietHpService } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp.service';
import { BanPhanCongNhapDeCuongChiTietHpController } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp.controller';

@Module({
  controllers: [BanPhanCongNhapDeCuongChiTietHpController],
  providers: [BanPhanCongNhapDeCuongChiTietHpService],
})
export class BanPhanCongNhapDeCuongChiTietHpModule {}
