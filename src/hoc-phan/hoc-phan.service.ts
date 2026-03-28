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

  async getPloOptions(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    // Tìm tất cả CTĐT có chứa học phần này
    const programLinks = await this.prisma.chuongTrinhDaoTaoHocPhan.findMany({
      where: { maHocPhan },
      select: { maSoNganh: true },
    });

    const maSoNganhs = [...new Set(programLinks.map((x) => x.maSoNganh))];

    if (maSoNganhs.length === 0) {
      return [];
    }

    const plos = await this.prisma.pLO.findMany({
      where: {
        maSoNganh: { in: maSoNganhs },
      },
      orderBy: [{ code: "asc" }, { maPLO: "asc" }],
      select: {
        maPLO: true,
        maSoNganh: true,
        code: true,
        noiDungChuanDauRa: true,
      },
    });

    return plos;
  }

  async getCloPloMappingMatrix(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    const [clos, programLinks] = await Promise.all([
      this.prisma.cLO.findMany({
        where: { maHocPhan },
        orderBy: [{ code: "asc" }, { maCLO: "asc" }],
        select: {
          maCLO: true,
          maHocPhan: true,
          code: true,
          noiDungChuanDauRa: true,
        },
      }),
      this.prisma.chuongTrinhDaoTaoHocPhan.findMany({
        where: { maHocPhan },
        select: { maSoNganh: true },
      }),
    ]);

    const maSoNganhs = [...new Set(programLinks.map((x) => x.maSoNganh))];

    const plos =
      maSoNganhs.length === 0
        ? []
        : await this.prisma.pLO.findMany({
          where: {
            maSoNganh: { in: maSoNganhs },
          },
          orderBy: [{ code: "asc" }, { maPLO: "asc" }],
          select: {
            maPLO: true,
            maSoNganh: true,
            code: true,
            noiDungChuanDauRa: true,
          },
        });

    const maCLOs = clos.map((x) => x.maCLO);

    const mappings =
      maCLOs.length === 0
        ? []
        : await this.prisma.cloPloMapping.findMany({
          where: {
            maCLO: { in: maCLOs },
          },
          orderBy: [{ maCLO: "asc" }, { maPLO: "asc" }],
          select: {
            maCLO: true,
            maPLO: true,
            trongSo: true,
            ghiChu: true,
          },
        });

    return {
      clos,
      plos,
      mappings,
    };
  }

  async getCloCoMappingMatrix(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    const [clos, cos] = await Promise.all([
      this.prisma.cLO.findMany({
        where: { maHocPhan },
        orderBy: [{ code: "asc" }, { maCLO: "asc" }],
        select: {
          maCLO: true,
          maHocPhan: true,
          code: true,
          noiDungChuanDauRa: true,
        },
      }),
      this.prisma.cO.findMany({
        where: { maHocPhan },
        orderBy: [{ code: "asc" }, { maCO: "asc" }],
        select: {
          maCO: true,
          maHocPhan: true,
          code: true,
          noiDungChuanDauRa: true,
        },
      }),
    ]);

    const maCLOs = clos.map((x) => x.maCLO);

    const mappings =
      maCLOs.length === 0
        ? []
        : await this.prisma.cloCoMapping.findMany({
          where: {
            maCLO: { in: maCLOs },
          },
          orderBy: [{ maCLO: "asc" }, { maCO: "asc" }],
          select: {
            maCLO: true,
            maCO: true,
            trongSo: true,
            ghiChu: true,
          },
        });

    return {
      clos,
      cos,
      mappings,
    };
  }

  async getCdgCoMappingMatrix(maHocPhan: string) {
    await this.assertHocPhanExists(maHocPhan);

    const [cdgs, cos] = await Promise.all([
      this.prisma.cachDanhGia.findMany({
        where: { maHocPhan },
        orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }],
        select: {
          maCDG: true,
          maHocPhan: true,
          tenThanhPhan: true,
          cachDanhGia: true,
          trongSo: true,
          loai: true,
        },
      }),
      this.prisma.cO.findMany({
        where: { maHocPhan },
        orderBy: [{ code: "asc" }, { maCO: "asc" }],
        select: {
          maCO: true,
          maHocPhan: true,
          code: true,
          noiDungChuanDauRa: true,
        },
      }),
    ]);

    const maCDGs = cdgs.map((x) => x.maCDG);

    const mappings =
      maCDGs.length === 0
        ? []
        : await this.prisma.cdgCoMapping.findMany({
          where: {
            maCDG: { in: maCDGs },
          },
          orderBy: [{ maCDG: "asc" }, { maCO: "asc" }],
          select: {
            maCDG: true,
            maCO: true,
            trongSo: true,
            ghiChu: true,
          },
        });

    return {
      cdgs,
      cos,
      mappings,
    };
  }
}