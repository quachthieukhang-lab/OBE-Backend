import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LopHocPhanService } from "./lop-hoc-phan.service";
import { CreateLopHocPhanDto } from "./dto/create-lop-hoc-phan.dto";
import { UpdateLopHocPhanDto } from "./dto/update-lop-hoc-phan.dto";

@ApiTags("lop-hoc-phan")
@Controller("lop-hoc-phan")
export class LopHocPhanController {
  constructor(private readonly service: LopHocPhanService) {}

  @Post()
  create(@Body() dto: CreateLopHocPhanDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":maLopHocPhan")
  findOne(@Param("maLopHocPhan") maLopHocPhan: string) {
    return this.service.findOne(maLopHocPhan);
  }

  @Patch(":maLopHocPhan")
  update(@Param("maLopHocPhan") maLopHocPhan: string, @Body() dto: UpdateLopHocPhanDto) {
    return this.service.update(maLopHocPhan, dto);
  }

  @Delete(":maLopHocPhan")
  remove(@Param("maLopHocPhan") maLopHocPhan: string) {
    return this.service.remove(maLopHocPhan);
  }
}