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
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/roles.decorator";
import { Role } from "src/modules/auth/role.enum";
import { LecturerDeCuongService } from "./lecturer-de-cuong.service";
import { UpdateAssignmentStatusDto } from "./dto/update-assignment-status.dto";
import { CreateLecturerSyllabusDto } from "./dto/create-lecturer-syllabus.dto";
import { UpdateLecturerSyllabusDto } from "./dto/update-lecturer-syllabus.dto";
import { CreateCloDto } from "src/clo/dto/create-clo.dto";
import { UpdateCloDto } from "src/clo/dto/update-clo.dto";
import { CreateCoDto } from "src/co/dto/create-co.dto";
import { UpdateCoDto } from "src/co/dto/update-co.dto";
import { CreateCachDanhGiaDto } from "src/cach-danh-gia/dto/create-cach-danh-gia.dto";
import { UpdateCachDanhGiaDto } from "src/cach-danh-gia/dto/update-cach-danh-gia.dto";

@ApiTags("lecturer-de-cuong")
@ApiBearerAuth("bearer")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LECTURER)
@Controller("lecturer/de-cuong")
export class LecturerDeCuongController {
  constructor(private readonly service: LecturerDeCuongService) {}

  // ─── Assignments ──────────────────────────────────────────

  @Get("my-assignments")
  listMyAssignments(@Req() req: any) {
    return this.service.listMyAssignments(req.user.msgv);
  }

  @Get("my-assignments/:maBanPhanCong")
  getAssignmentDetail(
    @Req() req: any,
    @Param("maBanPhanCong") maBanPhanCong: string,
  ) {
    return this.service.getAssignmentDetail(req.user.msgv, maBanPhanCong);
  }

  @Patch("my-assignments/:maBanPhanCong/status")
  updateAssignmentStatus(
    @Req() req: any,
    @Param("maBanPhanCong") maBanPhanCong: string,
    @Body() dto: UpdateAssignmentStatusDto,
  ) {
    return this.service.updateAssignmentStatus(
      req.user.msgv,
      maBanPhanCong,
      dto.trangThai,
    );
  }

  // ─── Syllabus ─────────────────────────────────────────────

  @Get("my-syllabi")
  listMySyllabi(@Req() req: any) {
    return this.service.listMySyllabi(req.user.msgv);
  }

  @Post("my-assignments/:maBanPhanCong/syllabus")
  createSyllabus(
    @Req() req: any,
    @Param("maBanPhanCong") maBanPhanCong: string,
    @Body() dto: CreateLecturerSyllabusDto,
  ) {
    return this.service.createSyllabus(req.user.msgv, maBanPhanCong, dto);
  }

  @Get("syllabus/:maDeCuong")
  getSyllabusDetail(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
  ) {
    return this.service.getSyllabusDetail(req.user.msgv, maDeCuong);
  }

  @Patch("syllabus/:maDeCuong")
  updateSyllabus(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Body() dto: UpdateLecturerSyllabusDto,
  ) {
    return this.service.updateSyllabus(req.user.msgv, maDeCuong, dto);
  }

  @Delete("syllabus/:maDeCuong")
  deleteSyllabus(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
  ) {
    return this.service.deleteSyllabus(req.user.msgv, maDeCuong);
  }

  // ─── CLO ──────────────────────────────────────────────────

  @Get("syllabus/:maDeCuong/clo")
  listCLOs(@Req() req: any, @Param("maDeCuong") maDeCuong: string) {
    return this.service.listCLOs(req.user.msgv, maDeCuong);
  }

  @Post("syllabus/:maDeCuong/clo")
  createCLO(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Body() dto: CreateCloDto,
  ) {
    return this.service.createCLO(req.user.msgv, maDeCuong, dto);
  }

  @Patch("syllabus/:maDeCuong/clo/:maCLO")
  updateCLO(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Body() dto: UpdateCloDto,
  ) {
    return this.service.updateCLO(req.user.msgv, maDeCuong, maCLO, dto);
  }

  @Delete("syllabus/:maDeCuong/clo/:maCLO")
  deleteCLO(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
  ) {
    return this.service.deleteCLO(req.user.msgv, maDeCuong, maCLO);
  }

  // ─── CO ───────────────────────────────────────────────────

  @Get("syllabus/:maDeCuong/co")
  listCOs(@Req() req: any, @Param("maDeCuong") maDeCuong: string) {
    return this.service.listCOs(req.user.msgv, maDeCuong);
  }

  @Post("syllabus/:maDeCuong/co")
  createCO(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Body() dto: CreateCoDto,
  ) {
    return this.service.createCO(req.user.msgv, maDeCuong, dto);
  }

  @Patch("syllabus/:maDeCuong/co/:maCO")
  updateCO(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCoDto,
  ) {
    return this.service.updateCO(req.user.msgv, maDeCuong, maCO, dto);
  }

  @Delete("syllabus/:maDeCuong/co/:maCO")
  deleteCO(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCO") maCO: string,
  ) {
    return this.service.deleteCO(req.user.msgv, maDeCuong, maCO);
  }

  // ─── Cach Danh Gia ────────────────────────────────────────

  @Get("syllabus/:maDeCuong/cach-danh-gia")
  listCachDanhGia(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
  ) {
    return this.service.listCachDanhGia(req.user.msgv, maDeCuong);
  }

  @Post("syllabus/:maDeCuong/cach-danh-gia")
  createCachDanhGia(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Body() dto: CreateCachDanhGiaDto,
  ) {
    return this.service.createCachDanhGia(req.user.msgv, maDeCuong, dto);
  }

  @Patch("syllabus/:maDeCuong/cach-danh-gia/:maCDG")
  updateCachDanhGia(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: UpdateCachDanhGiaDto,
  ) {
    return this.service.updateCachDanhGia(
      req.user.msgv,
      maDeCuong,
      maCDG,
      dto,
    );
  }

  @Delete("syllabus/:maDeCuong/cach-danh-gia/:maCDG")
  deleteCachDanhGia(
    @Req() req: any,
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
  ) {
    return this.service.deleteCachDanhGia(req.user.msgv, maDeCuong, maCDG);
  }
}
