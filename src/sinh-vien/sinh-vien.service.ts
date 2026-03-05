import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSinhVienDto } from "./dto/create-sinh-vien.dto";
import { UpdateSinhVienDto } from "./dto/update-sinh-vien.dto";

@Injectable()
export class SinhVienService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertRefs(dto: { maDonVi?: string; khoa?: number; maSoNganh?: string }) {
    const checks: Promise<any>[] = [];

    if (dto.maDonVi) {
      checks.push(
        this.prisma.donVi.findUnique({
          where: { maDonVi: dto.maDonVi },
          select: { maDonVi: true },
        })
      );
    }
    if (dto.khoa != null) {
      checks.push(
        this.prisma.nienKhoa.findUnique({
          where: { khoa: dto.khoa },
          select: { khoa: true },
        })
      );
    }
    if (dto.maSoNganh) {
      checks.push(
        this.prisma.chuongTrinhDaoTao.findUnique({
          where: { maSoNganh: dto.maSoNganh },
          select: { maSoNganh: true },
        })
      );
    }

    const results = await Promise.all(checks);

    let i = 0;
    if (dto.maDonVi) {
      const ok = results[i++];
      if (!ok) throw new BadRequestException("DonVi not found");
    }
    if (dto.khoa != null) {
      const ok = results[i++];
      if (!ok) throw new BadRequestException("NienKhoa not found");
    }
    if (dto.maSoNganh) {
      const ok = results[i++];
      if (!ok) throw new BadRequestException("ChuongTrinhDaoTao not found");
    }
  }

  async create(dto: CreateSinhVienDto) {
    await this.assertRefs({ maDonVi: dto.maDonVi, khoa: dto.khoa, maSoNganh: dto.maSoNganh });

    try {
      const { ngaySinh, ...rest} = dto
      return await this.prisma.sinhVien.create({
        data: {
          ...rest,
          ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : undefined,
          
        },
        include: { donVi: true, nienKhoa: true, chuongTrinh: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("MSSV already exists");
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.sinhVien.findMany({
      orderBy: { MSSV: "asc" },
      include: { donVi: true, nienKhoa: true, chuongTrinh: true },
    });
  }

  async findOne(MSSV: string) {
    const item = await this.prisma.sinhVien.findUnique({
      where: { MSSV },
      include: {
        donVi: true,
        nienKhoa: true,
        chuongTrinh: true,
        dangKyHocPhans: true,
      },
    });
    if (!item) throw new NotFoundException("SinhVien not found");
    return item;
  }

  async update(MSSV: string, dto: UpdateSinhVienDto) {
    await this.findOne(MSSV);
    await this.assertRefs({ maDonVi: dto.maDonVi, khoa: dto.khoa, maSoNganh: dto.maSoNganh });

    return this.prisma.sinhVien.update({
      where: { MSSV },
      data: {
        hoTen: dto.hoTen,
        ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : undefined,
        gioiTinh: dto.gioiTinh,
        email: dto.email,
        soDienThoai: dto.soDienThoai,
        trangThaiHocTap: dto.trangThaiHocTap,

        maDonVi: dto.maDonVi,
        khoa: dto.khoa,
        maSoNganh: dto.maSoNganh,
      },
      include: { donVi: true, nienKhoa: true, chuongTrinh: true },
    });
  }

  async remove(MSSV: string) {
    await this.findOne(MSSV);

    try {
      return await this.prisma.sinhVien.delete({ where: { MSSV } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestException("Cannot delete: SinhVien is referenced by other records");
      }
      throw e;
    }
  }
}