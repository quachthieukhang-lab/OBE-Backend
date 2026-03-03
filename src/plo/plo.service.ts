import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePloDto } from './dto/create-plo.dto';
import { UpdatePloDto } from './dto/update-plo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PloService {
  constructor(private readonly prisma: PrismaService) { }

  private async assertProgramExists(maSoNganh: string) {
    const ct = await this.prisma.chuongTrinhDaoTao.findUnique({
      where: { maSoNganh },
      select: { maSoNganh: true },
    });
    if (!ct) throw new BadRequestException("ChuongTrinhDaoTao not found");
  }

  async create(maSoNganh: string, dto: CreatePloDto) {
    await this.assertProgramExists(maSoNganh);

    try {
      return await this.prisma.pLO.create({
        data: {
          maSoNganh,
          noiDungChuanDauRa: dto.noiDungChuanDauRa,
          code: dto.code,
          nhom: dto.nhom,
          mucDo: dto.mucDo,
          ghiChu: dto.ghiChu,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maSoNganh)");
      }
      throw e;
    }
  }

  async findAll(maSoNganh: string) {
    await this.assertProgramExists(maSoNganh);

    return this.prisma.pLO.findMany({
      where: { maSoNganh },
      orderBy: [{ code: "asc" }, { maPLO: "asc" }],
    });
  }

  async findOne(maSoNganh: string, maPLO: string) {
    const item = await this.prisma.pLO.findFirst({
      where: { maSoNganh, maPLO },
    });
    if (!item) throw new NotFoundException("PLO not found");
    return item;
  }

  async update(maSoNganh: string, maPLO: string, dto: UpdatePloDto) {
    await this.findOne(maSoNganh, maPLO);

    return this.prisma.pLO.update({
      where: { maPLO },
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
        nhom: dto.nhom,
        mucDo: dto.mucDo,
        ghiChu: dto.ghiChu,
        isActive: dto.isActive,
      },
    });
  }

  async remove(maSoNganh: string, maPLO: string) {
    await this.findOne(maSoNganh, maPLO);

    return this.prisma.pLO.delete({
      where: { maPLO },
    });
  }
}
