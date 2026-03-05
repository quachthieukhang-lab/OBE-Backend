import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDangKyHocPhanDto } from "./dto/create-dang-ky-hoc-phan.dto";
import { UpdateDangKyHocPhanDto } from "./dto/update-dang-ky-hoc-phan.dto";

@Injectable()
export class DangKyHocPhanService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertClassExists(maLopHocPhan: string) {
    const lhp = await this.prisma.lopHocPhan.findUnique({
      where: { maLopHocPhan },
      select: { maLopHocPhan: true },
    });
    if (!lhp) throw new BadRequestException("LopHocPhan not found");
  }

  private async assertStudentExists(MSSV: string) {
    const sv = await this.prisma.sinhVien.findUnique({
      where: { MSSV },
      select: { MSSV: true },
    });
    if (!sv) throw new BadRequestException("SinhVien not found");
  }

  async create(maLopHocPhan: string, dto: CreateDangKyHocPhanDto) {
    await this.assertClassExists(maLopHocPhan);
    await this.assertStudentExists(dto.MSSV);

    const lanHoc = dto.lanHoc ?? 1;

    try {
      return await this.prisma.dangKyHocPhan.create({
        data: {
          maLopHocPhan,
          MSSV: dto.MSSV,
          lanHoc,
          ngayDangKy: dto.ngayDangKy ? new Date(dto.ngayDangKy) : undefined,
          trangThai: dto.trangThai ?? "dang_hoc",
          ghiChu: dto.ghiChu,
        },
        include: { lopHocPhan: true, sinhVien: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: unique constraint (trùng maLopHocPhan + MSSV + lanHoc)
        if (e.code === "P2002") {
          throw new BadRequestException("Enrollment already exists for this (maLopHocPhan, MSSV, lanHoc)");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key constraint failed");
        }
      }
      throw e;
    }
  }

  async findAll(maLopHocPhan: string) {
    await this.assertClassExists(maLopHocPhan);

    return this.prisma.dangKyHocPhan.findMany({
      where: { maLopHocPhan },
      orderBy: [{ lanHoc: "asc" }, { MSSV: "asc" }],
      include: { sinhVien: true },
    });
  }

  async findOne(maDangKy: string) {
    const item = await this.prisma.dangKyHocPhan.findUnique({
      where: { maDangKy },
      include: { lopHocPhan: true, sinhVien: true, diemSos: true },
    });
    if (!item) throw new NotFoundException("DangKyHocPhan not found");
    return item;
  }

  async update(maDangKy: string, dto: UpdateDangKyHocPhanDto) {
    const current = await this.findOne(maDangKy);

    // Không khuyến nghị update FK (maLopHocPhan, MSSV) vì ảnh hưởng uniqueness/history.
    // Nhưng nếu bạn muốn cho update, cần check FK + handle P2002.
    if (dto.lanHoc != null && dto.lanHoc < 1) {
      throw new BadRequestException("lanHoc must be >= 1");
    }

    try {
      return await this.prisma.dangKyHocPhan.update({
        where: { maDangKy },
        data: {
          ngayDangKy: dto.ngayDangKy ? new Date(dto.ngayDangKy) : undefined,
          trangThai: dto.trangThai,
          lanHoc: dto.lanHoc,
          ghiChu: dto.ghiChu,
        },
        include: { lopHocPhan: true, sinhVien: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        // nếu bạn update lanHoc gây trùng unique(maLopHocPhan, MSSV, lanHoc)
        throw new BadRequestException(
          `Enrollment already exists for (maLopHocPhan=${current.maLopHocPhan}, MSSV=${current.MSSV}, lanHoc=${dto.lanHoc})`
        );
      }
      throw e;
    }
  }

  async remove(maDangKy: string) {
    await this.findOne(maDangKy);

    try {
      return await this.prisma.dangKyHocPhan.delete({ where: { maDangKy } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestException("Cannot delete: DangKyHocPhan is referenced by other records");
      }
      throw e;
    }
  }
}