import { Test, TestingModule } from '@nestjs/testing';
import { CoController } from './co.controller';
import { CoService } from './co.service';

describe('CoController', () => {
  let controller: CoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoController],
      providers: [CoService],
    }).compile();

    controller = module.get<CoController>(CoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
