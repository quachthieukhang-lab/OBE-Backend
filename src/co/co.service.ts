import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCoDto } from "./dto/create-co.dto";
import { UpdateCoDto } from "./dto/update-co.dto";

@Injectable()
export class CoService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertDeCuongExists(maDeCuong: string) {
    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      select: { maDeCuong: true },
    });
    if (!dc) throw new BadRequestException("DeCuongChiTiet not found");
  }

  async create(maDeCuong: string, dto: CreateCoDto) {
    await this.assertDeCuongExists(maDeCuong);

    try {
      return await this.prisma.cO.create({
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

    return this.prisma.cO.findMany({
      where: { maDeCuong },
      orderBy: [{ code: "asc" }, { maCO: "asc" }],
    });
  }

  async findOne(maDeCuong: string, maCO: string) {
    const item = await this.prisma.cO.findFirst({
      where: { maDeCuong, maCO },
      include: { deCuong: { include: { hocPhan: true } } },
    });
    if (!item) throw new NotFoundException("CO not found");
    return item;
  }

  async update(maDeCuong: string, maCO: string, dto: UpdateCoDto) {
    await this.findOne(maDeCuong, maCO);

    return this.prisma.cO.update({
      where: { maCO },
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
      },
      include: { deCuong: { include: { hocPhan: true } } },
    });
  }

  async remove(maDeCuong: string, maCO: string) {
    await this.findOne(maDeCuong, maCO);

    try {
      return await this.prisma.cO.delete({ where: { maCO } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestException("Cannot delete: CO is referenced by other records");
      }
      throw e;
    }
  }
}
