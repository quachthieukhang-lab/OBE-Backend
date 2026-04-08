import { Test, TestingModule } from '@nestjs/testing';
import { ObeCalculationService } from './obe-calculation.service';

describe('ObeCalculationService', () => {
  let service: ObeCalculationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObeCalculationService],
    }).compile();

    service = module.get<ObeCalculationService>(ObeCalculationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
