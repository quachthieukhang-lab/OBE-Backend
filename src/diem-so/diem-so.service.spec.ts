import { Test, TestingModule } from '@nestjs/testing';
import { DiemSoService } from './diem-so.service';

describe('DiemSoService', () => {
  let service: DiemSoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiemSoService],
    }).compile();

    service = module.get<DiemSoService>(DiemSoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
