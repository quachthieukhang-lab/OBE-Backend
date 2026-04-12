import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDeCuongChiTietDto } from "./dto/create-de-cuong-chi-tiet.dto";
import { UpdateDeCuongChiTietDto } from "./dto/update-de-cuong-chi-tiet.dto";

@Injectable()
export class DeCuongChiTietService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertHocPhanExists(maHocPhan: string) {
    const hp = await this.prisma.hocPhan.findUnique({
      where: { maHocPhan },
      select: { maHocPhan: true },
    });
    if (!hp) throw new BadRequestException("HocPhan not found");
  }

  async create(dto: CreateDeCuongChiTietDto) {
    await this.assertHocPhanExists(dto.maHocPhan);

    try {
      return await this.prisma.deCuongChiTiet.create({
        data: {
          maHocPhan: dto.maHocPhan,
          phienBan: dto.phienBan,
          ngayApDung: dto.ngayApDung ? new Date(dto.ngayApDung) : undefined,
          trangThai: dto.trangThai ?? "draft",
          ghiChu: dto.ghiChu,
        },
        include: {
          hocPhan: true,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("DeCuong with this (maHocPhan, phienBan) already exists");
        }
        if (e.code === "P2003") {
          throw new BadRequestException("Foreign key constraint failed");
        }
      }
      throw e;
    }
  }

  async findAll(maHocPhan?: string) {
    return this.prisma.deCuongChiTiet.findMany({
      where: maHocPhan ? { maHocPhan } : undefined,
      orderBy: [{ maHocPhan: "asc" }, { createdAt: "desc" }],
      include: {
        hocPhan: { select: { maHocPhan: true, tenHocPhan: true, soTinChi: true } },
      },
    });
  }

  async findOne(maDeCuong: string) {
    const item = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      include: {
        hocPhan: true,
        clos: { orderBy: [{ code: "asc" }, { maCLO: "asc" }] },
        cos: { orderBy: [{ code: "asc" }, { maCO: "asc" }] },
        cachDanhGias: { orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }] },
      },
    });
    if (!item) throw new NotFoundException("DeCuongChiTiet not found");
    return item;
  }

  async findActiveByHocPhan(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    const item = await this.prisma.deCuongChiTiet.findFirst({
      where: { maHocPhan, trangThai: "active" },
      orderBy: { createdAt: "desc" },
      include: {
        hocPhan: true,
        clos: { orderBy: [{ code: "asc" }, { maCLO: "asc" }] },
        cos: { orderBy: [{ code: "asc" }, { maCO: "asc" }] },
        cachDanhGias: { orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }] },
      },
    });
    if (!item) throw new NotFoundException("No active DeCuong found for this HocPhan");
    return item;
  }

  async update(maDeCuong: string, dto: UpdateDeCuongChiTietDto) {
    await this.findOne(maDeCuong);

    if (dto.maHocPhan) {
      await this.assertHocPhanExists(dto.maHocPhan);
    }

    try {
      return await this.prisma.deCuongChiTiet.update({
        where: { maDeCuong },
        data: {
          maHocPhan: dto.maHocPhan,
          phienBan: dto.phienBan,
          ngayApDung: dto.ngayApDung ? new Date(dto.ngayApDung) : undefined,
          trangThai: dto.trangThai,
          ghiChu: dto.ghiChu,
        },
        include: { hocPhan: true },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("DeCuong with this (maHocPhan, phienBan) already exists");
        }
      }
      throw e;
    }
  }

  async remove(maDeCuong: string) {
    await this.findOne(maDeCuong);

    const [clos, cos, cdgs] = await Promise.all([
      this.prisma.cLO.findMany({ where: { maDeCuong }, select: { maCLO: true } }),
      this.prisma.cO.findMany({ where: { maDeCuong }, select: { maCO: true } }),
      this.prisma.cachDanhGia.findMany({ where: { maDeCuong }, select: { maCDG: true } }),
    ]);

    const maCLOs = clos.map((c) => c.maCLO);
    const maCOs = cos.map((c) => c.maCO);
    const maCDGs = cdgs.map((c) => c.maCDG);

    return this.prisma.$transaction(async (tx) => {
      if (maCLOs.length > 0) {
        await tx.ketQuaCLO.deleteMany({ where: { maCLO: { in: maCLOs } } });
      }
      if (maCOs.length > 0) {
        await tx.ketQuaCO.deleteMany({ where: { maCO: { in: maCOs } } });
      }

      if (maCLOs.length > 0) {
        await tx.cloPloMapping.deleteMany({ where: { maCLO: { in: maCLOs } } });
        await tx.cloCoMapping.deleteMany({ where: { maCLO: { in: maCLOs } } });
      }
      if (maCDGs.length > 0) {
        await tx.cdgCoMapping.deleteMany({ where: { maCDG: { in: maCDGs } } });
        await tx.diemSo.deleteMany({ where: { maCDG: { in: maCDGs } } });
      }

      await tx.cLO.deleteMany({ where: { maDeCuong } });
      await tx.cO.deleteMany({ where: { maDeCuong } });
      await tx.cachDanhGia.deleteMany({ where: { maDeCuong } });

      await tx.lopHocPhan.updateMany({
        where: { maDeCuong },
        data: { maDeCuong: null },
      });

      return tx.deCuongChiTiet.delete({ where: { maDeCuong } });
    });
  }

  private async assertDeCuongExists(maDeCuong: string) {
    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      select: { maDeCuong: true, maHocPhan: true },
    });
    if (!dc) throw new NotFoundException("DeCuongChiTiet not found");
    return dc;
  }

  async getCloPloMappingMatrix(
    maDeCuong: string,
    filter?: { maSoNganh?: string; khoa?: number },
  ) {
    const dc = await this.assertDeCuongExists(maDeCuong);

    const [clos, programLinks] = await Promise.all([
      this.prisma.cLO.findMany({
        where: { maDeCuong },
        orderBy: [{ code: "asc" }, { maCLO: "asc" }],
        select: { maCLO: true, maDeCuong: true, code: true, noiDungChuanDauRa: true },
      }),
      this.prisma.chuongTrinhDaoTaoHocPhan.findMany({
        where: { maHocPhan: dc.maHocPhan },
        select: { maSoNganh: true, khoa: true },
      }),
    ]);

    const uniquePairs = this.resolveProgramCohortPairs(programLinks, filter);

    const plos =
      uniquePairs.length === 0
        ? []
        : await this.prisma.pLO.findMany({
            where: { OR: uniquePairs.map((p) => ({ maSoNganh: p.maSoNganh, khoa: p.khoa })) },
            orderBy: [{ code: "asc" }, { maPLO: "asc" }],
            select: { maPLO: true, maSoNganh: true, khoa: true, code: true, noiDungChuanDauRa: true },
          });

    const maCLOs = clos.map((x) => x.maCLO);
    const allowedMaPLOs = plos.map((p) => p.maPLO);

    const mappings =
      maCLOs.length === 0 || allowedMaPLOs.length === 0
        ? []
        : await this.prisma.cloPloMapping.findMany({
            where: { maCLO: { in: maCLOs }, maPLO: { in: allowedMaPLOs } },
            orderBy: [{ maCLO: "asc" }, { maPLO: "asc" }],
            select: { maCLO: true, maPLO: true, trongSo: true, ghiChu: true },
          });

    return { clos, plos, mappings };
  }

  async getCloCoMappingMatrix(maDeCuong: string) {
    await this.assertDeCuongExists(maDeCuong);

    const [clos, cos] = await Promise.all([
      this.prisma.cLO.findMany({
        where: { maDeCuong },
        orderBy: [{ code: "asc" }, { maCLO: "asc" }],
        select: { maCLO: true, maDeCuong: true, code: true, noiDungChuanDauRa: true },
      }),
      this.prisma.cO.findMany({
        where: { maDeCuong },
        orderBy: [{ code: "asc" }, { maCO: "asc" }],
        select: { maCO: true, maDeCuong: true, code: true, noiDungChuanDauRa: true },
      }),
    ]);

    const maCLOs = clos.map((x) => x.maCLO);

    const mappings =
      maCLOs.length === 0
        ? []
        : await this.prisma.cloCoMapping.findMany({
            where: { maCLO: { in: maCLOs } },
            orderBy: [{ maCLO: "asc" }, { maCO: "asc" }],
            select: { maCLO: true, maCO: true, trongSo: true, ghiChu: true },
          });

    return { clos, cos, mappings };
  }

  async getCdgCoMappingMatrix(maDeCuong: string) {
    await this.assertDeCuongExists(maDeCuong);

    const [cdgs, cos] = await Promise.all([
      this.prisma.cachDanhGia.findMany({
        where: { maDeCuong },
        orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }],
        select: { maCDG: true, maDeCuong: true, tenThanhPhan: true, cachDanhGia: true, trongSo: true, loai: true },
      }),
      this.prisma.cO.findMany({
        where: { maDeCuong },
        orderBy: [{ code: "asc" }, { maCO: "asc" }],
        select: { maCO: true, maDeCuong: true, code: true, noiDungChuanDauRa: true },
      }),
    ]);

    const maCDGs = cdgs.map((x) => x.maCDG);

    const mappings =
      maCDGs.length === 0
        ? []
        : await this.prisma.cdgCoMapping.findMany({
            where: { maCDG: { in: maCDGs } },
            orderBy: [{ maCDG: "asc" }, { maCO: "asc" }],
            select: { maCDG: true, maCO: true, trongSo: true, ghiChu: true },
          });

    return { cachDanhGias: cdgs, cos, mappings };
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
}
