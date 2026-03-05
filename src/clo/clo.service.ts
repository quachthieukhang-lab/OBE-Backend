import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloDto } from "./dto/create-clo.dto";
import { UpdateCloDto } from "./dto/update-clo.dto";

@Injectable()
export class CloService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertHocPhanExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new BadRequestException("HocPhan not found");
  }

  async create(maHocPhan: string, dto: CreateCloDto) {
    await this.assertHocPhanExists(maHocPhan);

    try {
      return await this.prisma.cLO.create({
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

    return this.prisma.cLO.findMany({
      where: { maHocPhan },
      orderBy: [{ code: "asc" }, { maCLO: "asc" }],
    });
  }

  async findOne(maHocPhan: string, maCLO: string) {
    const item = await this.prisma.cLO.findFirst({
      where: { maHocPhan, maCLO },
      include: { hocPhan: true },
    });
    if (!item) throw new NotFoundException("CLO not found");
    return item;
  }

  async update(maHocPhan: string, maCLO: string, dto: UpdateCloDto) {
    await this.findOne(maHocPhan, maCLO);

    return this.prisma.cLO.update({
      where: { maCLO }, // update theo PK
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
      },
      include: { hocPhan: true },
    });
  }

  async remove(maHocPhan: string, maCLO: string) {
    await this.findOne(maHocPhan, maCLO);

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