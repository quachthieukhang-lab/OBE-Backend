import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloService } from "./clo.service";
import { CreateCloDto } from "./dto/create-clo.dto";
import { UpdateCloDto } from "./dto/update-clo.dto";

@ApiTags("clo")
@Controller("hoc-phan/:maHocPhan/clo")
export class CloController {
  constructor(private readonly service: CloService) {}

  @Post()
  create(@Param("maHocPhan") maHocPhan: string, @Body() dto: CreateCloDto) {
    return this.service.create(maHocPhan, dto);
  }

  @Get()
  findAll(@Param("maHocPhan") maHocPhan: string) {
    return this.service.findAll(maHocPhan);
  }

  @Get(":maCLO")
  findOne(@Param("maHocPhan") maHocPhan: string, @Param("maCLO") maCLO: string) {
    return this.service.findOne(maHocPhan, maCLO);
  }

  @Patch(":maCLO")
  update(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Body() dto: UpdateCloDto
  ) {
    return this.service.update(maHocPhan, maCLO, dto);
  }

  @Delete(":maCLO")
  remove(@Param("maHocPhan") maHocPhan: string, @Param("maCLO") maCLO: string) {
    return this.service.remove(maHocPhan, maCLO);
  }
}