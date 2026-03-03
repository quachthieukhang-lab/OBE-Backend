import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChuongTrinhDaoTaoNienKhoaService } from "./chuong-trinh-dao-tao-nien-khoa.service";
import { CreateChuongTrinhDaoTaoNienKhoaDto } from "./dto/create-chuong-trinh-dao-tao-nien-khoa.dto";
import { UpdateChuongTrinhDaoTaoNienKhoaDto } from "./dto/update-chuong-trinh-dao-tao-nien-khoa.dto";

@ApiTags("chuong-trinh-dao-tao-nien-khoa")
@Controller("chuong-trinh-dao-tao/:maSoNganh/nien-khoa")
export class ChuongTrinhDaoTaoNienKhoaController {
  constructor(private readonly service: ChuongTrinhDaoTaoNienKhoaService) {}

  @Post()
  create(@Param("maSoNganh") maSoNganh: string, @Body() dto: CreateChuongTrinhDaoTaoNienKhoaDto) {
    return this.service.create(maSoNganh, dto);
  }

  @Get()
  findAll(@Param("maSoNganh") maSoNganh: string) {
    return this.service.findAll(maSoNganh);
  }

  @Get(":khoa")
  findOne(@Param("maSoNganh") maSoNganh: string, @Param("khoa", ParseIntPipe) khoa: number) {
    return this.service.findOne(maSoNganh, khoa);
  }

  @Patch(":khoa")
  update(
    @Param("maSoNganh") maSoNganh: string,
    @Param("khoa", ParseIntPipe) khoa: number,
    @Body() dto: UpdateChuongTrinhDaoTaoNienKhoaDto
  ) {
    return this.service.update(maSoNganh, khoa, dto);
  }

  @Delete(":khoa")
  remove(@Param("maSoNganh") maSoNganh: string, @Param("khoa", ParseIntPipe) khoa: number) {
    return this.service.remove(maSoNganh, khoa);
  }
}