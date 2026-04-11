import { Test, TestingModule } from '@nestjs/testing';
import { LecturerScoresController } from './lecturer-scores.controller';
import { LecturerScoresService } from './lecturer-scores.service';

describe('LecturerScoresController', () => {
  let controller: LecturerScoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturerScoresController],
      providers: [LecturerScoresService],
    }).compile();

    controller = module.get<LecturerScoresController>(LecturerScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
