import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoNienKhoaController } from './chuong-trinh-dao-tao-nien-khoa.controller';
import { ChuongTrinhDaoTaoNienKhoaService } from './chuong-trinh-dao-tao-nien-khoa.service';

describe('ChuongTrinhDaoTaoNienKhoaController', () => {
  let controller: ChuongTrinhDaoTaoNienKhoaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuongTrinhDaoTaoNienKhoaController],
      providers: [ChuongTrinhDaoTaoNienKhoaService],
    }).compile();

    controller = module.get<ChuongTrinhDaoTaoNienKhoaController>(ChuongTrinhDaoTaoNienKhoaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
