import { Test, TestingModule } from '@nestjs/testing';
import { HocPhanService } from './hoc-phan.service';

describe('HocPhanService', () => {
  let service: HocPhanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HocPhanService],
    }).compile();

    service = module.get<HocPhanService>(HocPhanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
