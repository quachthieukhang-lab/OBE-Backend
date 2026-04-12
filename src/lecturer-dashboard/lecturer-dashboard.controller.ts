import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/roles.decorator";
import { Role } from "src/modules/auth/role.enum";
import { LecturerDashboardService } from "./lecturer-dashboard.service";

@ApiTags("lecturer-dashboard")
@ApiBearerAuth("bearer")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LECTURER)
@Controller("lecturer/dashboard")
export class LecturerDashboardController {
  constructor(private readonly service: LecturerDashboardService) {}

  @Get("overview")
  @ApiQuery({ name: "khoa", required: false, type: Number })
  @ApiQuery({ name: "hocKy", required: false, type: Number })
  getOverview(
    @Req() req: any,
    @Query("khoa") khoa?: string,
    @Query("hocKy") hocKy?: string,
  ) {
    return this.service.getOverview(
      req.user.msgv,
      khoa ? Number(khoa) : undefined,
      hocKy ? Number(hocKy) : undefined,
    );
  }

  @Get("classes/:maLopHocPhan/score-distribution")
  getScoreDistribution(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
  ) {
    return this.service.getScoreDistribution(req.user.msgv, maLopHocPhan);
  }

  @Get("classes/:maLopHocPhan/clo-summary")
  @ApiQuery({ name: "nguongDat", required: false, type: Number })
  getCloSummary(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
    @Query("nguongDat") nguongDat?: string,
  ) {
    return this.service.getCloSummary(
      req.user.msgv,
      maLopHocPhan,
      nguongDat ? Number(nguongDat) : undefined,
    );
  }

  @Get("classes/:maLopHocPhan/co-summary")
  @ApiQuery({ name: "nguongDat", required: false, type: Number })
  getCoSummary(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
    @Query("nguongDat") nguongDat?: string,
  ) {
    return this.service.getCoSummary(
      req.user.msgv,
      maLopHocPhan,
      nguongDat ? Number(nguongDat) : undefined,
    );
  }

  @Get("classes/:maLopHocPhan/student-obe-details")
  getStudentObeDetails(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
  ) {
    return this.service.getStudentObeDetails(req.user.msgv, maLopHocPhan);
  }

  @Get("classes/:maLopHocPhan/at-risk-students")
  @ApiQuery({ name: "nguongDat", required: false, type: Number })
  getAtRiskStudents(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
    @Query("nguongDat") nguongDat?: string,
  ) {
    return this.service.getAtRiskStudents(
      req.user.msgv,
      maLopHocPhan,
      nguongDat ? Number(nguongDat) : undefined,
    );
  }

  @Get("classes/:maLopHocPhan/score-matrix")
  getScoreMatrix(
    @Req() req: any,
    @Param("maLopHocPhan") maLopHocPhan: string,
  ) {
    return this.service.getScoreMatrix(req.user.msgv, maLopHocPhan);
  }
}
