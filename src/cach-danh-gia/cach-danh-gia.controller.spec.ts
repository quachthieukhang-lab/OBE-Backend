import { Test, TestingModule } from '@nestjs/testing';
import { CachDanhGiaController } from './cach-danh-gia.controller';
import { CachDanhGiaService } from './cach-danh-gia.service';

describe('CachDanhGiaController', () => {
  let controller: CachDanhGiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CachDanhGiaController],
      providers: [CachDanhGiaService],
    }).compile();

    controller = module.get<CachDanhGiaController>(CachDanhGiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
