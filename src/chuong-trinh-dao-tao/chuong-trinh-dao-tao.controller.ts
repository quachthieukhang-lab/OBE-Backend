import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChuongTrinhDaoTaoService } from "./chuong-trinh-dao-tao.service";
import { CreateChuongTrinhDaoTaoDto } from "./dto/create-chuong-trinh-dao-tao.dto";
import { UpdateChuongTrinhDaoTaoDto } from "./dto/update-chuong-trinh-dao-tao.dto";

@ApiTags("chuong-trinh-dao-tao")
@Controller("chuong-trinh-dao-tao")
export class ChuongTrinhDaoTaoController {
  constructor(private readonly service: ChuongTrinhDaoTaoService) {}

  @Post()
  create(@Body() dto: CreateChuongTrinhDaoTaoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":maSoNganh")
  findOne(@Param("maSoNganh") maSoNganh: string) {
    return this.service.findOne(maSoNganh);
  }

  @Patch(":maSoNganh")
  update(@Param("maSoNganh") maSoNganh: string, @Body() dto: UpdateChuongTrinhDaoTaoDto) {
    return this.service.update(maSoNganh, dto);
  }

  @Delete(":maSoNganh")
  remove(@Param("maSoNganh") maSoNganh: string) {
    return this.service.remove(maSoNganh);
  }
}