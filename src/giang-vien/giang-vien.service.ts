import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGiangVienDto } from "./dto/create-giang-vien.dto";
import { UpdateGiangVienDto } from "./dto/update-giang-vien.dto";

@Injectable()
export class GiangVienService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertDonViExists(maDonVi: string) {
    const dv = await this.prisma.donVi.findUnique({
      where: { maDonVi },
      select: { maDonVi: true },
    });
    if (!dv) throw new BadRequestException("DonVi not found");
  }

  async create(dto: CreateGiangVienDto) {
    await this.assertDonViExists(dto.maDonVi);

    try {
      const { maDonVi, ngaySinh, ...rest } = dto;
      return await this.prisma.giangVien.create({
        data: {
          ...rest,
          ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : undefined,
          donVi: { connect: { maDonVi: dto.maDonVi } },
        },
        include: { donVi: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("MSGV already exists");
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maDonVi)");
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.giangVien.findMany({
      orderBy: { hoTen: "asc" },
      include: { donVi: true },
    });
  }

  async findOne(MSGV: string) {
    const item = await this.prisma.giangVien.findUnique({
      where: { MSGV },
      include: { donVi: true },
    });
    if (!item) throw new NotFoundException("GiangVien not found");
    return item;
  }

  async update(MSGV: string, dto: UpdateGiangVienDto) {
    await this.findOne(MSGV);

    if (dto.maDonVi) await this.assertDonViExists(dto.maDonVi);

    return this.prisma.giangVien.update({
      where: { MSGV },
      data: {
        hoTen: dto.hoTen,
        email: dto.email,
        soDienThoai: dto.soDienThoai,
        hocVi: dto.hocVi,
        chucDanh: dto.chucDanh,
        boMon: dto.boMon,
        ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : undefined,
        isActive: dto.isActive,

        ...(dto.maDonVi ? { donVi: { connect: { maDonVi: dto.maDonVi } } } : {}),
      },
      include: { donVi: true },
    });
  }

  async remove(MSGV: string) {
    await this.findOne(MSGV);

    try {
      return await this.prisma.giangVien.delete({ where: { MSGV } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        // Có record khác đang FK tới giảng viên
        throw new BadRequestException("Cannot delete: GiangVien is referenced by other records");
      }
      throw e;
    }
  }
}