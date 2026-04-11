import { Test, TestingModule } from '@nestjs/testing';
import { AdminObeDashboardController } from './admin-obe-dashboard.controller';
import { AdminObeDashboardService } from './admin-obe-dashboard.service';

describe('AdminObeDashboardController', () => {
  let controller: AdminObeDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminObeDashboardController],
      providers: [AdminObeDashboardService],
    }).compile();

    controller = module.get<AdminObeDashboardController>(AdminObeDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
