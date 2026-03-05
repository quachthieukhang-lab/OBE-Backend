import { Module } from '@nestjs/common';
import { CoService } from './co.service';
import { CoController } from './co.controller';

@Module({
  controllers: [CoController],
  providers: [CoService],
})
export class CoModule {}
