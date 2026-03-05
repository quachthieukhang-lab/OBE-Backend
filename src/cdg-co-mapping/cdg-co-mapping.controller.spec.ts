import { Test, TestingModule } from '@nestjs/testing';
import { CdgCoMappingController } from './cdg-co-mapping.controller';
import { CdgCoMappingService } from './cdg-co-mapping.service';

describe('CdgCoMappingController', () => {
  let controller: CdgCoMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdgCoMappingController],
      providers: [CdgCoMappingService],
    }).compile();

    controller = module.get<CdgCoMappingController>(CdgCoMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
