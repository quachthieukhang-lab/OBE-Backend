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

  async create(dto: CreateCauHinhObeDto) {
    await this.assertNienKhoaExists(dto.khoa);

    try {
      return await this.prisma.cauHinhOBE.create({
        data: {
          khoa: dto.khoa,
          nguongDatCaNhan: new Prisma.Decimal(dto.nguongDatCaNhan),
          kpiLopHoc: new Prisma.Decimal(dto.kpiLopHoc),
        },
        include: {
          nienKhoa: true,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("CauHinhOBE for this khoa already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key constraint failed");
        }
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.cauHinhOBE.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        nienKhoa: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.cauHinhOBE.findUnique({
      where: { id },
      include: {
        nienKhoa: true,
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

    try {
      return await this.prisma.cauHinhOBE.update({
        where: { id },
        data: {
          ...(dto.khoa !== undefined ? { khoa: dto.khoa } : {}),
          ...(dto.nguongDatCaNhan !== undefined
            ? { nguongDatCaNhan: new Prisma.Decimal(dto.nguongDatCaNhan) }
            : {}),
          ...(dto.kpiLopHoc !== undefined
            ? { kpiLopHoc: new Prisma.Decimal(dto.kpiLopHoc) }
            : {}),
        },
        include: {
          nienKhoa: true,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("CauHinhOBE for this khoa already exists");
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

  async findByKhoa(khoa: number) {
    const item = await this.prisma.cauHinhOBE.findUnique({
      where: { khoa },
      include: {
        nienKhoa: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`CauHinhOBE not found for khoa=${khoa}`);
    }

    return item;
  }
}