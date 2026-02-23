import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoController } from './chuong-trinh-dao-tao.controller';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';

describe('ChuongTrinhDaoTaoController', () => {
  let controller: ChuongTrinhDaoTaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuongTrinhDaoTaoController],
      providers: [ChuongTrinhDaoTaoService],
    }).compile();

    controller = module.get<ChuongTrinhDaoTaoController>(ChuongTrinhDaoTaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
