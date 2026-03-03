import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChuongTrinhDaoTaoHocPhanDto } from './dto/create-chuong-trinh-dao-tao-hoc-phan.dto';
import { UpdateChuongTrinhDaoTaoHocPhanDto } from './dto/update-chuong-trinh-dao-tao-hoc-phan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from "@prisma/client";

@Injectable()
export class ChuongTrinhDaoTaoHocPhanService {
  constructor(private readonly prisma: PrismaService) { }

  private key(maSoNganh: string, maHocPhan: string) {
    return { maSoNganh_maHocPhan: { maSoNganh, maHocPhan } } as const;
  }

  private async assertProgramExists(maSoNganh: string) {
    const ct = await this.prisma.chuongTrinhDaoTao.findUnique({
      where: { maSoNganh },
      select: { maSoNganh: true },
    });
    if (!ct) throw new BadRequestException("ChuongTrinhDaoTao not found");
  }

  private async assertCourseExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new BadRequestException("HocPhan not found");
  }

  async create(maSoNganh: string, dto: CreateChuongTrinhDaoTaoHocPhanDto) {
    await this.assertProgramExists(maSoNganh);
    await this.assertCourseExists(dto.maHocPhan);
    try {
      return await this.prisma.chuongTrinhDaoTaoHocPhan.create({
        data: {
          maSoNganh,
          maHocPhan: dto.maHocPhan,
          hocKyDuKien: dto.hocKyDuKien,
          namHocDuKien: dto.namHocDuKien,
          batBuoc: dto.batBuoc ?? true,
          nhomTuChon: dto.nhomTuChon,
          ghiChu: dto.ghiChu,
        },
        include: { hocPhan: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new BadRequestException("HocPhan already exists in this program");
      }
      throw e;
    }
  }

  async findAll(maSoNganh: string) {
    await this.assertProgramExists(maSoNganh);
    return this.prisma.chuongTrinhDaoTaoHocPhan.findMany({
      where: { maSoNganh },
      orderBy: [{ hocKyDuKien: "asc" }, { maHocPhan: "asc" }],
      include: { hocPhan: true },
    });
  }

  async findOne(maSoNganh: string, maHocPhan: string) {
    const item = await this.prisma.chuongTrinhDaoTaoHocPhan.findUnique({
      where: this.key(maSoNganh, maHocPhan),
      include: { hocPhan: true, chuongTrinh: true },
    });

    if (!item) throw new NotFoundException("CTDT-HocPhan not found");
    return item;
  }

  async update(maSoNganh: string, maHocPhan: string, dto: UpdateChuongTrinhDaoTaoHocPhanDto) {
    await this.findOne(maSoNganh, maHocPhan);
    return this.prisma.chuongTrinhDaoTaoHocPhan.update({
      where: this.key(maSoNganh, maHocPhan),
      data: {
        hocKyDuKien: dto.hocKyDuKien,
        namHocDuKien: dto.namHocDuKien,
        batBuoc: dto.batBuoc,
        nhomTuChon: dto.nhomTuChon,
        ghiChu: dto.ghiChu,
      },
      include: { hocPhan: true },
    });
  }

  async remove(maSoNganh: string, maHocPhan: string) {
    await this.findOne(maSoNganh, maHocPhan);
    return this.prisma.chuongTrinhDaoTaoHocPhan.delete({
      where: this.key(maSoNganh, maHocPhan),
    });
  }
}
