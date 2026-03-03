import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateHocPhanDto } from "./dto/create-hoc-phan.dto";
import { UpdateHocPhanDto } from "./dto/update-hoc-phan.dto";

@Injectable()
export class HocPhanService {
  constructor(private readonly prisma: PrismaService) { }

  private async assertDonViExists(maDonVi: string) {
    const dv = await this.prisma.donVi.findUnique({
      where: { maDonVi },
      select: { maDonVi: true },
    });
    if (!dv) throw new BadRequestException("DonVi không tồn tại!");
  }

  async create(dto: CreateHocPhanDto) {
    await this.assertDonViExists(dto.maDonVi);

    try {
      const { maDonVi, ...rest } = dto;
      return await this.prisma.hocPhan.create({
        data: {
          ...rest,
          donVi: { connect: { maDonVi: dto.maDonVi } },
        },
        include: { donVi: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("maHocPhan đã tồn tại!");
        if (e.code === "P2003") throw new BadRequestException("maDonVi không tồn tại!");
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.hocPhan.findMany({
      orderBy: { maHocPhan: "asc" },
      include: { donVi: true },
    });
  }

  async findOne(maHocPhan: string) {
    const item = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      include: {
        donVi: true,
        // nếu bạn muốn kèm relations:
        // clos: true,
        // cos: true,
        // lopHocPhans: true,
      },
    });
    if (!item) throw new NotFoundException("HocPhan not found");
    return item;
  }

  async update(maHocPhan: string, dto: UpdateHocPhanDto) {
    await this.findOne(maHocPhan);
    const { maDonVi, ...rest } = dto;

    if (maDonVi) await this.assertDonViExists(maDonVi);

    return this.prisma.hocPhan.update({
      where: { maHocPhan },
      data: {
        ...rest,
        donVi: maDonVi ? { connect: { maDonVi } } : undefined,
      },
      include: { donVi: true },
    });
  }

  async remove(maHocPhan: string) {
    await this.findOne(maHocPhan);
    return this.prisma.hocPhan.delete({ where: { maHocPhan } });
  }
}