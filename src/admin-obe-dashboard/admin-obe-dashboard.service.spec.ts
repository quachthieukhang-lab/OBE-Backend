import { Test, TestingModule } from '@nestjs/testing';
import { AdminObeDashboardService } from './admin-obe-dashboard.service';

describe('AdminObeDashboardService', () => {
  let service: AdminObeDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminObeDashboardService],
    }).compile();

    service = module.get<AdminObeDashboardService>(AdminObeDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
