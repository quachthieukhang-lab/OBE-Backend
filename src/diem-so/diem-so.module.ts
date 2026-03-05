import { Module } from '@nestjs/common';
import { DiemSoService } from './diem-so.service';
import { DiemSoController } from './diem-so.controller';

@Module({
  controllers: [DiemSoController],
  providers: [DiemSoService],
})
export class DiemSoModule {}
