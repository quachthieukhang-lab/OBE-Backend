import { Test, TestingModule } from '@nestjs/testing';
import { CachDanhGiaService } from './cach-danh-gia.service';

describe('CachDanhGiaService', () => {
  let service: CachDanhGiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CachDanhGiaService],
    }).compile();

    service = module.get<CachDanhGiaService>(CachDanhGiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
