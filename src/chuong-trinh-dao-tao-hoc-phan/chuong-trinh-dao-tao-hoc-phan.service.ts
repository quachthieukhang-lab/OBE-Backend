import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateChuongTrinhDaoTaoHocPhanDto } from "./dto/create-chuong-trinh-dao-tao-hoc-phan.dto";
import { UpdateChuongTrinhDaoTaoHocPhanDto } from "./dto/update-chuong-trinh-dao-tao-hoc-phan.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ChuongTrinhDaoTaoHocPhanService {
  constructor(private readonly prisma: PrismaService) {}

  private key(maSoNganh: string, khoa: number, maHocPhan: string) {
    return {
      maSoNganh_khoa_maHocPhan: { maSoNganh, khoa, maHocPhan },
    } as const;
  }

  private async assertCtdtNienKhoaExists(maSoNganh: string, khoa: number) {
    const row = await this.prisma.chuongTrinhDaoTaoNienKhoa.findUnique({
      where: { maSoNganh_khoa: { maSoNganh, khoa } },
      select: { maSoNganh: true, khoa: true },
    });
    if (!row) throw new BadRequestException("ChuongTrinhDaoTaoNienKhoa not found for (maSoNganh, khoa)");
  }

  private async assertCourseExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new BadRequestException("HocPhan not found");
  }

  async create(maSoNganh: string, khoa: number, dto: CreateChuongTrinhDaoTaoHocPhanDto) {
    await this.assertCtdtNienKhoaExists(maSoNganh, khoa);
    await this.assertCourseExists(dto.maHocPhan);
    try {
      return await this.prisma.chuongTrinhDaoTaoHocPhan.create({
        data: {
          maSoNganh,
          khoa,
          maHocPhan: dto.maHocPhan,
          hocKyDuKien: dto.hocKyDuKien,
          namHocDuKien: dto.namHocDuKien,
          batBuoc: dto.batBuoc ?? true,
          nhomTuChon: dto.nhomTuChon,
          ghiChu: dto.ghiChu,
        },
        include: { hocPhan: true, ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } } },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new BadRequestException("HocPhan already exists in this program cohort");
      }
      throw e;
    }
  }

  async findAll(maSoNganh: string, khoa: number) {
    await this.assertCtdtNienKhoaExists(maSoNganh, khoa);
    return this.prisma.chuongTrinhDaoTaoHocPhan.findMany({
      where: { maSoNganh, khoa },
      orderBy: [{ hocKyDuKien: "asc" }, { maHocPhan: "asc" }],
      include: { hocPhan: true },
    });
  }

  async findOne(maSoNganh: string, khoa: number, maHocPhan: string) {
    const item = await this.prisma.chuongTrinhDaoTaoHocPhan.findUnique({
      where: this.key(maSoNganh, khoa, maHocPhan),
      include: {
        hocPhan: true,
        ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
      },
    });

    if (!item) throw new NotFoundException("CTDT-HocPhan not found");
    return item;
  }

  async update(maSoNganh: string, khoa: number, maHocPhan: string, dto: UpdateChuongTrinhDaoTaoHocPhanDto) {
    await this.findOne(maSoNganh, khoa, maHocPhan);
    return this.prisma.chuongTrinhDaoTaoHocPhan.update({
      where: this.key(maSoNganh, khoa, maHocPhan),
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

  async remove(maSoNganh: string, khoa: number, maHocPhan: string) {
    await this.findOne(maSoNganh, khoa, maHocPhan);
    return this.prisma.chuongTrinhDaoTaoHocPhan.delete({
      where: this.key(maSoNganh, khoa, maHocPhan),
    });
  }
}
