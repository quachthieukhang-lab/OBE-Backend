import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoHocPhanController } from './chuong-trinh-dao-tao-hoc-phan.controller';
import { ChuongTrinhDaoTaoHocPhanService } from './chuong-trinh-dao-tao-hoc-phan.service';

describe('ChuongTrinhDaoTaoHocPhanController', () => {
  let controller: ChuongTrinhDaoTaoHocPhanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuongTrinhDaoTaoHocPhanController],
      providers: [ChuongTrinhDaoTaoHocPhanService],
    }).compile();

    controller = module.get<ChuongTrinhDaoTaoHocPhanController>(ChuongTrinhDaoTaoHocPhanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
