import { Module } from '@nestjs/common';
import { ObeCalculationService } from './obe-calculation.service';
import { ObeCalculationController } from './obe-calculation.controller';

@Module({
  controllers: [ObeCalculationController],
  providers: [ObeCalculationService],
  exports: [ObeCalculationService],
})
export class ObeCalculationModule {}
