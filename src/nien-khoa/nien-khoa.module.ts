import { Module } from '@nestjs/common';
import { NienKhoaService } from './nien-khoa.service';
import { NienKhoaController } from './nien-khoa.controller';

@Module({
  controllers: [NienKhoaController],
  providers: [NienKhoaService],
})
export class NienKhoaModule {}
