import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCauHinhObeDto } from "./dto/create-cau-hinh-obe.dto";
import { UpdateCauHinhObeDto } from "./dto/update-cau-hinh-obe.dto";

@Injectable()
export class CauHinhObeService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertNienKhoaExists(khoa: number) {
    const item = await this.prisma.nienKhoa.findUnique({
      where: { khoa },
      select: { khoa: true },
    });

    if (!item) {
      throw new BadRequestException("NienKhoa not found");
    }
  }

  private async assertDonViExists(maDonVi: string) {
    const item = await this.prisma.donVi.findUnique({
      where: { maDonVi },
      select: { maDonVi: true },
    });

    if (!item) {
      throw new BadRequestException("DonVi not found");
    }
  }

  async create(dto: CreateCauHinhObeDto) {
    await this.assertNienKhoaExists(dto.khoa);
    await this.assertDonViExists(dto.maDonVi);

    try {
      return await this.prisma.cauHinhOBE.create({
        data: {
          khoa: dto.khoa,
          maDonVi: dto.maDonVi,
          nguongDatCaNhan: new Prisma.Decimal(dto.nguongDatCaNhan),
          kpiLopHoc: new Prisma.Decimal(dto.kpiLopHoc),
        },
        include: {
          nienKhoa: true,
          donVi: true,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("CauHinhOBE for this (khoa, maDonVi) already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key constraint failed");
        }
      }
      throw e;
    }
  }

  async findAll(filters?: { khoa?: number; maDonVi?: string }) {
    return this.prisma.cauHinhOBE.findMany({
      where: {
        ...(filters?.khoa !== undefined ? { khoa: filters.khoa } : {}),
        ...(filters?.maDonVi ? { maDonVi: filters.maDonVi } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        nienKhoa: true,
        donVi: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.cauHinhOBE.findUnique({
      where: { id },
      include: {
        nienKhoa: true,
        donVi: true,
      },
    });

    if (!item) {
      throw new NotFoundException("CauHinhOBE not found");
    }

    return item;
  }

  async update(id: string, dto: UpdateCauHinhObeDto) {
    await this.findOne(id);

    if (dto.khoa !== undefined) {
      await this.assertNienKhoaExists(dto.khoa);
    }

    if (dto.maDonVi !== undefined) {
      await this.assertDonViExists(dto.maDonVi);
    }

    try {
      return await this.prisma.cauHinhOBE.update({
        where: { id },
        data: {
          ...(dto.khoa !== undefined ? { khoa: dto.khoa } : {}),
          ...(dto.maDonVi !== undefined ? { maDonVi: dto.maDonVi } : {}),
          ...(dto.nguongDatCaNhan !== undefined
            ? { nguongDatCaNhan: new Prisma.Decimal(dto.nguongDatCaNhan) }
            : {}),
          ...(dto.kpiLopHoc !== undefined
            ? { kpiLopHoc: new Prisma.Decimal(dto.kpiLopHoc) }
            : {}),
        },
        include: {
          nienKhoa: true,
          donVi: true,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("CauHinhOBE for this (khoa, maDonVi) already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key constraint failed");
        }
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.cauHinhOBE.delete({
      where: { id },
    });
  }

  async findByKhoaAndDonVi(khoa: number, maDonVi: string) {
    const item = await this.prisma.cauHinhOBE.findUnique({
      where: { khoa_maDonVi: { khoa, maDonVi } },
      include: {
        nienKhoa: true,
        donVi: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`CauHinhOBE not found for khoa=${khoa}, maDonVi=${maDonVi}`);
    }

    return item;
  }
}