import { Test, TestingModule } from '@nestjs/testing';
import { CloCoMappingController } from './clo-co-mapping.controller';
import { CloCoMappingService } from './clo-co-mapping.service';

describe('CloCoMappingController', () => {
  let controller: CloCoMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloCoMappingController],
      providers: [CloCoMappingService],
    }).compile();

    controller = module.get<CloCoMappingController>(CloCoMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
