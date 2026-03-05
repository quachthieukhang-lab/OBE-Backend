import { Test, TestingModule } from '@nestjs/testing';
import { CloCoMappingService } from './clo-co-mapping.service';

describe('CloCoMappingService', () => {
  let service: CloCoMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloCoMappingService],
    }).compile();

    service = module.get<CloCoMappingService>(CloCoMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
