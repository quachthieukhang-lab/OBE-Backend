import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloCoMappingDto } from "./dto/create-clo-co-mapping.dto";
import { UpdateCloCoMappingDto } from "./dto/update-clo-co-mapping.dto";

@Injectable()
export class CloCoMappingService {
  constructor(private readonly prisma: PrismaService) {}

  // Prisma compound key name thường theo pattern: maCLO_maCO
  private key(maCLO: string, maCO: string) {
    return { maCLO_maCO: { maCLO, maCO } } as const;
  }

  private async assertCloExistsInCourse(maHocPhan: string, maCLO: string) {
    const clo = await this.prisma.cLO.findFirst({
      where: { maHocPhan, maCLO },
      select: { maCLO: true },
    });
    if (!clo) throw new BadRequestException("CLO not found in this HocPhan");
  }

  private async assertCoExistsInCourse(maHocPhan: string, maCO: string) {
    const co = await this.prisma.cO.findFirst({
      where: { maHocPhan, maCO },
      select: { maCO: true },
    });
    if (!co) throw new BadRequestException("CO not found in this HocPhan");
  }

  async create(maHocPhan: string, maCLO: string, dto: CreateCloCoMappingDto) {
    await this.assertCloExistsInCourse(maHocPhan, maCLO);
    await this.assertCoExistsInCourse(maHocPhan, dto.maCO);

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

  async findAll(maHocPhan: string, maCLO: string) {
    await this.assertCloExistsInCourse(maHocPhan, maCLO);

    return this.prisma.cloCoMapping.findMany({
      where: { maCLO },
      orderBy: { maCO: "asc" },
      include: { co: true },
    });
  }

  async findOne(maHocPhan: string, maCLO: string, maCO: string) {
    await this.assertCloExistsInCourse(maHocPhan, maCLO);

    const item = await this.prisma.cloCoMapping.findUnique({
      where: this.key(maCLO, maCO),
      include: { clo: true, co: true },
    });
    if (!item) throw new NotFoundException("CLO-CO mapping not found");
    return item;
  }

  async update(maHocPhan: string, maCLO: string, maCO: string, dto: UpdateCloCoMappingDto) {
    await this.findOne(maHocPhan, maCLO, maCO);

    // không update maCO vì thuộc PK; chỉ update trongSo/ghiChu
    return this.prisma.cloCoMapping.update({
      where: this.key(maCLO, maCO),
      data: {
        ...(dto.trongSo != null ? { trongSo: new Prisma.Decimal(dto.trongSo) } : {}),
        ghiChu: dto.ghiChu,
      },
      include: { co: true },
    });
  }

  async remove(maHocPhan: string, maCLO: string, maCO: string) {
    await this.findOne(maHocPhan, maCLO, maCO);

    return this.prisma.cloCoMapping.delete({
      where: this.key(maCLO, maCO),
    });
  }
}