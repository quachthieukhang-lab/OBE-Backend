import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GiangVienService } from "./giang-vien.service";
import { CreateGiangVienDto } from "./dto/create-giang-vien.dto";
import { UpdateGiangVienDto } from "./dto/update-giang-vien.dto";

@ApiTags("giang-vien")
@Controller("giang-vien")
export class GiangVienController {
  constructor(private readonly service: GiangVienService) { }

  @Post()
  create(@Body() dto: CreateGiangVienDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":MSGV")
  findOne(@Param("MSGV") MSGV: string) {
    return this.service.findOne(MSGV);
  }

  @Patch(":MSGV")
  update(@Param("MSGV") MSGV: string, @Body() dto: UpdateGiangVienDto) {
    return this.service.update(MSGV, dto);
  }

  @Delete(":MSGV")
  remove(@Param("MSGV") MSGV: string) {
    return this.service.remove(MSGV);
  }
}