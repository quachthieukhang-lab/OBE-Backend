import { Test, TestingModule } from '@nestjs/testing';
import { DangKyHocPhanService } from './dang-ky-hoc-phan.service';

describe('DangKyHocPhanService', () => {
  let service: DangKyHocPhanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DangKyHocPhanService],
    }).compile();

    service = module.get<DangKyHocPhanService>(DangKyHocPhanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
