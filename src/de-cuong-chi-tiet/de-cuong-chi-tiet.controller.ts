import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { DeCuongChiTietService } from "./de-cuong-chi-tiet.service";
import { CreateDeCuongChiTietDto } from "./dto/create-de-cuong-chi-tiet.dto";
import { UpdateDeCuongChiTietDto } from "./dto/update-de-cuong-chi-tiet.dto";

@ApiTags("de-cuong-chi-tiet")
@Controller("de-cuong-chi-tiet")
export class DeCuongChiTietController {
  constructor(private readonly service: DeCuongChiTietService) {}

  @Post()
  create(@Body() dto: CreateDeCuongChiTietDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: "maHocPhan", required: false, description: "Lọc theo mã học phần" })
  findAll(@Query("maHocPhan") maHocPhan?: string) {
    return this.service.findAll(maHocPhan?.trim() || undefined);
  }

  @Get("active/:maHocPhan")
  findActiveByHocPhan(@Param("maHocPhan") maHocPhan: string) {
    return this.service.findActiveByHocPhan(maHocPhan);
  }

  @Get(":maDeCuong")
  findOne(@Param("maDeCuong") maDeCuong: string) {
    return this.service.findOne(maDeCuong);
  }

  @Patch(":maDeCuong")
  update(@Param("maDeCuong") maDeCuong: string, @Body() dto: UpdateDeCuongChiTietDto) {
    return this.service.update(maDeCuong, dto);
  }

  @Delete(":maDeCuong")
  remove(@Param("maDeCuong") maDeCuong: string) {
    return this.service.remove(maDeCuong);
  }

  @Get(":maDeCuong/clo-plo-mapping")
  @ApiQuery({ name: "maSoNganh", required: false, description: "Chỉ lấy ma trận theo phiên bản CTĐT (kèm khoa)" })
  @ApiQuery({ name: "khoa", required: false, description: "Khóa niên khóa (số nguyên, kèm maSoNganh)" })
  getCloPloMappingMatrix(
    @Param("maDeCuong") maDeCuong: string,
    @Query("maSoNganh") maSoNganh?: string,
    @Query("khoa") khoaStr?: string,
  ) {
    const khoa = khoaStr != null && khoaStr !== "" ? Number(khoaStr) : undefined;
    return this.service.getCloPloMappingMatrix(maDeCuong, {
      maSoNganh: maSoNganh?.trim() || undefined,
      khoa: khoa !== undefined && Number.isInteger(khoa) ? khoa : undefined,
    });
  }

  @Get(":maDeCuong/clo-co-mapping")
  getCloCoMappingMatrix(@Param("maDeCuong") maDeCuong: string) {
    return this.service.getCloCoMappingMatrix(maDeCuong);
  }

  @Get(":maDeCuong/cdg-co-mapping")
  getCdgCoMappingMatrix(@Param("maDeCuong") maDeCuong: string) {
    return this.service.getCdgCoMappingMatrix(maDeCuong);
  }
}
