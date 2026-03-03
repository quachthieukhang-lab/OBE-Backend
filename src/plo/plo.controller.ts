import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PloService } from "./plo.service";
import { CreatePloDto } from "./dto/create-plo.dto";
import { UpdatePloDto } from "./dto/update-plo.dto";

@ApiTags("plo")
@Controller("chuong-trinh-dao-tao/:maSoNganh/plo")
export class PloController {
  constructor(private readonly service: PloService) {}

  @Post()
  create(@Param("maSoNganh") maSoNganh: string, @Body() dto: CreatePloDto) {
    return this.service.create(maSoNganh, dto);
  }

  @Get()
  findAll(@Param("maSoNganh") maSoNganh: string) {
    return this.service.findAll(maSoNganh);
  }

  @Get(":maPLO")
  findOne(@Param("maSoNganh") maSoNganh: string, @Param("maPLO") maPLO: string) {
    return this.service.findOne(maSoNganh, maPLO);
  }

  @Patch(":maPLO")
  update(
    @Param("maSoNganh") maSoNganh: string,
    @Param("maPLO") maPLO: string,
    @Body() dto: UpdatePloDto
  ) {
    return this.service.update(maSoNganh, maPLO, dto);
  }

  @Delete(":maPLO")
  remove(@Param("maSoNganh") maSoNganh: string, @Param("maPLO") maPLO: string) {
    return this.service.remove(maSoNganh, maPLO);
  }
}