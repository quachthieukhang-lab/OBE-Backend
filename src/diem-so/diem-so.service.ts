import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDiemSoDto } from "./dto/create-diem-so.dto";
import { UpdateDiemSoDto } from "./dto/update-diem-so.dto";

@Injectable()
export class DiemSoService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateTiLeHoanThanh(
    diem: Prisma.Decimal,
    trongSo: Prisma.Decimal
  ): Prisma.Decimal {
    if (trongSo.equals(0)) {
      return new Prisma.Decimal(0);
    }

    const ratio = diem.div(trongSo);

    if (ratio.lessThan(0)) return new Prisma.Decimal(0);
    if (ratio.greaterThan(1)) return new Prisma.Decimal(1);

    return ratio.toDecimalPlaces(4);
  }

  private async getEnrollment(maDangKy: string) {
    const dk = await this.prisma.dangKyHocPhan.findUnique({
      where: { maDangKy },
      select: {
        maDangKy: true,
        MSSV: true,
        maLopHocPhan: true,
      },
    });

    if (!dk) {
      throw new BadRequestException("DangKyHocPhan not found");
    }

    return dk;
  }

  private async assertGiangVienExists(MSGV: string) {
    const gv = await this.prisma.giangVien.findUnique({
      where: { MSGV },
      select: { MSGV: true },
    });

    if (!gv) {
      throw new BadRequestException("GiangVien not found");
    }
  }

  private async assertCdgExists(maCDG: string) {
    const cdg = await this.prisma.cachDanhGia.findUnique({
      where: { maCDG },
      select: {
        maCDG: true,
        maHocPhan: true,
        trongSo: true,
      },
    });

    if (!cdg) {
      throw new BadRequestException("CachDanhGia not found");
    }

    return cdg;
  }

  async findOne(maDangKy: string, maCDG: string) {
    const item = await this.prisma.diemSo.findFirst({
      where: { maDangKy, maCDG },
      include: {
        cachDanhGia: true,
        giangVien: true,
        sinhVien: true,
        lopHocPhan: true,
        dangKyHocPhan: true,
      },
    });

    if (!item) {
      throw new NotFoundException("DiemSo not found");
    }

    return item;
  }

  async findAll(maDangKy: string) {
    await this.getEnrollment(maDangKy);

    return this.prisma.diemSo.findMany({
      where: { maDangKy },
      orderBy: { createdAt: "asc" },
      include: {
        cachDanhGia: true,
        giangVien: true,
        sinhVien: true,
      },
    });
  }

  async create(maDangKy: string, dto: CreateDiemSoDto) {
    const dk = await this.getEnrollment(maDangKy);
    const cdg = await this.assertCdgExists(dto.maCDG);

    if (dto.MSGV) {
      await this.assertGiangVienExists(dto.MSGV);
    }

    const diemDecimal = new Prisma.Decimal(dto.diem);
    const trongSoDecimal = new Prisma.Decimal(cdg.trongSo);
    const tiLeHoanThanh = this.calculateTiLeHoanThanh(diemDecimal, trongSoDecimal);

    try {
      return await this.prisma.diemSo.create({
        data: {
          maDangKy: dk.maDangKy,
          MSSV: dk.MSSV,
          maLopHocPhan: dk.maLopHocPhan,
          maCDG: dto.maCDG,
          diem: diemDecimal,
          tiLeHoanThanh,
          MSGV: dto.MSGV,
        },
        include: {
          cachDanhGia: true,
          giangVien: true,
          sinhVien: true,
          lopHocPhan: true,
          dangKyHocPhan: true,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
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

  async update(maDangKy: string, maCDG: string, dto: UpdateDiemSoDto) {
    const current = await this.findOne(maDangKy, maCDG);

    if (dto.MSGV) {
      await this.assertGiangVienExists(dto.MSGV);
    }

    let nextDiem = current.diem as Prisma.Decimal;
    let nextTiLeHoanThanh = current.tiLeHoanThanh as Prisma.Decimal | null;

    if (dto.diem != null) {
      const cdg = await this.assertCdgExists(maCDG);

      nextDiem = new Prisma.Decimal(dto.diem);
      nextTiLeHoanThanh = this.calculateTiLeHoanThanh(
        nextDiem,
        new Prisma.Decimal(cdg.trongSo)
      );
    }

    return this.prisma.diemSo.update({
      where: { id: current.id },
      data: {
        ...(dto.diem != null
          ? {
              diem: nextDiem,
              tiLeHoanThanh: nextTiLeHoanThanh,
            }
          : {}),
        MSGV: dto.MSGV,
      },
      include: {
        cachDanhGia: true,
        giangVien: true,
        sinhVien: true,
        lopHocPhan: true,
        dangKyHocPhan: true,
      },
    });
  }

  async remove(maDangKy: string, maCDG: string) {
    const current = await this.findOne(maDangKy, maCDG);

    return this.prisma.diemSo.delete({
      where: { id: current.id },
    });
  }
}