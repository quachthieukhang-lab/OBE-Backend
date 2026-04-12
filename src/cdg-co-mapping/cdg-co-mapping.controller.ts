import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CdgCoMappingService } from "./cdg-co-mapping.service";
import { CreateCdgCoMappingDto } from "./dto/create-cdg-co-mapping.dto";
import { UpdateCdgCoMappingDto } from "./dto/update-cdg-co-mapping.dto";

@ApiTags("cdg-co-mapping")
@Controller("de-cuong-chi-tiet/:maDeCuong/cach-danh-gia/:maCDG/co-mapping")
export class CdgCoMappingController {
  constructor(private readonly service: CdgCoMappingService) {}

  @Post()
  create(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: CreateCdgCoMappingDto,
  ) {
    return this.service.create(maDeCuong, maCDG, dto);
  }

  @Get()
  findAll(@Param("maDeCuong") maDeCuong: string, @Param("maCDG") maCDG: string) {
    return this.service.findAll(maDeCuong, maCDG);
  }

  @Get(":maCO")
  findOne(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
    @Param("maCO") maCO: string,
  ) {
    return this.service.findOne(maDeCuong, maCDG, maCO);
  }

  @Patch(":maCO")
  update(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCdgCoMappingDto,
  ) {
    return this.service.update(maDeCuong, maCDG, maCO, dto);
  }

  @Delete(":maCO")
  remove(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
    @Param("maCO") maCO: string,
  ) {
    return this.service.remove(maDeCuong, maCDG, maCO);
  }
}
