import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CachDanhGiaService } from "./cach-danh-gia.service";
import { CreateCachDanhGiaDto } from "./dto/create-cach-danh-gia.dto";
import { UpdateCachDanhGiaDto } from "./dto/update-cach-danh-gia.dto";

@ApiTags("cach-danh-gia")
@Controller("de-cuong-chi-tiet/:maDeCuong/cach-danh-gia")
export class CachDanhGiaController {
  constructor(private readonly service: CachDanhGiaService) {}

  @Post()
  create(@Param("maDeCuong") maDeCuong: string, @Body() dto: CreateCachDanhGiaDto) {
    return this.service.create(maDeCuong, dto);
  }

  @Get()
  findAll(@Param("maDeCuong") maDeCuong: string) {
    return this.service.findAll(maDeCuong);
  }

  @Get(":maCDG")
  findOne(@Param("maDeCuong") maDeCuong: string, @Param("maCDG") maCDG: string) {
    return this.service.findOne(maDeCuong, maCDG);
  }

  @Patch(":maCDG")
  update(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: UpdateCachDanhGiaDto
  ) {
    return this.service.update(maDeCuong, maCDG, dto);
  }

  @Delete(":maCDG")
  remove(@Param("maDeCuong") maDeCuong: string, @Param("maCDG") maCDG: string) {
    return this.service.remove(maDeCuong, maCDG);
  }
}
