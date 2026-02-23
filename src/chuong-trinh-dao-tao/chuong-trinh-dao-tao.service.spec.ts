import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';

describe('ChuongTrinhDaoTaoService', () => {
  let service: ChuongTrinhDaoTaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChuongTrinhDaoTaoService],
    }).compile();

    service = module.get<ChuongTrinhDaoTaoService>(ChuongTrinhDaoTaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
