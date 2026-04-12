import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CoService } from "./co.service";
import { CreateCoDto } from "./dto/create-co.dto";
import { UpdateCoDto } from "./dto/update-co.dto";

@ApiTags("co")
@Controller("de-cuong-chi-tiet/:maDeCuong/co")
export class CoController {
  constructor(private readonly service: CoService) {}

  @Post()
  create(@Param("maDeCuong") maDeCuong: string, @Body() dto: CreateCoDto) {
    return this.service.create(maDeCuong, dto);
  }

  @Get()
  findAll(@Param("maDeCuong") maDeCuong: string) {
    return this.service.findAll(maDeCuong);
  }

  @Get(":maCO")
  findOne(@Param("maDeCuong") maDeCuong: string, @Param("maCO") maCO: string) {
    return this.service.findOne(maDeCuong, maCO);
  }

  @Patch(":maCO")
  update(
    @Param("maDeCuong") maDeCuong: string,
    @Param("maCO") maCO: string,
    @Body() dto: UpdateCoDto
  ) {
    return this.service.update(maDeCuong, maCO, dto);
  }

  @Delete(":maCO")
  remove(@Param("maDeCuong") maDeCuong: string, @Param("maCO") maCO: string) {
    return this.service.remove(maDeCuong, maCO);
  }
}
