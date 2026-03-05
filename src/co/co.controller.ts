import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CoService } from "./co.service";
import { CreateCoDto } from "./dto/create-co.dto";
import { UpdateCoDto } from "./dto/update-co.dto";

@ApiTags("co")
@Controller("hoc-phan/:maHocPhan/co")
export class CoController {
  constructor(private readonly service: CoService) {}

  @Post()
  create(@Param("maHocPhan") maHocPhan: string, @Body() dto: CreateCoDto) {
    return this.service.create(maHocPhan, dto);
  }

  @Get()
  findAll(@Param("maHocPhan") maHocPhan: string) {
    return this.service.findAll(maHocPhan);
  }

  @Get(":maCO")
  findOne(@Param("maHocPhan") maHocPhan: string, @Param("maCO") maCO: string) {
    return this.service.findOne(maHocPhan, maCO);
  }

  @Patch(":maCO")
  update(
    @Param("maHocPhan") maHocPhan: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCoDto
  ) {
    return this.service.update(maHocPhan, maCO, dto);
  }

  @Delete(":maCO")
  remove(@Param("maHocPhan") maHocPhan: string, @Param("maCO") maCO: string) {
    return this.service.remove(maHocPhan, maCO);
  }
}