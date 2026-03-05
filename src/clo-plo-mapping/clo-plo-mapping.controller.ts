import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloPloMappingService } from "./clo-plo-mapping.service";
import { CreateCloPloMappingDto } from "./dto/create-clo-plo-mapping.dto";
import { UpdateCloPloMappingDto } from "./dto/update-clo-plo-mapping.dto";

@ApiTags("clo-plo-mapping")
@Controller("hoc-phan/:maHocPhan/clo/:maCLO/plo-mapping")
export class CloPloMappingController {
  constructor(private readonly service: CloPloMappingService) {}

  @Post()
  create(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Body() dto: CreateCloPloMappingDto
  ) {
    return this.service.create(maHocPhan, maCLO, dto);
  }

  @Get()
  findAll(@Param("maHocPhan") maHocPhan: string, @Param("maCLO") maCLO: string) {
    return this.service.findAll(maHocPhan, maCLO);
  }

  @Get(":maPLO")
  findOne(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Param("maPLO") maPLO: string
  ) {
    return this.service.findOne(maHocPhan, maCLO, maPLO);
  }

  @Patch(":maPLO")
  update(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Param("maPLO") maPLO: string,
    @Body() dto: UpdateCloPloMappingDto
  ) {
    return this.service.update(maHocPhan, maCLO, maPLO, dto);
  }

  @Delete(":maPLO")
  remove(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Param("maPLO") maPLO: string
  ) {
    return this.service.remove(maHocPhan, maCLO, maPLO);
  }
}