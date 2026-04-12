import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePloDto } from "./dto/create-plo.dto";
import { UpdatePloDto } from "./dto/update-plo.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PloService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCtdtNienKhoaExists(maSoNganh: string, khoa: number) {
    const row = await this.prisma.chuongTrinhDaoTaoNienKhoa.findUnique({
      where: { maSoNganh_khoa: { maSoNganh, khoa } },
      select: { maSoNganh: true, khoa: true },
    });
    if (!row) throw new BadRequestException("ChuongTrinhDaoTaoNienKhoa not found for (maSoNganh, khoa)");
  }

  async create(maSoNganh: string, khoa: number, dto: CreatePloDto) {
    await this.assertCtdtNienKhoaExists(maSoNganh, khoa);

    try {
      return await this.prisma.pLO.create({
        data: {
          maSoNganh,
          khoa,
          noiDungChuanDauRa: dto.noiDungChuanDauRa,
          code: dto.code,
          nhom: dto.nhom,
          mucDo: dto.mucDo,
          ghiChu: dto.ghiChu,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") throw new BadRequestException("Foreign key invalid (maSoNganh, khoa)");
      }
      throw e;
    }
  }

  async findAll(maSoNganh: string, khoa: number) {
    await this.assertCtdtNienKhoaExists(maSoNganh, khoa);

    return this.prisma.pLO.findMany({
      where: { maSoNganh, khoa },
      orderBy: [{ code: "asc" }, { maPLO: "asc" }],
    });
  }

  async findOne(maSoNganh: string, khoa: number, maPLO: string) {
    const item = await this.prisma.pLO.findFirst({
      where: { maSoNganh, khoa, maPLO },
    });
    if (!item) throw new NotFoundException("PLO not found");
    return item;
  }

  async update(maSoNganh: string, khoa: number, maPLO: string, dto: UpdatePloDto) {
    await this.findOne(maSoNganh, khoa, maPLO);

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

  async remove(maSoNganh: string, khoa: number, maPLO: string) {
    await this.findOne(maSoNganh, khoa, maPLO);

    return this.prisma.pLO.delete({
      where: { maPLO },
    });
  }
}
