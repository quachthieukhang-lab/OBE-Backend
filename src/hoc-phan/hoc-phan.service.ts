import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateHocPhanDto } from "./dto/create-hoc-phan.dto";
import { UpdateHocPhanDto } from "./dto/update-hoc-phan.dto";

@Injectable()
export class HocPhanService {
  constructor(private readonly prisma: PrismaService) { }

  private async assertHocPhanExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new NotFoundException("HocPhan not found");
  }

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
        deCuongs: {
          orderBy: { createdAt: "desc" },
          select: { maDeCuong: true, phienBan: true, trangThai: true, ngayApDung: true },
        },
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

  private resolveProgramCohortPairs(
    programLinks: Array<{ maSoNganh: string; khoa: number }>,
    filter?: { maSoNganh?: string; khoa?: number },
  ) {
    const uniquePairs = programLinks.filter(
      (x, i, arr) => arr.findIndex((y) => y.maSoNganh === x.maSoNganh && y.khoa === x.khoa) === i,
    );

    const hasMa = filter?.maSoNganh != null && filter.maSoNganh !== "";
    const hasKhoa = filter?.khoa != null && !Number.isNaN(filter.khoa);

    if (hasMa !== hasKhoa) {
      throw new BadRequestException("Khi lọc theo khóa, phải gửi đồng thời query maSoNganh và khoa");
    }

    if (hasMa && hasKhoa) {
      const maSoNganh = filter!.maSoNganh!;
      const khoa = filter!.khoa!;
      const ok = uniquePairs.some((p) => p.maSoNganh === maSoNganh && p.khoa === khoa);
      if (!ok) {
        throw new BadRequestException("Học phần không nằm trong khung CTĐT của (maSoNganh, khoa) đã chọn");
      }
      return [{ maSoNganh, khoa }];
    }

    return uniquePairs;
  }

  async getPloOptions(
    maHocPhan: string,
    filter?: { maSoNganh?: string; khoa?: number },
  ) {
    await this.assertHocPhanExists(maHocPhan);

    const programLinks = await this.prisma.chuongTrinhDaoTaoHocPhan.findMany({
      where: { maHocPhan },
      select: { maSoNganh: true, khoa: true },
    });

    const uniquePairs = this.resolveProgramCohortPairs(programLinks, filter);

    if (uniquePairs.length === 0) {
      return [];
    }

    return this.prisma.pLO.findMany({
      where: {
        OR: uniquePairs.map((p) => ({ maSoNganh: p.maSoNganh, khoa: p.khoa })),
      },
      orderBy: [{ code: "asc" }, { maPLO: "asc" }],
      select: {
        maPLO: true,
        maSoNganh: true,
        khoa: true,
        code: true,
        noiDungChuanDauRa: true,
      },
    });
  }
}
