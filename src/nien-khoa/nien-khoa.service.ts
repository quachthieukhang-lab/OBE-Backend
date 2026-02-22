import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNienKhoaDto } from "./dto/create-nien-khoa.dto";
import { UpdateNienKhoaDto } from "./dto/update-nien-khoa.dto";

@Injectable()
export class NienKhoaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNienKhoaDto) {
    if (dto.namKetThuc != null && dto.namKetThuc < dto.namBatDau) {
      throw new BadRequestException("Năm kết thúc phải lớn hơn năm bắt đầu");
    }
    return this.prisma.nienKhoa.create({ data: dto });
  }

  async findAll() {
    return this.prisma.nienKhoa.findMany({
      orderBy: { khoa: "asc" },
    });
  }

  async findOne(khoa: number) {
    const item = await this.prisma.nienKhoa.findUnique({ where: { khoa } });
    if (!item) throw new NotFoundException(`Không tìm thấy niên khóa ${khoa}!`);
    return item;
  }

  async update(khoa: number, dto: UpdateNienKhoaDto) {
    if (dto.namKetThuc != null && dto.namBatDau != null && dto.namKetThuc < dto.namBatDau) {
      throw new BadRequestException("Năm kết thúc phải lớn hơn năm bắt đầu");
    }

    // ensure exists
    await this.findOne(khoa);

    return this.prisma.nienKhoa.update({
      where: { khoa },
      data: dto
    });
  }

  async remove(khoa: number) {
    // ensure exists
    await this.findOne(khoa);

    return this.prisma.nienKhoa.delete({ where: { khoa } });
  }
}