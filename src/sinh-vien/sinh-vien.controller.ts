import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SinhVienService } from "./sinh-vien.service";
import { CreateSinhVienDto } from "./dto/create-sinh-vien.dto";
import { UpdateSinhVienDto } from "./dto/update-sinh-vien.dto";

@ApiTags("sinh-vien")
@Controller("sinh-vien")
export class SinhVienController {
  constructor(private readonly service: SinhVienService) {}

  @Post()
  create(@Body() dto: CreateSinhVienDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":MSSV")
  findOne(@Param("MSSV") MSSV: string) {
    return this.service.findOne(MSSV);
  }

  @Patch(":MSSV")
  update(@Param("MSSV") MSSV: string, @Body() dto: UpdateSinhVienDto) {
    return this.service.update(MSSV, dto);
  }

  @Delete(":MSSV")
  remove(@Param("MSSV") MSSV: string) {
    return this.service.remove(MSSV);
  }
}