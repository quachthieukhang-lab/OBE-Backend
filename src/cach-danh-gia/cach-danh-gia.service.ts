import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCachDanhGiaDto } from "./dto/create-cach-danh-gia.dto";
import { UpdateCachDanhGiaDto } from "./dto/update-cach-danh-gia.dto";

@Injectable()
export class CachDanhGiaService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertHocPhanExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new BadRequestException("HocPhan not found");
  }

  async create(maHocPhan: string, dto: CreateCachDanhGiaDto) {
    await this.assertHocPhanExists(maHocPhan);

    try {
      return await this.prisma.cachDanhGia.create({
        data: {
          maHocPhan,
          cachDanhGia: dto.cachDanhGia,
          tenThanhPhan: dto.tenThanhPhan,
          loai: dto.loai,
          trongSo: new Prisma.Decimal(dto.trongSo),
        },
        include: { hocPhan: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("Unique constraint failed (cachDanhGia)");
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maHocPhan)");
      }
      throw e;
    }
  }

  async findAll(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    return this.prisma.cachDanhGia.findMany({
      where: { maHocPhan },
      orderBy: { tenThanhPhan: "asc" },
    });
  }

  async findOne(maHocPhan: string, maCDG: string) {
    const item = await this.prisma.cachDanhGia.findFirst({
      where: { maHocPhan, maCDG },
      include: { hocPhan: true },
    });
    if (!item) throw new NotFoundException("CachDanhGia not found");
    return item;
  }

  async update(maHocPhan: string, maCDG: string, dto: UpdateCachDanhGiaDto) {
    await this.findOne(maHocPhan, maCDG);

    try {
      return await this.prisma.cachDanhGia.update({
        where: { maCDG }, // maCDG là PK, update theo PK
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

  async remove(maHocPhan: string, maCDG: string) {
    await this.findOne(maHocPhan, maCDG);

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