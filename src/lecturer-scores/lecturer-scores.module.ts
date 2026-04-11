import { Module } from "@nestjs/common";
import { LecturerScoresController } from "./lecturer-scores.controller";
import { LecturerScoresService } from "./lecturer-scores.service";
import { DiemSoModule } from "src/diem-so/diem-so.module";

@Module({
  imports: [DiemSoModule],
  controllers: [LecturerScoresController],
  providers: [LecturerScoresService],
})
export class LecturerScoresModule {}