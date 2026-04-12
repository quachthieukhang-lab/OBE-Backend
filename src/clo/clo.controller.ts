import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CloService } from "./clo.service";
import { CreateCloDto } from "./dto/create-clo.dto";
import { UpdateCloDto } from "./dto/update-clo.dto";

@ApiTags("clo")
@Controller("de-cuong-chi-tiet/:maDeCuong/clo")
export class CloController {
  constructor(private readonly service: CloService) {}

  @Post()
  create(@Param("maDeCuong") maDeCuong: string, @Body() dto: CreateCloDto) {
    return this.service.create(maDeCuong, dto);
  }

  @Get()
  findAll(@Param("maDeCuong") maDeCuong: string) {
    return this.service.findAll(maDeCuong);
  }

  @Get(":maCLO")
  findOne(@Param("maDeCuong") maDeCuong: string, @Param("maCLO") maCLO: string) {
    return this.service.findOne(maDeCuong, maCLO);
  }

  @Patch(":maCLO")
  update(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCLO") maCLO: string,
    @Body() dto: UpdateCloDto
  ) {
    return this.service.update(maDeCuong, maCLO, dto);
  }

  @Delete(":maCLO")
  remove(@Param("maDeCuong") maDeCuong: string, @Param("maCLO") maCLO: string) {
    return this.service.remove(maDeCuong, maCLO);
  }
}
