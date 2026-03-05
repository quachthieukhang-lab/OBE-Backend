import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DangKyHocPhanService } from "./dang-ky-hoc-phan.service";
import { CreateDangKyHocPhanDto } from "./dto/create-dang-ky-hoc-phan.dto";
import { UpdateDangKyHocPhanDto } from "./dto/update-dang-ky-hoc-phan.dto";

@ApiTags("dang-ky-hoc-phan")
@Controller("lop-hoc-phan/:maLopHocPhan/dang-ky")
export class DangKyHocPhanController {
  constructor(private readonly service: DangKyHocPhanService) {}

  @Post()
  create(@Param("maLopHocPhan") maLopHocPhan: string, @Body() dto: CreateDangKyHocPhanDto) {
    return this.service.create(maLopHocPhan, dto);
  }

  @Get()
  findAll(@Param("maLopHocPhan") maLopHocPhan: string) {
    return this.service.findAll(maLopHocPhan);
  }

  // detail by maDangKy (uuid)
  @Get("/by-id/:maDangKy")
  findOne(@Param("maDangKy") maDangKy: string) {
    return this.service.findOne(maDangKy);
  }

  @Patch("/by-id/:maDangKy")
  update(@Param("maDangKy") maDangKy: string, @Body() dto: UpdateDangKyHocPhanDto) {
    return this.service.update(maDangKy, dto);
  }

  @Delete("/by-id/:maDangKy")
  remove(@Param("maDangKy") maDangKy: string) {
    return this.service.remove(maDangKy);
  }
}