import { Module } from '@nestjs/common';
import { DiemSoService } from './diem-so.service';
import { DiemSoController } from './diem-so.controller';
import { ObeCalculationModule } from "../obe-calculation/obe-calculation.module";

@Module({
  imports: [ObeCalculationModule],
  controllers: [DiemSoController],
  providers: [DiemSoService],
  exports: [DiemSoService]
})
export class DiemSoModule {}
