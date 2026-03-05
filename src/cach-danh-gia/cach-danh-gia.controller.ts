import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CachDanhGiaService } from "./cach-danh-gia.service";
import { CreateCachDanhGiaDto } from "./dto/create-cach-danh-gia.dto";
import { UpdateCachDanhGiaDto } from "./dto/update-cach-danh-gia.dto";

@ApiTags("cach-danh-gia")
@Controller("hoc-phan/:maHocPhan/cach-danh-gia")
export class CachDanhGiaController {
  constructor(private readonly service: CachDanhGiaService) {}

  @Post()
  create(@Param("maHocPhan") maHocPhan: string, @Body() dto: CreateCachDanhGiaDto) {
    return this.service.create(maHocPhan, dto);
  }

  @Get()
  findAll(@Param("maHocPhan") maHocPhan: string) {
    return this.service.findAll(maHocPhan);
  }

  @Get(":maCDG")
  findOne(@Param("maHocPhan") maHocPhan: string, @Param("maCDG") maCDG: string) {
    return this.service.findOne(maHocPhan, maCDG);
  }

  @Patch(":maCDG")
  update(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: UpdateCachDanhGiaDto
  ) {
    return this.service.update(maHocPhan, maCDG, dto);
  }

  @Delete(":maCDG")
  remove(@Param("maHocPhan") maHocPhan: string, @Param("maCDG") maCDG: string) {
    return this.service.remove(maHocPhan, maCDG);
  }
}