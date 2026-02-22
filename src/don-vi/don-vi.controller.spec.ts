import { Test, TestingModule } from '@nestjs/testing';
import { DonViController } from './don-vi.controller';
import { DonViService } from './don-vi.service';

describe('DonViController', () => {
  let controller: DonViController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonViController],
      providers: [DonViService],
    }).compile();

    controller = module.get<DonViController>(DonViController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
