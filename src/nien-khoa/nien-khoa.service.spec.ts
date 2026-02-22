import { Test, TestingModule } from '@nestjs/testing';
import { NienKhoaService } from './nien-khoa.service';

describe('NienKhoaService', () => {
  let service: NienKhoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NienKhoaService],
    }).compile();

    service = module.get<NienKhoaService>(NienKhoaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
