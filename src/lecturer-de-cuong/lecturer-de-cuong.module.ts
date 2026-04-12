import { Module } from "@nestjs/common";
import { LecturerDeCuongController } from "./lecturer-de-cuong.controller";
import { LecturerDeCuongService } from "./lecturer-de-cuong.service";

@Module({
  controllers: [LecturerDeCuongController],
  providers: [LecturerDeCuongService],
})
export class LecturerDeCuongModule {}
