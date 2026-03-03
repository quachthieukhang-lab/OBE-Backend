import { Test, TestingModule } from '@nestjs/testing';
import { HocPhanController } from './hoc-phan.controller';
import { HocPhanService } from './hoc-phan.service';

describe('HocPhanController', () => {
  let controller: HocPhanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HocPhanController],
      providers: [HocPhanService],
    }).compile();

    controller = module.get<HocPhanController>(HocPhanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
