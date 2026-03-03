import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HocPhanService } from "./hoc-phan.service";
import { CreateHocPhanDto } from "./dto/create-hoc-phan.dto";
import { UpdateHocPhanDto } from "./dto/update-hoc-phan.dto";

@ApiTags("hoc-phan")
@Controller("hoc-phan")
export class HocPhanController {
  constructor(private readonly service: HocPhanService) {}

  @Post()
  create(@Body() dto: CreateHocPhanDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":maHocPhan")
  findOne(@Param("maHocPhan") maHocPhan: string) {
    return this.service.findOne(maHocPhan);
  }

  @Patch(":maHocPhan")
  update(@Param("maHocPhan") maHocPhan: string, @Body() dto: UpdateHocPhanDto) {
    return this.service.update(maHocPhan, dto);
  }

  @Delete(":maHocPhan")
  remove(@Param("maHocPhan") maHocPhan: string) {
    return this.service.remove(maHocPhan);
  }
}