import { Test, TestingModule } from '@nestjs/testing';
import { NienKhoaController } from './nien-khoa.controller';
import { NienKhoaService } from './nien-khoa.service';

describe('NienKhoaController', () => {
  let controller: NienKhoaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NienKhoaController],
      providers: [NienKhoaService],
    }).compile();

    controller = module.get<NienKhoaController>(NienKhoaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
