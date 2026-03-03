import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoHocPhanService } from './chuong-trinh-dao-tao-hoc-phan.service';

describe('ChuongTrinhDaoTaoHocPhanService', () => {
  let service: ChuongTrinhDaoTaoHocPhanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChuongTrinhDaoTaoHocPhanService],
    }).compile();

    service = module.get<ChuongTrinhDaoTaoHocPhanService>(ChuongTrinhDaoTaoHocPhanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
