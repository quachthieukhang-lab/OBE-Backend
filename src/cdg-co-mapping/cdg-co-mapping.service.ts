import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCdgCoMappingDto } from "./dto/create-cdg-co-mapping.dto";
import { UpdateCdgCoMappingDto } from "./dto/update-cdg-co-mapping.dto";

@Injectable()
export class CdgCoMappingService {
  constructor(private readonly prisma: PrismaService) {}

  // Prisma compound key name thường theo pattern: maCDG_maCO
  private key(maCDG: string, maCO: string) {
    return { maCDG_maCO: { maCDG, maCO } } as const;
  }

  private async assertCdgExistsInCourse(maHocPhan: string, maCDG: string) {
    const cdg = await this.prisma.cachDanhGia.findFirst({
      where: { maHocPhan, maCDG },
      select: { maCDG: true },
    });
    if (!cdg) throw new BadRequestException("CachDanhGia not found in this HocPhan");
  }

  private async assertCoExistsInCourse(maHocPhan: string, maCO: string) {
    const co = await this.prisma.cO.findFirst({
      where: { maHocPhan, maCO },
      select: { maCO: true },
    });
    if (!co) throw new BadRequestException("CO not found in this HocPhan");
  }

  async create(maHocPhan: string, maCDG: string, dto: CreateCdgCoMappingDto) {
    await this.assertCdgExistsInCourse(maHocPhan, maCDG);
    await this.assertCoExistsInCourse(maHocPhan, dto.maCO);

    try {
      return await this.prisma.cdgCoMapping.create({
        data: {
          maCDG,
          maCO: dto.maCO,
          trongSo: new Prisma.Decimal(dto.trongSo),
          ghiChu: dto.ghiChu,
        },
        include: { co: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("Mapping already exists (maCDG, maCO)");
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll(maHocPhan: string, maCDG: string) {
    await this.assertCdgExistsInCourse(maHocPhan, maCDG);

    return this.prisma.cdgCoMapping.findMany({
      where: { maCDG },
      orderBy: { maCO: "asc" },
      include: { co: true },
    });
  }

  async findOne(maHocPhan: string, maCDG: string, maCO: string) {
    await this.assertCdgExistsInCourse(maHocPhan, maCDG);

    const item = await this.prisma.cdgCoMapping.findUnique({
      where: this.key(maCDG, maCO),
      include: { cdg: true, co: true },
    });
    if (!item) throw new NotFoundException("CDG-CO mapping not found");
    return item;
  }

  async update(
    maHocPhan: string,
    maCDG: string,
    maCO: string,
    dto: UpdateCdgCoMappingDto
  ) {
    await this.findOne(maHocPhan, maCDG, maCO);

    // không update maCO vì thuộc PK; chỉ update trongSo/ghiChu
    return this.prisma.cdgCoMapping.update({
      where: this.key(maCDG, maCO),
      data: {
        ...(dto.trongSo != null ? { trongSo: new Prisma.Decimal(dto.trongSo) } : {}),
        ghiChu: dto.ghiChu,
      },
      include: { co: true },
    });
  }

  async remove(maHocPhan: string, maCDG: string, maCO: string) {
    await this.findOne(maHocPhan, maCDG, maCO);

    return this.prisma.cdgCoMapping.delete({
      where: this.key(maCDG, maCO),
    });
  }
}