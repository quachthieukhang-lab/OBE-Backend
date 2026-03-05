import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DiemSoService } from "./diem-so.service";
import { CreateDiemSoDto } from "./dto/create-diem-so.dto";
import { UpdateDiemSoDto } from "./dto/update-diem-so.dto";

@ApiTags("diem-so")
@Controller("dang-ky-hoc-phan/:maDangKy/diem-so")
export class DiemSoController {
  constructor(private readonly service: DiemSoService) {}

  @Post()
  create(@Param("maDangKy") maDangKy: string, @Body() dto: CreateDiemSoDto) {
    return this.service.create(maDangKy, dto);
  }

  @Get()
  findAll(@Param("maDangKy") maDangKy: string) {
    return this.service.findAll(maDangKy);
  }

  @Get(":maCDG")
  findOne(@Param("maDangKy") maDangKy: string, @Param("maCDG") maCDG: string) {
    return this.service.findOne(maDangKy, maCDG);
  }

  @Patch(":maCDG")
  update(
    @Param("maDangKy") maDangKy: string,
    @Param("maCDG") maCDG: string,
    @Body() dto: UpdateDiemSoDto
  ) {
    return this.service.update(maDangKy, maCDG, dto);
  }

  @Delete(":maCDG")
  remove(@Param("maDangKy") maDangKy: string, @Param("maCDG") maCDG: string) {
    return this.service.remove(maDangKy, maCDG);
  }
}