import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloPloMappingDto } from "./dto/create-clo-plo-mapping.dto";
import { UpdateCloPloMappingDto } from "./dto/update-clo-plo-mapping.dto";

@Injectable()
export class CloPloMappingService {
  constructor(private readonly prisma: PrismaService) {}

  // Prisma compound id name thường là maPLO_maCLO (tuỳ version, nếu TS báo sai thì đổi theo d.ts)
  private key(maPLO: string, maCLO: string) {
    return { maPLO_maCLO: { maPLO, maCLO } } as const;
  }

  private async assertCloExistsInCourse(maHocPhan: string, maCLO: string) {
    const clo = await this.prisma.cLO.findFirst({
      where: { maHocPhan, maCLO },
      select: { maCLO: true },
    });
    if (!clo) throw new BadRequestException("CLO not found in this HocPhan");
  }

  private async assertPloExists(maPLO: string) {
    const plo = await this.prisma.pLO.findUnique({
      where: { maPLO },
      select: { maPLO: true },
    });
    if (!plo) throw new BadRequestException("PLO not found");
  }

  async create(maHocPhan: string, maCLO: string, dto: CreateCloPloMappingDto) {
    await this.assertCloExistsInCourse(maHocPhan, maCLO);
    await this.assertPloExists(dto.maPLO);

    try {
      return await this.prisma.cloPloMapping.create({
        data: {
          maCLO,
          maPLO: dto.maPLO,
          trongSo: new Prisma.Decimal(dto.trongSo),
          ghiChu: dto.ghiChu,
        },
        include: { plo: true, clo: true},
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("Mapping already exists (maPLO, maCLO)");
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll(maHocPhan: string, maCLO: string) {
    await this.assertCloExistsInCourse(maHocPhan, maCLO);

    return this.prisma.cloPloMapping.findMany({
      where: { maCLO },
      orderBy: { maPLO: "asc" },
      include: { plo: true, clo: true},
    });
  }

  async findOne(maHocPhan: string, maCLO: string, maPLO: string) {
    await this.assertCloExistsInCourse(maHocPhan, maCLO);

    const item = await this.prisma.cloPloMapping.findUnique({
      where: this.key(maPLO, maCLO),
      include: { plo: true, clo: true },
    });
    if (!item) throw new NotFoundException("CLO-PLO mapping not found");
    return item;
  }

  async update(maHocPhan: string, maCLO: string, maPLO: string, dto: UpdateCloPloMappingDto) {
    await this.findOne(maHocPhan, maCLO, maPLO);

    // Không cho update maPLO (vì là PK), chỉ update trongSo/ghiChu
    return this.prisma.cloPloMapping.update({
      where: this.key(maPLO, maCLO),
      data: {
        ...(dto.trongSo != null ? { trongSo: new Prisma.Decimal(dto.trongSo) } : {}),
        ghiChu: dto.ghiChu,
      },
      include: { plo: true, clo: true},
    });
  }

  async remove(maHocPhan: string, maCLO: string, maPLO: string) {
    await this.findOne(maHocPhan, maCLO, maPLO);

    return this.prisma.cloPloMapping.delete({
      where: this.key(maPLO, maCLO),
    });
  }
}