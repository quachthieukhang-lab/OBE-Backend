import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChuongTrinhDaoTaoDto } from "./dto/create-chuong-trinh-dao-tao.dto";
import { UpdateChuongTrinhDaoTaoDto } from "./dto/update-chuong-trinh-dao-tao.dto";

@Injectable()
export class ChuongTrinhDaoTaoService {
  constructor(private readonly prisma: PrismaService) { }

  private async assertDonViExists(maDonVi: string) {
    const dv = await this.prisma.donVi.findUnique({
      where: { maDonVi },
      select: { maDonVi: true },
    });
    if (!dv) throw new BadRequestException("DonVi not found");
  }

  async create(dto: CreateChuongTrinhDaoTaoDto) {
    await this.assertDonViExists(dto.maDonVi);

    try {
      const { maDonVi, ...rest } = dto;
      return await this.prisma.chuongTrinhDaoTao.create({
        data: {
          ...rest,
          donVi: { connect: { maDonVi: dto.maDonVi } },
        },
        include: { donVi: true },
      });
    } catch (e: any) {
      // Prisma error handling: check .code để trả lỗi rõ :contentReference[oaicite:2]{index=2}
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("maSoNganh already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key invalid (maDonVi)");
        }
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.chuongTrinhDaoTao.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        donVi: true,
        chuongTrinhNienKhoas: { include: { nienKhoa: true } },
      },
    });
  }

  async findOne(maSoNganh: string) {
    const item = await this.prisma.chuongTrinhDaoTao.findUnique({
      where: { maSoNganh },
      include: {
        donVi: true,
        chuongTrinhNienKhoas: { include: { nienKhoa: true } },
        chuongTrinhHocPhans: { include: { hocPhan: true } },
        plos: true,
      },
    });

    if (!item) throw new NotFoundException("ChuongTrinhDaoTao not found");
    return item;
  }

  async update(maSoNganh: string, dto: UpdateChuongTrinhDaoTaoDto) {
    await this.findOne(maSoNganh);
    const { maDonVi, ...rest } = dto;

    if (maDonVi) await this.assertDonViExists(maDonVi);

    return this.prisma.chuongTrinhDaoTao.update({
      where: { maSoNganh },
      data: {
        ...rest,
        donVi: maDonVi ? { connect: { maDonVi } } : undefined,
      },
      include: { donVi: true },
    });
  }

  async remove(maSoNganh: string) {
    await this.findOne(maSoNganh);
    return this.prisma.chuongTrinhDaoTao.delete({ where: { maSoNganh } });
  }
}