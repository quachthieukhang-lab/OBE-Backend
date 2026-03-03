import { Test, TestingModule } from '@nestjs/testing';
import { BanPhanCongNhapDeCuongChiTietHpController } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp.controller';
import { BanPhanCongNhapDeCuongChiTietHpService } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp.service';

describe('BanPhanCongNhapDeCuongChiTietHpController', () => {
  let controller: BanPhanCongNhapDeCuongChiTietHpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanPhanCongNhapDeCuongChiTietHpController],
      providers: [BanPhanCongNhapDeCuongChiTietHpService],
    }).compile();

    controller = module.get<BanPhanCongNhapDeCuongChiTietHpController>(BanPhanCongNhapDeCuongChiTietHpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
