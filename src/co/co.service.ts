import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCoDto } from "./dto/create-co.dto";
import { UpdateCoDto } from "./dto/update-co.dto";

@Injectable()
export class CoService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertHocPhanExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new BadRequestException("HocPhan not found");
  }

  async create(maHocPhan: string, dto: CreateCoDto) {
    await this.assertHocPhanExists(maHocPhan);

    try {
      return await this.prisma.cO.create({
        data: {
          maHocPhan,
          noiDungChuanDauRa: dto.noiDungChuanDauRa,
          code: dto.code,
        },
        include: { hocPhan: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maHocPhan)");
      }
      throw e;
    }
  }

  async findAll(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    return this.prisma.cO.findMany({
      where: { maHocPhan },
      orderBy: [{ code: "asc" }, { maCO: "asc" }],
    });
  }

  async findOne(maHocPhan: string, maCO: string) {
    const item = await this.prisma.cO.findFirst({
      where: { maHocPhan, maCO },
      include: { hocPhan: true },
    });
    if (!item) throw new NotFoundException("CO not found");
    return item;
  }

  async update(maHocPhan: string, maCO: string, dto: UpdateCoDto) {
    await this.findOne(maHocPhan, maCO);

    return this.prisma.cO.update({
      where: { maCO }, // PK
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
      },
      include: { hocPhan: true },
    });
  }

  async remove(maHocPhan: string, maCO: string) {
    await this.findOne(maHocPhan, maCO);

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