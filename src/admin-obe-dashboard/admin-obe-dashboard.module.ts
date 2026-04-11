import { Module } from '@nestjs/common';
import { AdminObeDashboardService } from './admin-obe-dashboard.service';
import { AdminObeDashboardController } from './admin-obe-dashboard.controller';

@Module({
  controllers: [AdminObeDashboardController],
  providers: [AdminObeDashboardService],
})
export class AdminObeDashboardModule {}
