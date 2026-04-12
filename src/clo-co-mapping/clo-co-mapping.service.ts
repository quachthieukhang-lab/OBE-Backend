import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloCoMappingDto } from "./dto/create-clo-co-mapping.dto";
import { UpdateCloCoMappingDto } from "./dto/update-clo-co-mapping.dto";

@Injectable()
export class CloCoMappingService {
  constructor(private readonly prisma: PrismaService) {}

  private key(maCLO: string, maCO: string) {
    return { maCLO_maCO: { maCLO, maCO } } as const;
  }

  private async assertCloExistsInDeCuong(maDeCuong: string, maCLO: string) {
    const clo = await this.prisma.cLO.findFirst({
      where: { maDeCuong, maCLO },
      select: { maCLO: true },
    });
    if (!clo) throw new BadRequestException("CLO not found in this DeCuong");
  }

  private async assertCoExistsInDeCuong(maDeCuong: string, maCO: string) {
    const co = await this.prisma.cO.findFirst({
      where: { maDeCuong, maCO },
      select: { maCO: true },
    });
    if (!co) throw new BadRequestException("CO not found in this DeCuong");
  }

  async create(maDeCuong: string, maCLO: string, dto: CreateCloCoMappingDto) {
    await this.assertCloExistsInDeCuong(maDeCuong, maCLO);
    await this.assertCoExistsInDeCuong(maDeCuong, dto.maCO);

    try {
      return await this.prisma.cloCoMapping.create({
        data: {
          maCLO,
          maCO: dto.maCO,
          trongSo: new Prisma.Decimal(dto.trongSo),
          ghiChu: dto.ghiChu,
        },
        include: { co: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("Mapping already exists (maCLO, maCO)");
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll(maDeCuong: string, maCLO: string) {
    await this.assertCloExistsInDeCuong(maDeCuong, maCLO);

    return this.prisma.cloCoMapping.findMany({
      where: { maCLO },
      orderBy: { maCO: "asc" },
      include: { co: true },
    });
  }

  async findOne(maDeCuong: string, maCLO: string, maCO: string) {
    await this.assertCloExistsInDeCuong(maDeCuong, maCLO);

    const item = await this.prisma.cloCoMapping.findUnique({
      where: this.key(maCLO, maCO),
      include: { clo: true, co: true },
    });
    if (!item) throw new NotFoundException("CLO-CO mapping not found");
    return item;
  }

  async update(maDeCuong: string, maCLO: string, maCO: string, dto: UpdateCloCoMappingDto) {
    await this.findOne(maDeCuong, maCLO, maCO);

    return this.prisma.cloCoMapping.update({
      where: this.key(maCLO, maCO),
      data: {
        ...(dto.trongSo != null ? { trongSo: new Prisma.Decimal(dto.trongSo) } : {}),
        ghiChu: dto.ghiChu,
      },
      include: { co: true },
    });
  }

  async remove(maDeCuong: string, maCLO: string, maCO: string) {
    await this.findOne(maDeCuong, maCLO, maCO);

    return this.prisma.cloCoMapping.delete({
      where: this.key(maCLO, maCO),
    });
  }
}
