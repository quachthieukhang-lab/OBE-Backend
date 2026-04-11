import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCauHinhObeDto } from "./dto/create-cau-hinh-obe.dto";
import { UpdateCauHinhObeDto } from "./dto/update-cau-hinh-obe.dto";

@Injectable()
export class CauHinhObeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCauHinhObeDto) {
    try {
      return await this.prisma.cauHinhOBE.create({
        data: {
          namHoc: dto.namHoc,
          nguongDatCaNhan: new Prisma.Decimal(dto.nguongDatCaNhan),
          kpiLopHoc: new Prisma.Decimal(dto.kpiLopHoc),
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("CauHinhOBE already exists");
        }
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.cauHinhOBE.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.cauHinhOBE.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException("CauHinhOBE not found");
    }

    return item;
  }

  async update(id: string, dto: UpdateCauHinhObeDto) {
    await this.findOne(id);

    return this.prisma.cauHinhOBE.update({
      where: { id },
      data: {
        ...(dto.namHoc !== undefined ? { namHoc: dto.namHoc } : {}),
        ...(dto.nguongDatCaNhan !== undefined
          ? { nguongDatCaNhan: new Prisma.Decimal(dto.nguongDatCaNhan) }
          : {}),
        ...(dto.kpiLopHoc !== undefined
          ? { kpiLopHoc: new Prisma.Decimal(dto.kpiLopHoc) }
          : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.cauHinhOBE.delete({
      where: { id },
    });
  }

  async findByNamHoc(namHoc: string) {
    const item = await this.prisma.cauHinhOBE.findFirst({
      where: { namHoc },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!item) {
      throw new NotFoundException(`CauHinhOBE not found for namHoc=${namHoc}`);
    }

    return item;
  }
}