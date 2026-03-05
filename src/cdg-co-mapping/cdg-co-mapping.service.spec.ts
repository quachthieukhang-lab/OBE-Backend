import { Test, TestingModule } from '@nestjs/testing';
import { CdgCoMappingService } from './cdg-co-mapping.service';

describe('CdgCoMappingService', () => {
  let service: CdgCoMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdgCoMappingService],
    }).compile();

    service = module.get<CdgCoMappingService>(CdgCoMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
