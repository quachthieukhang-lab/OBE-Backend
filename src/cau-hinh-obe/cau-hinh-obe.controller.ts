import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CauHinhObeService } from "./cau-hinh-obe.service";
import { CreateCauHinhObeDto } from "./dto/create-cau-hinh-obe.dto";
import { UpdateCauHinhObeDto } from "./dto/update-cau-hinh-obe.dto";

@ApiTags("cau-hinh-obe")
@Controller("cau-hinh-obe")
export class CauHinhObeController {
  constructor(private readonly service: CauHinhObeService) {}

  @Post()
  create(@Body() dto: CreateCauHinhObeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query("khoa") khoa?: string,
    @Query("maDonVi") maDonVi?: string,
  ) {
    return this.service.findAll({
      khoa: khoa ? Number(khoa) : undefined,
      maDonVi,
    });
  }

  @Get("by-khoa/:khoa/don-vi/:maDonVi")
  findByKhoaAndDonVi(@Param("khoa") khoa: string, @Param("maDonVi") maDonVi: string) {
    return this.service.findByKhoaAndDonVi(Number(khoa), maDonVi);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCauHinhObeDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}