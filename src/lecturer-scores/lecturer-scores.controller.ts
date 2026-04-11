import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LecturerScoresService } from "./lecturer-scores.service";
import { CreateLecturerScoreDto } from "./dto/create-lecturer-score.dto";
import { UpdateLecturerScoreDto } from "./dto/update-lecturer-score.dto";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { Roles } from "src/modules/auth/roles.decorator";
import { Role } from "src/modules/auth/role.enum";

// Sau này bật guard thật
@ApiTags("lecturer-scores")
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LECTURER)
@Controller("lecturer")
export class LecturerScoresController {
  constructor(private readonly service: LecturerScoresService) {}

  @Get("my-classes")
  listMyClasses(@Req() req: any) {
    return this.service.listMyClasses(req.user.msgv);
  }

  @Get("my-classes/:maLopHocPhan/enrollments")
  listMyClassEnrollments(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
  ) {
    return this.service.listMyClassEnrollments(req.user.msgv, maLopHocPhan);
  }

  @Get("my-classes/:maLopHocPhan/cach-danh-gia")
  listMyClassCachDanhGia(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
  ) {
    return this.service.listMyClassCachDanhGia(req.user.msgv, maLopHocPhan);
  }

  @Get("enrollments/:maDangKy/scores")
  listEnrollmentScores(@Req() req: any, @Param("maDangKy") maDangKy: string) {
    return this.service.listEnrollmentScores(req.user.msgv, maDangKy);
  }

  @Post("enrollments/:maDangKy/scores")
  createEnrollmentScore(
    @Req() req: any,
    @Param("maDangKy") maDangKy: string,
    @Body() dto: CreateLecturerScoreDto,
  ) {
    return this.service.createEnrollmentScore(req.user.msgv, maDangKy, dto);
  }

  @Patch("enrollments/:maDangKy/scores/:maCDG")
  updateEnrollmentScore(
    @Req() req: any,
    @Param("maDangKy") maDangKy: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: UpdateLecturerScoreDto,
  ) {
    return this.service.updateEnrollmentScore(req.user.msgv, maDangKy, maCDG, dto);
  }

  @Delete("enrollments/:maDangKy/scores/:maCDG")
  deleteEnrollmentScore(
    @Req() req: any,
    @Param("maDangKy") maDangKy: string,
    @Param("maCDG") maCDG: string,
  ) {
    return this.service.deleteEnrollmentScore(req.user.msgv, maDangKy, maCDG);
  }
}