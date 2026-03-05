import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloCoMappingService } from "./clo-co-mapping.service";
import { CreateCloCoMappingDto } from "./dto/create-clo-co-mapping.dto";
import { UpdateCloCoMappingDto } from "./dto/update-clo-co-mapping.dto";

@ApiTags("clo-co-mapping")
@Controller("hoc-phan/:maHocPhan/clo/:maCLO/co-mapping")
export class CloCoMappingController {
  constructor(private readonly service: CloCoMappingService) {}

  @Post()
  create(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Body() dto: CreateCloCoMappingDto
  ) {
    return this.service.create(maHocPhan, maCLO, dto);
  }

  @Get()
  findAll(@Param("maHocPhan") maHocPhan: string, @Param("maCLO") maCLO: string) {
    return this.service.findAll(maHocPhan, maCLO);
  }

  @Get(":maCO")
  findOne(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Param("maCO") maCO: string
  ) {
    return this.service.findOne(maHocPhan, maCLO, maCO);
  }

  @Patch(":maCO")
  update(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maCLO: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCloCoMappingDto
  ) {
    return this.service.update(maHocPhan, maCLO, maCO, dto);
  }

  @Delete(":maCO")
  remove(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCLO") maClo: string,
    @Param("maCO") maCO: string
  ) {
    return this.service.remove(maHocPhan, maClo, maCO);
  }
}