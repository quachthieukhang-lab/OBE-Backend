import { Test, TestingModule } from '@nestjs/testing';
import { DiemSoController } from './diem-so.controller';
import { DiemSoService } from './diem-so.service';

describe('DiemSoController', () => {
  let controller: DiemSoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiemSoController],
      providers: [DiemSoService],
    }).compile();

    controller = module.get<DiemSoController>(DiemSoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
