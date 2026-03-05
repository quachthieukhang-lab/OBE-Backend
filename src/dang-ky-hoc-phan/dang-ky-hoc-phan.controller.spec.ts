import { Test, TestingModule } from '@nestjs/testing';
import { DangKyHocPhanController } from './dang-ky-hoc-phan.controller';
import { DangKyHocPhanService } from './dang-ky-hoc-phan.service';

describe('DangKyHocPhanController', () => {
  let controller: DangKyHocPhanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DangKyHocPhanController],
      providers: [DangKyHocPhanService],
    }).compile();

    controller = module.get<DangKyHocPhanController>(DangKyHocPhanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
