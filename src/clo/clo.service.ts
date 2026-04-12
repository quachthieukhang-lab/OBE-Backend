import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloDto } from "./dto/create-clo.dto";
import { UpdateCloDto } from "./dto/update-clo.dto";

@Injectable()
export class CloService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertDeCuongExists(maDeCuong: string) {
    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      select: { maDeCuong: true },
    });
    if (!dc) throw new BadRequestException("DeCuongChiTiet not found");
  }

  async create(maDeCuong: string, dto: CreateCloDto) {
    await this.assertDeCuongExists(maDeCuong);

    try {
      return await this.prisma.cLO.create({
        data: {
          maDeCuong,
          noiDungChuanDauRa: dto.noiDungChuanDauRa,
          code: dto.code,
        },
        include: { deCuong: { include: { hocPhan: true } } },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maDeCuong)");
      }
      throw e;
    }
  }

  async findAll(maDeCuong: string) {
    await this.assertDeCuongExists(maDeCuong);

    return this.prisma.cLO.findMany({
      where: { maDeCuong },
      orderBy: [{ code: "asc" }, { maCLO: "asc" }],
    });
  }

  async findOne(maDeCuong: string, maCLO: string) {
    const item = await this.prisma.cLO.findFirst({
      where: { maDeCuong, maCLO },
      include: { deCuong: { include: { hocPhan: true } } },
    });
    if (!item) throw new NotFoundException("CLO not found");
    return item;
  }

  async update(maDeCuong: string, maCLO: string, dto: UpdateCloDto) {
    await this.findOne(maDeCuong, maCLO);

    return this.prisma.cLO.update({
      where: { maCLO },
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
      },
      include: { deCuong: { include: { hocPhan: true } } },
    });
  }

  async remove(maDeCuong: string, maCLO: string) {
    await this.findOne(maDeCuong, maCLO);

    try {
      return await this.prisma.cLO.delete({ where: { maCLO } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestException("Cannot delete: CLO is referenced by other records");
      }
      throw e;
    }
  }
}
