import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloCoMappingService } from "./clo-co-mapping.service";
import { CreateCloCoMappingDto } from "./dto/create-clo-co-mapping.dto";
import { UpdateCloCoMappingDto } from "./dto/update-clo-co-mapping.dto";

@ApiTags("clo-co-mapping")
@Controller("de-cuong-chi-tiet/:maDeCuong/clo/:maCLO/co-mapping")
export class CloCoMappingController {
  constructor(private readonly service: CloCoMappingService) {}

  @Post()
  create(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Body() dto: CreateCloCoMappingDto,
  ) {
    return this.service.create(maDeCuong, maCLO, dto);
  }

  @Get()
  findAll(@Param("maDeCuong") maDeCuong: string, @Param("maCLO") maCLO: string) {
    return this.service.findAll(maDeCuong, maCLO);
  }

  @Get(":maCO")
  findOne(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Param("maCO") maCO: string,
  ) {
    return this.service.findOne(maDeCuong, maCLO, maCO);
  }

  @Patch(":maCO")
  update(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCloCoMappingDto,
  ) {
    return this.service.update(maDeCuong, maCLO, maCO, dto);
  }

  @Delete(":maCO")
  remove(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Param("maCO") maCO: string,
  ) {
    return this.service.remove(maDeCuong, maCLO, maCO);
  }
}
