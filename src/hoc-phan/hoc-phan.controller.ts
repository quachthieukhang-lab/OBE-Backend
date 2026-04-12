import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { HocPhanService } from "./hoc-phan.service";
import { CreateHocPhanDto } from "./dto/create-hoc-phan.dto";
import { UpdateHocPhanDto } from "./dto/update-hoc-phan.dto";

@ApiTags("hoc-phan")
@Controller("hoc-phan")
export class HocPhanController {
  constructor(private readonly service: HocPhanService) { }

  @Post()
  create(@Body() dto: CreateHocPhanDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":maHocPhan")
  findOne(@Param("maHocPhan") maHocPhan: string) {
    return this.service.findOne(maHocPhan);
  }

  @Patch(":maHocPhan")
  update(@Param("maHocPhan") maHocPhan: string, @Body() dto: UpdateHocPhanDto) {
    return this.service.update(maHocPhan, dto);
  }

  @Delete(":maHocPhan")
  remove(@Param("maHocPhan") maHocPhan: string) {
    return this.service.remove(maHocPhan);
  }

  @Get(":maHocPhan/plo-options")
  @ApiQuery({ name: "maSoNganh", required: false, description: "Lọc PLO theo ngành (bắt buộc kèm khoa)" })
  @ApiQuery({ name: "khoa", required: false, description: "Lọc PLO theo khóa / niên khóa (số nguyên, bắt buộc kèm maSoNganh)" })
  getPloOptions(
    @Param("maHocPhan") maHocPhan: string,
    @Query("maSoNganh") maSoNganh?: string,
    @Query("khoa") khoaStr?: string,
  ) {
    const khoa = khoaStr != null && khoaStr !== "" ? Number(khoaStr) : undefined;
    return this.service.getPloOptions(maHocPhan, {
      maSoNganh: maSoNganh?.trim() || undefined,
      khoa: khoa !== undefined && Number.isInteger(khoa) ? khoa : undefined,
    });
  }
}
