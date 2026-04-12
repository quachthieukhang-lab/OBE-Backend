import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CloPloMappingService, type CloPloCohortScope } from "./clo-plo-mapping.service";
import { CreateCloPloMappingDto } from "./dto/create-clo-plo-mapping.dto";
import { UpdateCloPloMappingDto } from "./dto/update-clo-plo-mapping.dto";

@ApiTags("clo-plo-mapping")
@Controller("de-cuong-chi-tiet/:maDeCuong/clo/:maCLO/plo-mapping")
export class CloPloMappingController {
  constructor(private readonly service: CloPloMappingService) {}

  private cohortFromQuery(maSoNganh?: string, khoaStr?: string): Partial<CloPloCohortScope> | undefined {
    const ma = maSoNganh?.trim();
    const hasMa = ma != null && ma !== "";
    const hasKhoaStr = khoaStr != null && khoaStr !== "";
    if (!hasMa && !hasKhoaStr) return undefined;
    const khoa = hasKhoaStr ? Number(khoaStr) : undefined;
    return { maSoNganh: hasMa ? ma : undefined, khoa };
  }

  @Post()
  @ApiQuery({ name: "maSoNganh", required: true, description: "Ngành — phiên bản CTĐT khi map CLO–PLO" })
  @ApiQuery({ name: "khoa", required: true, description: "Khóa (số nguyên)" })
  create(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Query("maSoNganh") maSoNganh: string,
    @Query("khoa") khoaStr: string,
    @Body() dto: CreateCloPloMappingDto,
  ) {
    return this.service.create(maDeCuong, maCLO, dto, this.cohortFromQuery(maSoNganh, khoaStr));
  }

  @Get()
  @ApiQuery({ name: "maSoNganh", required: false, description: "Lọc mapping theo phiên bản CTĐT (kèm khoa)" })
  @ApiQuery({ name: "khoa", required: false })
  findAll(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Query("maSoNganh") maSoNganh?: string,
    @Query("khoa") khoaStr?: string,
  ) {
    return this.service.findAll(maDeCuong, maCLO, this.cohortFromQuery(maSoNganh, khoaStr));
  }

  @Get(":maPLO")
  @ApiQuery({ name: "maSoNganh", required: false })
  @ApiQuery({ name: "khoa", required: false })
  findOne(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Param("maPLO") maPLO: string,
    @Query("maSoNganh") maSoNganh?: string,
    @Query("khoa") khoaStr?: string,
  ) {
    return this.service.findOne(maDeCuong, maCLO, maPLO, this.cohortFromQuery(maSoNganh, khoaStr));
  }

  @Patch(":maPLO")
  @ApiQuery({ name: "maSoNganh", required: false })
  @ApiQuery({ name: "khoa", required: false })
  update(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Param("maPLO") maPLO: string,
    @Body() dto: UpdateCloPloMappingDto,
    @Query("maSoNganh") maSoNganh?: string,
    @Query("khoa") khoaStr?: string,
  ) {
    return this.service.update(maDeCuong, maCLO, maPLO, dto, this.cohortFromQuery(maSoNganh, khoaStr));
  }

  @Delete(":maPLO")
  @ApiQuery({ name: "maSoNganh", required: false })
  @ApiQuery({ name: "khoa", required: false })
  remove(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Param("maPLO") maPLO: string,
    @Query("maSoNganh") maSoNganh?: string,
    @Query("khoa") khoaStr?: string,
  ) {
    return this.service.remove(maDeCuong, maCLO, maPLO, this.cohortFromQuery(maSoNganh, khoaStr));
  }
}
