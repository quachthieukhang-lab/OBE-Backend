import { Module } from "@nestjs/common";
import { CauHinhObeController } from "./cau-hinh-obe.controller";
import { CauHinhObeService } from "./cau-hinh-obe.service";

@Module({
  controllers: [CauHinhObeController],
  providers: [CauHinhObeService],
  exports: [CauHinhObeService],
})
export class CauHinhObeModule {}