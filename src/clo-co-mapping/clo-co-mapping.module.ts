import { Module } from '@nestjs/common';
import { CloCoMappingService } from './clo-co-mapping.service';
import { CloCoMappingController } from './clo-co-mapping.controller';

@Module({
  controllers: [CloCoMappingController],
  providers: [CloCoMappingService],
})
export class CloCoMappingModule {}
