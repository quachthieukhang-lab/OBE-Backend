import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NienKhoaService } from "./nien-khoa.service";
import { CreateNienKhoaDto } from "./dto/create-nien-khoa.dto";
import { UpdateNienKhoaDto } from "./dto/update-nien-khoa.dto";

@ApiTags("nien-khoa")
@Controller("nien-khoa")
export class NienKhoaController {
  constructor(private readonly service: NienKhoaService) {}

  @Post()
  create(@Body() dto: CreateNienKhoaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":khoa")
  findOne(@Param("khoa", ParseIntPipe) khoa: number) {
    return this.service.findOne(khoa);
  }

  @Patch(":khoa")
  update(
    @Param("khoa", ParseIntPipe) khoa: number,
    @Body() dto: UpdateNienKhoaDto
  ) {
    return this.service.update(khoa, dto);
  }

  @Delete(":khoa")
  remove(@Param("khoa", ParseIntPipe) khoa: number) {
    return this.service.remove(khoa);
  }
}