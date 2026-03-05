import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDiemSoDto } from "./dto/create-diem-so.dto";
import { UpdateDiemSoDto } from "./dto/update-diem-so.dto";

@Injectable()
export class DiemSoService {
  constructor(private readonly prisma: PrismaService) {}

  private async getEnrollment(maDangKy: string) {
    const dk = await this.prisma.dangKyHocPhan.findUnique({
      where: { maDangKy },
      select: {
        maDangKy: true,
        MSSV: true,
        maLopHocPhan: true,
      },
    });
    if (!dk) throw new BadRequestException("DangKyHocPhan not found");
    return dk;
  }

  private async assertCdgExists(maCDG: string) {
    const cdg = await this.prisma.cachDanhGia.findUnique({
      where: { maCDG },
      select: { maCDG: true, maHocPhan: true },
    });
    if (!cdg) throw new BadRequestException("CachDanhGia not found");
    return cdg;
  }

  private async assertGiangVienExists(MSGV: string) {
    const gv = await this.prisma.giangVien.findUnique({
      where: { MSGV },
      select: { MSGV: true },
    });
    if (!gv) throw new BadRequestException("GiangVien not found");
  }

  // helper: tìm theo unique(maDangKy, maCDG)
  async findOne(maDangKy: string, maCDG: string) {
    const item = await this.prisma.diemSo.findFirst({
      where: { maDangKy, maCDG },
      include: { cachDanhGia: true, giangVien: true },
    });
    if (!item) throw new NotFoundException("DiemSo not found");
    return item;
  }

  async create(maDangKy: string, dto: CreateDiemSoDto) {
    const dk = await this.getEnrollment(maDangKy);
    const cdg = await this.assertCdgExists(dto.maCDG);

    if (dto.MSGV) await this.assertGiangVienExists(dto.MSGV);

    try {
      return await this.prisma.diemSo.create({
        data: {
          // lấy từ enrollment để đảm bảo đúng dữ liệu
          maDangKy: dk.maDangKy,
          MSSV: dk.MSSV,
          maLopHocPhan: dk.maLopHocPhan,

          maCDG: dto.maCDG,
          diem: new Prisma.Decimal(dto.diem),
          MSGV: dto.MSGV,
        },
        include: { cachDanhGia: true, giangVien: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: unique constraint fail (maDangKy, maCDG)
        if (e.code === "P2002") {
          throw new BadRequestException("DiemSo already exists for this (maDangKy, maCDG)");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key constraint failed");
        }
      }
      throw e;
    }
  }

  async findAll(maDangKy: string) {
    await this.getEnrollment(maDangKy);

    return this.prisma.diemSo.findMany({
      where: { maDangKy },
      orderBy: { createdAt: "asc" },
      include: { cachDanhGia: true, giangVien: true },
    });
  }

  async update(maDangKy: string, maCDG: string, dto: UpdateDiemSoDto) {
    const current = await this.findOne(maDangKy, maCDG);

    if (dto.MSGV) await this.assertGiangVienExists(dto.MSGV);

    // update theo PK `id` để chắc chắn
    return this.prisma.diemSo.update({
      where: { id: current.id },
      data: {
        ...(dto.diem != null ? { diem: new Prisma.Decimal(dto.diem) } : {}),
        // maCDG và maDangKy không nên update vì là khóa logic
        MSGV: dto.MSGV,
      },
      include: { cachDanhGia: true, giangVien: true },
    });
  }

  async remove(maDangKy: string, maCDG: string) {
    const current = await this.findOne(maDangKy, maCDG);

    return this.prisma.diemSo.delete({
      where: { id: current.id },
    });
  }
}