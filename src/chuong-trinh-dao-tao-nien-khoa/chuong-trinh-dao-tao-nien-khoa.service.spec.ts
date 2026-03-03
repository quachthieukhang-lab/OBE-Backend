import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoNienKhoaService } from './chuong-trinh-dao-tao-nien-khoa.service';

describe('ChuongTrinhDaoTaoNienKhoaService', () => {
  let service: ChuongTrinhDaoTaoNienKhoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChuongTrinhDaoTaoNienKhoaService],
    }).compile();

    service = module.get<ChuongTrinhDaoTaoNienKhoaService>(ChuongTrinhDaoTaoNienKhoaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
