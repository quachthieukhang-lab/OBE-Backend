import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PloService } from "./plo.service";
import { CreatePloDto } from "./dto/create-plo.dto";
import { UpdatePloDto } from "./dto/update-plo.dto";

@ApiTags("plo")
@Controller("chuong-trinh-dao-tao/:maSoNganh/khoa/:khoa/plo")
export class PloController {
  constructor(private readonly service: PloService) {}

  @Post()
  create(
    @Param("maSoNganh") maSoNganh: string,
    @Param("khoa", ParseIntPipe) khoa: number,
    @Body() dto: CreatePloDto,
  ) {
    return this.service.create(maSoNganh, khoa, dto);
  }

  @Get()
  findAll(@Param("maSoNganh") maSoNganh: string, @Param("khoa", ParseIntPipe) khoa: number) {
    return this.service.findAll(maSoNganh, khoa);
  }

  @Get(":maPLO")
  findOne(
    @Param("maSoNganh") maSoNganh: string,
    @Param("khoa", ParseIntPipe) khoa: number,
    @Param("maPLO") maPLO: string,
  ) {
    return this.service.findOne(maSoNganh, khoa, maPLO);
  }

  @Patch(":maPLO")
  update(
    @Param("maSoNganh") maSoNganh: string,
    @Param("khoa", ParseIntPipe) khoa: number,
    @Param("maPLO") maPLO: string,
    @Body() dto: UpdatePloDto,
  ) {
    return this.service.update(maSoNganh, khoa, maPLO, dto);
  }

  @Delete(":maPLO")
  remove(
    @Param("maSoNganh") maSoNganh: string,
    @Param("khoa", ParseIntPipe) khoa: number,
    @Param("maPLO") maPLO: string,
  ) {
    return this.service.remove(maSoNganh, khoa, maPLO);
  }
}
