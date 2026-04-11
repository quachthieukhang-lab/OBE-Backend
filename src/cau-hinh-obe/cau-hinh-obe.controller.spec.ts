import { Test, TestingModule } from '@nestjs/testing';
import { CauHinhObeController } from './cau-hinh-obe.controller';
import { CauHinhObeService } from './cau-hinh-obe.service';

describe('CauHinhObeController', () => {
  let controller: CauHinhObeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CauHinhObeController],
      providers: [CauHinhObeService],
    }).compile();

    controller = module.get<CauHinhObeController>(CauHinhObeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
