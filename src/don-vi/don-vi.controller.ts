import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DonViService } from "./don-vi.service";
import { CreateDonViDto } from "./dto/create-don-vi.dto";
import { UpdateDonViDto } from "./dto/update-don-vi.dto";

@ApiTags("don-vi")
@ApiBearerAuth() // nếu bạn muốn bảo vệ bằng JWT
@Controller("don-vi")
export class DonViController {
  constructor(private readonly service: DonViService) {}

  @Post()
  create(@Body() dto: CreateDonViDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":maDonVi")
  findOne(@Param("maDonVi") maDonVi: string) {
    return this.service.findOne(maDonVi);
  }

  @Patch(":maDonVi")
  update(@Param("maDonVi") maDonVi: string, @Body() dto: UpdateDonViDto) {
    return this.service.update(maDonVi, dto);
  }

  @Delete(":maDonVi")
  remove(@Param("maDonVi") maDonVi: string) {
    return this.service.remove(maDonVi);
  }
}