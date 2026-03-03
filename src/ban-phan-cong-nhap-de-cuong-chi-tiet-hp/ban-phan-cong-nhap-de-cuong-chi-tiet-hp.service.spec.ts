import { Test, TestingModule } from '@nestjs/testing';
import { BanPhanCongNhapDeCuongChiTietHpService } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp.service';

describe('BanPhanCongNhapDeCuongChiTietHpService', () => {
  let service: BanPhanCongNhapDeCuongChiTietHpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanPhanCongNhapDeCuongChiTietHpService],
    }).compile();

    service = module.get<BanPhanCongNhapDeCuongChiTietHpService>(BanPhanCongNhapDeCuongChiTietHpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
