import { Test, TestingModule } from '@nestjs/testing';
import { ObeCalculationController } from './obe-calculation.controller';
import { ObeCalculationService } from './obe-calculation.service';

describe('ObeCalculationController', () => {
  let controller: ObeCalculationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObeCalculationController],
      providers: [ObeCalculationService],
    }).compile();

    controller = module.get<ObeCalculationController>(ObeCalculationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
