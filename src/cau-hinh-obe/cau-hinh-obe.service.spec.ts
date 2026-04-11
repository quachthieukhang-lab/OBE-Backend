import { Test, TestingModule } from '@nestjs/testing';
import { CauHinhObeService } from './cau-hinh-obe.service';

describe('CauHinhObeService', () => {
  let service: CauHinhObeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CauHinhObeService],
    }).compile();

    service = module.get<CauHinhObeService>(CauHinhObeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
