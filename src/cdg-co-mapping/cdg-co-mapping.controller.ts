import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CdgCoMappingService } from "./cdg-co-mapping.service";
import { CreateCdgCoMappingDto } from "./dto/create-cdg-co-mapping.dto";
import { UpdateCdgCoMappingDto } from "./dto/update-cdg-co-mapping.dto";

@ApiTags("cdg-co-mapping")
@Controller("hoc-phan/:maHocPhan/cach-danh-gia/:maCDG/co-mapping")
export class CdgCoMappingController {
  constructor(private readonly service: CdgCoMappingService) {}

  @Post()
  create(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: CreateCdgCoMappingDto
  ) {
    return this.service.create(maHocPhan, maCDG, dto);
  }

  @Get()
  findAll(@Param("maHocPhan") maHocPhan: string, @Param("maCDG") maCDG: string) {
    return this.service.findAll(maHocPhan, maCDG);
  }

  @Get(":maCO")
  findOne(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCDG") maCDG: string,
    @Param("maCO") maCO: string
  ) {
    return this.service.findOne(maHocPhan, maCDG, maCO);
  }

  @Patch(":maCO")
  update(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCDG") maCDG: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCdgCoMappingDto
  ) {
    return this.service.update(maHocPhan, maCDG, maCO, dto);
  }

  @Delete(":maCO")
  remove(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCDG") maCDG: string,
    @Param("maCO") maCO: string
  ) {
    return this.service.remove(maHocPhan, maCDG, maCO);
  }
}