import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BanPhanCongNhapDeCuongChiTietHpService } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp.service';
import { CreateBanPhanCongNhapDeCuongChiTietHpDto } from './dto/create-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto';
import { UpdateBanPhanCongNhapDeCuongChiTietHpDto } from './dto/update-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("ban-phan-cong-nhap-de-cuong")
@Controller("ban-phan-cong-nhap-de-cuong")
export class BanPhanCongNhapDeCuongChiTietHpController {
  constructor(private readonly service: BanPhanCongNhapDeCuongChiTietHpService) { }

  @Post()
  create(@Body() dto: CreateBanPhanCongNhapDeCuongChiTietHpDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":maBanPhanCong")
  findOne(@Param("maBanPhanCong") maBanPhanCong: string) {
    return this.service.findOne(maBanPhanCong);
  }

  @Patch(":maBanPhanCong")
  update(@Param("maBanPhanCong") maBanPhanCong: string, @Body() dto: UpdateBanPhanCongNhapDeCuongChiTietHpDto) {
    return this.service.update(maBanPhanCong, dto);
  }

  @Delete(":maBanPhanCong")
  remove(@Param("maBanPhanCong") maBanPhanCong: string) {
    return this.service.remove(maBanPhanCong);
  }
}
