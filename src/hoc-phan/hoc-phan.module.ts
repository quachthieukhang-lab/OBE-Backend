import { Module } from '@nestjs/common';
import { HocPhanService } from './hoc-phan.service';
import { HocPhanController } from './hoc-phan.controller';

@Module({
  controllers: [HocPhanController],
  providers: [HocPhanService],
})
export class HocPhanModule {}
