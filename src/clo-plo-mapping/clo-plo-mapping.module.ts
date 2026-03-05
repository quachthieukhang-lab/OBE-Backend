import { Module } from '@nestjs/common';
import { CloPloMappingService } from './clo-plo-mapping.service';
import { CloPloMappingController } from './clo-plo-mapping.controller';

@Module({
  controllers: [CloPloMappingController],
  providers: [CloPloMappingService],
})
export class CloPloMappingModule {}
