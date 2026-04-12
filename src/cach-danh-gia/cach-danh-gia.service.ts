import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCachDanhGiaDto } from "./dto/create-cach-danh-gia.dto";
import { UpdateCachDanhGiaDto } from "./dto/update-cach-danh-gia.dto";

@Injectable()
export class CachDanhGiaService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertDeCuongExists(maDeCuong: string) {
    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      select: { maDeCuong: true },
    });
    if (!dc) throw new BadRequestException("DeCuongChiTiet not found");
  }

  async create(maDeCuong: string, dto: CreateCachDanhGiaDto) {
    await this.assertDeCuongExists(maDeCuong);

    try {
      return await this.prisma.cachDanhGia.create({
        data: {
          maDeCuong,
          cachDanhGia: dto.cachDanhGia,
          tenThanhPhan: dto.tenThanhPhan,
          loai: dto.loai,
          trongSo: new Prisma.Decimal(dto.trongSo),
        },
        include: { deCuong: { include: { hocPhan: true } } },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("Unique constraint failed (cachDanhGia)");
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maDeCuong)");
      }
      throw e;
    }
  }

  async findAll(maDeCuong: string) {
    await this.assertDeCuongExists(maDeCuong);

    return this.prisma.cachDanhGia.findMany({
      where: { maDeCuong },
      orderBy: { tenThanhPhan: "asc" },
    });
  }

  async findOne(maDeCuong: string, maCDG: string) {
    const item = await this.prisma.cachDanhGia.findFirst({
      where: { maDeCuong, maCDG },
      include: { deCuong: { include: { hocPhan: true } } },
    });
    if (!item) throw new NotFoundException("CachDanhGia not found");
    return item;
  }

  async update(maDeCuong: string, maCDG: string, dto: UpdateCachDanhGiaDto) {
    await this.findOne(maDeCuong, maCDG);

    try {
      return await this.prisma.cachDanhGia.update({
        where: { maCDG },
        data: {
          cachDanhGia: dto.cachDanhGia,
          tenThanhPhan: dto.tenThanhPhan,
          loai: dto.loai,
          ...(dto.trongSo != null ? { trongSo: new Prisma.Decimal(dto.trongSo) } : {}),
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new BadRequestException("Unique constraint failed (cachDanhGia)");
      }
      throw e;
    }
  }

  async remove(maDeCuong: string, maCDG: string) {
    await this.findOne(maDeCuong, maCDG);

    try {
      return await this.prisma.cachDanhGia.delete({ where: { maCDG } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestException("Cannot delete: CachDanhGia is referenced by other records");
      }
      throw e;
    }
  }
}
