import { Test, TestingModule } from '@nestjs/testing';
import { CloPloMappingController } from './clo-plo-mapping.controller';
import { CloPloMappingService } from './clo-plo-mapping.service';

describe('CloPloMappingController', () => {
  let controller: CloPloMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloPloMappingController],
      providers: [CloPloMappingService],
    }).compile();

    controller = module.get<CloPloMappingController>(CloPloMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
