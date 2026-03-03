import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChuongTrinhDaoTaoHocPhanService } from "./chuong-trinh-dao-tao-hoc-phan.service";
import { CreateChuongTrinhDaoTaoHocPhanDto } from "./dto/create-chuong-trinh-dao-tao-hoc-phan.dto";
import { UpdateChuongTrinhDaoTaoHocPhanDto } from "./dto/update-chuong-trinh-dao-tao-hoc-phan.dto";

@ApiTags("chuong-trinh-dao-tao-hoc-phan")
@Controller("chuong-trinh-dao-tao/:maSoNganh/hoc-phan")
export class ChuongTrinhDaoTaoHocPhanController {
  constructor(private readonly service: ChuongTrinhDaoTaoHocPhanService) {}

  @Post()
  create(@Param("maSoNganh") maSoNganh: string, @Body() dto: CreateChuongTrinhDaoTaoHocPhanDto) {
    return this.service.create(maSoNganh, dto);
  }

  @Get()
  findAll(@Param("maSoNganh") maSoNganh: string) {
    return this.service.findAll(maSoNganh);
  }

  @Get(":maHocPhan")
  findOne(@Param("maSoNganh") maSoNganh: string, @Param("maHocPhan") maHocPhan: string) {
    return this.service.findOne(maSoNganh, maHocPhan);
  }

  @Patch(":maHocPhan")
  update(
    @Param("maSoNganh") maSoNganh: string,
    @Param("maHocPhan") maHocPhan: string,
    @Body() dto: UpdateChuongTrinhDaoTaoHocPhanDto
  ) {
    return this.service.update(maSoNganh, maHocPhan, dto);
  }

  @Delete(":maHocPhan")
  remove(@Param("maSoNganh") maSoNganh: string, @Param("maHocPhan") maHocPhan: string) {
    return this.service.remove(maSoNganh, maHocPhan);
  }
}