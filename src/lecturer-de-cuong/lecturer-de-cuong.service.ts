import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloDto } from "src/clo/dto/create-clo.dto";
import { UpdateCloDto } from "src/clo/dto/update-clo.dto";
import { CreateCoDto } from "src/co/dto/create-co.dto";
import { UpdateCoDto } from "src/co/dto/update-co.dto";
import { CreateCachDanhGiaDto } from "src/cach-danh-gia/dto/create-cach-danh-gia.dto";
import { UpdateCachDanhGiaDto } from "src/cach-danh-gia/dto/update-cach-danh-gia.dto";

@Injectable()
export class LecturerDeCuongService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify the assignment belongs to this lecturer and return it.
   */
  private async assertAssignmentOwnership(
    MSGV: string,
    maBanPhanCong: string,
  ) {
    const item =
      await this.prisma.banPhanCongNhapDeCuongChiTietHP.findUnique({
        where: { maBanPhanCong },
        include: {
          ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
          hocPhan: true,
          giangVien: true,
        },
      });

    if (!item) throw new NotFoundException("BanPhanCong not found");
    if (item.MSGV !== MSGV)
      throw new ForbiddenException(
        "Bạn không được phân công cho đề cương này",
      );

    return item;
  }

  /**
   * Verify the syllabus is linked to one of this lecturer's assignments.
   */
  private async assertSyllabusOwnership(MSGV: string, maDeCuong: string) {
    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      select: { maDeCuong: true, maHocPhan: true },
    });
    if (!dc) throw new NotFoundException("DeCuongChiTiet not found");

    const assignment =
      await this.prisma.banPhanCongNhapDeCuongChiTietHP.findFirst({
        where: { MSGV, maHocPhan: dc.maHocPhan },
        select: { maBanPhanCong: true },
      });

    if (!assignment)
      throw new ForbiddenException(
        "Bạn không có phân công cho học phần của đề cương này",
      );

    return dc;
  }

  // ─── My Assignments ──────────────────────────────────────

  async listMyAssignments(MSGV: string) {
    return this.prisma.banPhanCongNhapDeCuongChiTietHP.findMany({
      where: { MSGV },
      orderBy: { assignedAt: "desc" },
      include: {
        ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
        hocPhan: true,
        giangVien: true,
      },
    });
  }

  async getAssignmentDetail(MSGV: string, maBanPhanCong: string) {
    const assignment = await this.assertAssignmentOwnership(
      MSGV,
      maBanPhanCong,
    );

    const deCuongs = await this.prisma.deCuongChiTiet.findMany({
      where: { maHocPhan: assignment.maHocPhan },
      orderBy: { createdAt: "desc" },
      include: {
        hocPhan: { select: { maHocPhan: true, tenHocPhan: true } },
        clos: { orderBy: [{ code: "asc" }, { maCLO: "asc" }] },
        cos: { orderBy: [{ code: "asc" }, { maCO: "asc" }] },
        cachDanhGias: { orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }] },
      },
    });

    return { assignment, deCuongs };
  }

  async updateAssignmentStatus(
    MSGV: string,
    maBanPhanCong: string,
    trangThai: string,
  ) {
    await this.assertAssignmentOwnership(MSGV, maBanPhanCong);

    return this.prisma.banPhanCongNhapDeCuongChiTietHP.update({
      where: { maBanPhanCong },
      data: { trangThai },
      include: {
        ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
        hocPhan: true,
        giangVien: true,
      },
    });
  }

  // ─── My Syllabi (for "Xem đề cương đã nhập") ──────────────

  async listMySyllabi(MSGV: string) {
    const assignments =
      await this.prisma.banPhanCongNhapDeCuongChiTietHP.findMany({
        where: { MSGV },
        select: {
          maBanPhanCong: true,
          maHocPhan: true,
          maSoNganh: true,
          khoa: true,
          vaiTro: true,
          trangThai: true,
        },
      });

    if (assignments.length === 0) return [];

    const maHocPhans = [
      ...new Set(assignments.map((a) => a.maHocPhan)),
    ];

    const deCuongs = await this.prisma.deCuongChiTiet.findMany({
      where: { maHocPhan: { in: maHocPhans } },
      orderBy: [{ maHocPhan: "asc" }, { createdAt: "desc" }],
      include: {
        hocPhan: { select: { maHocPhan: true, tenHocPhan: true, soTinChi: true } },
        _count: { select: { clos: true, cos: true, cachDanhGias: true } },
      },
    });

    return deCuongs.map((dc) => {
      const relatedAssignment = assignments.find(
        (a) => a.maHocPhan === dc.maHocPhan,
      );
      return {
        maDeCuong: dc.maDeCuong,
        maHocPhan: dc.maHocPhan,
        tenHocPhan: dc.hocPhan.tenHocPhan,
        soTinChi: dc.hocPhan.soTinChi,
        phienBan: dc.phienBan,
        trangThai: dc.trangThai,
        ngayApDung: dc.ngayApDung,
        ghiChu: dc.ghiChu,
        createdAt: dc.createdAt,
        counts: dc._count,
        assignment: relatedAssignment
          ? {
              maBanPhanCong: relatedAssignment.maBanPhanCong,
              maSoNganh: relatedAssignment.maSoNganh,
              khoa: relatedAssignment.khoa,
              vaiTro: relatedAssignment.vaiTro,
              trangThaiPhanCong: relatedAssignment.trangThai,
            }
          : null,
      };
    });
  }

  // ─── Syllabus CRUD ────────────────────────────────────────

  async createSyllabus(
    MSGV: string,
    maBanPhanCong: string,
    dto: { phienBan: string; ngayApDung?: string; trangThai?: string; ghiChu?: string },
  ) {
    const assignment = await this.assertAssignmentOwnership(
      MSGV,
      maBanPhanCong,
    );

    try {
      const dc = await this.prisma.deCuongChiTiet.create({
        data: {
          maHocPhan: assignment.maHocPhan,
          phienBan: dto.phienBan,
          ngayApDung: dto.ngayApDung ? new Date(dto.ngayApDung) : undefined,
          trangThai: dto.trangThai ?? "draft",
          ghiChu: dto.ghiChu,
        },
        include: { hocPhan: true },
      });

      await this.prisma.banPhanCongNhapDeCuongChiTietHP.update({
        where: { maBanPhanCong },
        data: { trangThai: "in_progress" },
      });

      return dc;
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new BadRequestException(
            "DeCuong with this (maHocPhan, phienBan) already exists",
          );
      }
      throw e;
    }
  }

  async getSyllabusDetail(MSGV: string, maDeCuong: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);

    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      include: {
        hocPhan: true,
        clos: { orderBy: [{ code: "asc" }, { maCLO: "asc" }] },
        cos: { orderBy: [{ code: "asc" }, { maCO: "asc" }] },
        cachDanhGias: { orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }] },
      },
    });
    if (!dc) throw new NotFoundException("DeCuongChiTiet not found");
    return dc;
  }

  async updateSyllabus(
    MSGV: string,
    maDeCuong: string,
    dto: { phienBan?: string; ngayApDung?: string; trangThai?: string; ghiChu?: string },
  ) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);

    try {
      return await this.prisma.deCuongChiTiet.update({
        where: { maDeCuong },
        data: {
          phienBan: dto.phienBan,
          ngayApDung: dto.ngayApDung ? new Date(dto.ngayApDung) : undefined,
          trangThai: dto.trangThai,
          ghiChu: dto.ghiChu,
        },
        include: { hocPhan: true },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new BadRequestException(
            "DeCuong with this (maHocPhan, phienBan) already exists",
          );
      }
      throw e;
    }
  }

  async deleteSyllabus(MSGV: string, maDeCuong: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);

    const [clos, cos, cdgs] = await Promise.all([
      this.prisma.cLO.findMany({ where: { maDeCuong }, select: { maCLO: true } }),
      this.prisma.cO.findMany({ where: { maDeCuong }, select: { maCO: true } }),
      this.prisma.cachDanhGia.findMany({ where: { maDeCuong }, select: { maCDG: true } }),
    ]);

    const maCLOs = clos.map((c) => c.maCLO);
    const maCOs = cos.map((c) => c.maCO);
    const maCDGs = cdgs.map((c) => c.maCDG);

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete OBE results referencing CLOs/COs of this syllabus
      if (maCLOs.length > 0) {
        await tx.ketQuaCLO.deleteMany({ where: { maCLO: { in: maCLOs } } });
      }
      if (maCOs.length > 0) {
        await tx.ketQuaCO.deleteMany({ where: { maCO: { in: maCOs } } });
      }

      // 2. Delete mappings
      if (maCLOs.length > 0) {
        await tx.cloPloMapping.deleteMany({ where: { maCLO: { in: maCLOs } } });
        await tx.cloCoMapping.deleteMany({ where: { maCLO: { in: maCLOs } } });
      }
      if (maCDGs.length > 0) {
        await tx.cdgCoMapping.deleteMany({ where: { maCDG: { in: maCDGs } } });
      }

      // 3. Delete scores referencing CĐGs of this syllabus
      if (maCDGs.length > 0) {
        await tx.diemSo.deleteMany({ where: { maCDG: { in: maCDGs } } });
      }

      // 4. Delete CLO, CO, CachDanhGia
      await tx.cLO.deleteMany({ where: { maDeCuong } });
      await tx.cO.deleteMany({ where: { maDeCuong } });
      await tx.cachDanhGia.deleteMany({ where: { maDeCuong } });

      // 5. Unlink LopHocPhan (set maDeCuong to null instead of deleting)
      await tx.lopHocPhan.updateMany({
        where: { maDeCuong },
        data: { maDeCuong: null },
      });

      // 6. Delete the syllabus itself
      return tx.deCuongChiTiet.delete({ where: { maDeCuong } });
    });
  }

  // ─── CLO CRUD ─────────────────────────────────────────────

  async listCLOs(MSGV: string, maDeCuong: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    return this.prisma.cLO.findMany({
      where: { maDeCuong },
      orderBy: [{ code: "asc" }, { maCLO: "asc" }],
    });
  }

  async createCLO(MSGV: string, maDeCuong: string, dto: CreateCloDto) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    try {
      return await this.prisma.cLO.create({
        data: {
          maDeCuong,
          noiDungChuanDauRa: dto.noiDungChuanDauRa,
          code: dto.code,
        },
      });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2003"
      )
        throw new BadRequestException("Foreign key invalid");
      throw e;
    }
  }

  async updateCLO(
    MSGV: string,
    maDeCuong: string,
    maCLO: string,
    dto: UpdateCloDto,
  ) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    const clo = await this.prisma.cLO.findFirst({
      where: { maDeCuong, maCLO },
    });
    if (!clo) throw new NotFoundException("CLO not found");

    return this.prisma.cLO.update({
      where: { maCLO },
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
      },
    });
  }

  async deleteCLO(MSGV: string, maDeCuong: string, maCLO: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    const clo = await this.prisma.cLO.findFirst({
      where: { maDeCuong, maCLO },
    });
    if (!clo) throw new NotFoundException("CLO not found");

    try {
      return await this.prisma.cLO.delete({ where: { maCLO } });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2003"
      )
        throw new BadRequestException(
          "Cannot delete: CLO is referenced by other records",
        );
      throw e;
    }
  }

  // ─── CO CRUD ──────────────────────────────────────────────

  async listCOs(MSGV: string, maDeCuong: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    return this.prisma.cO.findMany({
      where: { maDeCuong },
      orderBy: [{ code: "asc" }, { maCO: "asc" }],
    });
  }

  async createCO(MSGV: string, maDeCuong: string, dto: CreateCoDto) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    try {
      return await this.prisma.cO.create({
        data: {
          maDeCuong,
          noiDungChuanDauRa: dto.noiDungChuanDauRa,
          code: dto.code,
        },
      });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2003"
      )
        throw new BadRequestException("Foreign key invalid");
      throw e;
    }
  }

  async updateCO(
    MSGV: string,
    maDeCuong: string,
    maCO: string,
    dto: UpdateCoDto,
  ) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    const co = await this.prisma.cO.findFirst({
      where: { maDeCuong, maCO },
    });
    if (!co) throw new NotFoundException("CO not found");

    return this.prisma.cO.update({
      where: { maCO },
      data: {
        noiDungChuanDauRa: dto.noiDungChuanDauRa,
        code: dto.code,
      },
    });
  }

  async deleteCO(MSGV: string, maDeCuong: string, maCO: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    const co = await this.prisma.cO.findFirst({
      where: { maDeCuong, maCO },
    });
    if (!co) throw new NotFoundException("CO not found");

    try {
      return await this.prisma.cO.delete({ where: { maCO } });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2003"
      )
        throw new BadRequestException(
          "Cannot delete: CO is referenced by other records",
        );
      throw e;
    }
  }

  // ─── Cach Danh Gia CRUD ───────────────────────────────────

  async listCachDanhGia(MSGV: string, maDeCuong: string) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    return this.prisma.cachDanhGia.findMany({
      where: { maDeCuong },
      orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }],
    });
  }

  async createCachDanhGia(
    MSGV: string,
    maDeCuong: string,
    dto: CreateCachDanhGiaDto,
  ) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    try {
      return await this.prisma.cachDanhGia.create({
        data: {
          maDeCuong,
          cachDanhGia: dto.cachDanhGia,
          tenThanhPhan: dto.tenThanhPhan,
          loai: dto.loai,
          trongSo: new Prisma.Decimal(dto.trongSo),
        },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new BadRequestException("Unique constraint failed");
        if (e.code === "P2003")
          throw new BadRequestException("Foreign key invalid");
      }
      throw e;
    }
  }

  async updateCachDanhGia(
    MSGV: string,
    maDeCuong: string,
    maCDG: string,
    dto: UpdateCachDanhGiaDto,
  ) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    const cdg = await this.prisma.cachDanhGia.findFirst({
      where: { maDeCuong, maCDG },
    });
    if (!cdg) throw new NotFoundException("CachDanhGia not found");

    try {
      return await this.prisma.cachDanhGia.update({
        where: { maCDG },
        data: {
          cachDanhGia: dto.cachDanhGia,
          tenThanhPhan: dto.tenThanhPhan,
          loai: dto.loai,
          ...(dto.trongSo != null
            ? { trongSo: new Prisma.Decimal(dto.trongSo) }
            : {}),
        },
      });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      )
        throw new BadRequestException("Unique constraint failed");
      throw e;
    }
  }

  async deleteCachDanhGia(
    MSGV: string,
    maDeCuong: string,
    maCDG: string,
  ) {
    await this.assertSyllabusOwnership(MSGV, maDeCuong);
    const cdg = await this.prisma.cachDanhGia.findFirst({
      where: { maDeCuong, maCDG },
    });
    if (!cdg) throw new NotFoundException("CachDanhGia not found");

    try {
      return await this.prisma.cachDanhGia.delete({ where: { maCDG } });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2003"
      )
        throw new BadRequestException(
          "Cannot delete: CachDanhGia is referenced by other records",
        );
      throw e;
    }
  }
}
