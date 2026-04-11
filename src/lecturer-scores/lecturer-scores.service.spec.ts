import { Test, TestingModule } from '@nestjs/testing';
import { LecturerScoresService } from './lecturer-scores.service';

describe('LecturerScoresService', () => {
  let service: LecturerScoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturerScoresService],
    }).compile();

    service = module.get<LecturerScoresService>(LecturerScoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
