import { Test, TestingModule } from '@nestjs/testing';
import { CloPloMappingService } from './clo-plo-mapping.service';

describe('CloPloMappingService', () => {
  let service: CloPloMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloPloMappingService],
    }).compile();

    service = module.get<CloPloMappingService>(CloPloMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
