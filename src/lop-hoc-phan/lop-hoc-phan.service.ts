import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLopHocPhanDto } from "./dto/create-lop-hoc-phan.dto";
import { UpdateLopHocPhanDto } from "./dto/update-lop-hoc-phan.dto";

@Injectable()
export class LopHocPhanService {
  constructor(private readonly prisma: PrismaService) { }

  private async assertRefs(dto: { MSGV?: string; maHocPhan?: string; khoa?: number }) {
    const tasks: Promise<any>[] = [];

    if (dto.MSGV) {
      tasks.push(
        this.prisma.giangVien.findUnique({
          where: { MSGV: dto.MSGV },
          select: { MSGV: true },
        })
      );
    }
    if (dto.maHocPhan) {
      tasks.push(
        this.prisma.hocPhan.findUnique({
          where: { maHocPhan: dto.maHocPhan },
          select: { maHocPhan: true },
        })
      );
    }
    if (dto.khoa != null) {
      tasks.push(
        this.prisma.nienKhoa.findUnique({
          where: { khoa: dto.khoa },
          select: { khoa: true },
        })
      );
    }

    const results = await Promise.all(tasks);

    let i = 0;
    if (dto.MSGV) {
      const ok = results[i++];
      if (!ok) throw new BadRequestException("GiangVien not found");
    }
    if (dto.maHocPhan) {
      const ok = results[i++];
      if (!ok) throw new BadRequestException("HocPhan not found");
    }
    if (dto.khoa != null) {
      const ok = results[i++];
      if (!ok) throw new BadRequestException("NienKhoa not found");
    }
  }

  async create(dto: CreateLopHocPhanDto) {
    await this.assertRefs({ MSGV: dto.MSGV, maHocPhan: dto.maHocPhan, khoa: dto.khoa });

    // optional: validate date range


    try {
      const { ngayBatDau, ngayKetThuc, ...rest } = dto
      if (ngayBatDau && ngayKetThuc) {
        const start = new Date(ngayBatDau);
        const end = new Date(ngayKetThuc);
        if (end < start) throw new BadRequestException("ngayKetThuc must be >= ngayBatDau");
      }
      return await this.prisma.lopHocPhan.create({
        data: {
          ...rest,
          ngayBatDau: dto.ngayBatDau ? new Date(dto.ngayBatDau) : undefined,
          ngayKetThuc: dto.ngayKetThuc ? new Date(dto.ngayKetThuc) : undefined,
        },
        include: { giangVien: true, hocPhan: true, nienKhoa: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("maLopHocPhan already exists");
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.lopHocPhan.findMany({
      orderBy: [{ khoa: "desc" }, { hocKy: "desc" }, { maLopHocPhan: "asc" }],
      include: { giangVien: true, hocPhan: true, nienKhoa: true },
    });
  }

  async findOne(maLopHocPhan: string) {
    const item = await this.prisma.lopHocPhan.findUnique({
      where: { maLopHocPhan },
      include: {
        giangVien: true,
        hocPhan: true,
        nienKhoa: true,
        dangKyHocPhans: true,
      },
    });
    if (!item) throw new NotFoundException("LopHocPhan not found");
    return item;
  }

  async update(maLopHocPhan: string, dto: UpdateLopHocPhanDto) {
    await this.findOne(maLopHocPhan);
    await this.assertRefs({ MSGV: dto.MSGV, maHocPhan: dto.maHocPhan, khoa: dto.khoa });

    if (dto.ngayBatDau && dto.ngayKetThuc) {
      const start = new Date(dto.ngayBatDau);
      const end = new Date(dto.ngayKetThuc);
      if (end < start) throw new BadRequestException("ngayKetThuc must be >= ngayBatDau");
    }
    return this.prisma.lopHocPhan.update({
      where: { maLopHocPhan },
      data: {
        // không cho update maLopHocPhan vì là PK
        MSGV: dto.MSGV,
        maHocPhan: dto.maHocPhan,
        khoa: dto.khoa,
        hocKy: dto.hocKy,
        nhom: dto.nhom,
        siSoToiDa: dto.siSoToiDa,
        phongHoc: dto.phongHoc,
        lichHoc: dto.lichHoc,
        ngayBatDau: dto.ngayBatDau ? new Date(dto.ngayBatDau) : undefined,
        ngayKetThuc: dto.ngayKetThuc ? new Date(dto.ngayKetThuc) : undefined,
        status: dto.status,
      },
      include: { giangVien: true, hocPhan: true, nienKhoa: true },
    });
  }

  async remove(maLopHocPhan: string) {
    await this.findOne(maLopHocPhan);

    try {
      return await this.prisma.lopHocPhan.delete({ where: { maLopHocPhan } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new BadRequestException("Cannot delete: LopHocPhan is referenced by other records");
      }
      throw e;
    }
  }
}