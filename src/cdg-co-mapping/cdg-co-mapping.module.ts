import { Module } from '@nestjs/common';
import { CdgCoMappingService } from './cdg-co-mapping.service';
import { CdgCoMappingController } from './cdg-co-mapping.controller';

@Module({
  controllers: [CdgCoMappingController],
  providers: [CdgCoMappingService],
})
export class CdgCoMappingModule {}
