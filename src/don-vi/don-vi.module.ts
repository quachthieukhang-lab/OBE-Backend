import { Module } from '@nestjs/common';
import { DonViService } from './don-vi.service';
import { DonViController } from './don-vi.controller';

@Module({
  controllers: [DonViController],
  providers: [DonViService],
})
export class DonViModule {}
