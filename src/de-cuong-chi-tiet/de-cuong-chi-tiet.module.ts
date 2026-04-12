import { Module } from "@nestjs/common";
import { DeCuongChiTietService } from "./de-cuong-chi-tiet.service";
import { DeCuongChiTietController } from "./de-cuong-chi-tiet.controller";

@Module({
  controllers: [DeCuongChiTietController],
  providers: [DeCuongChiTietService],
  exports: [DeCuongChiTietService],
})
export class DeCuongChiTietModule {}
