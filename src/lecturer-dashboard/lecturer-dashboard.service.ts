import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LecturerDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertClassOwnership(MSGV: string, maLopHocPhan: string) {
    const lop = await this.prisma.lopHocPhan.findUnique({
      where: { maLopHocPhan },
      select: {
        maLopHocPhan: true,
        MSGV: true,
        maHocPhan: true,
        maDeCuong: true,
        khoa: true,
        hocKy: true,
        hocPhan: { select: { tenHocPhan: true, soTinChi: true } },
        deCuong: { select: { maDeCuong: true, phienBan: true } },
        nienKhoa: { select: { khoa: true, namBatDau: true, namKetThuc: true } },
      },
    });

    if (!lop) throw new NotFoundException("LopHocPhan not found");
    if (lop.MSGV !== MSGV)
      throw new ForbiddenException("Bạn không phụ trách lớp học phần này");

    return lop;
  }

  /**
   * Tổng quan tất cả lớp của giảng viên: sĩ số, tiến độ nhập điểm, trạng thái OBE
   */
  async getOverview(MSGV: string, khoa?: number, hocKy?: number) {
    const classes = await this.prisma.lopHocPhan.findMany({
      where: {
        MSGV,
        ...(khoa != null ? { khoa } : {}),
        ...(hocKy != null ? { hocKy } : {}),
      },
      orderBy: [{ khoa: "desc" }, { hocKy: "asc" }, { maLopHocPhan: "asc" }],
      select: {
        maLopHocPhan: true,
        maHocPhan: true,
        maDeCuong: true,
        khoa: true,
        hocKy: true,
        status: true,
        hocPhan: { select: { tenHocPhan: true, soTinChi: true } },
        deCuong: { select: { phienBan: true, trangThai: true } },
        _count: { select: { dangKyHocPhans: true, diemSos: true } },
      },
    });

    const summaries = await Promise.all(
      classes.map(async (c) => {
        const enrolledCount = c._count.dangKyHocPhans;
        const scoresEntered = c._count.diemSos;

        let totalExpected = 0;
        if (c.maDeCuong) {
          const cdgCount = await this.prisma.cachDanhGia.count({
            where: { maDeCuong: c.maDeCuong },
          });
          totalExpected = enrolledCount * cdgCount;
        }

        return {
          maLopHocPhan: c.maLopHocPhan,
          maHocPhan: c.maHocPhan,
          tenHocPhan: c.hocPhan.tenHocPhan,
          soTinChi: c.hocPhan.soTinChi,
          khoa: c.khoa,
          hocKy: c.hocKy,
          status: c.status,
          deCuong: c.deCuong
            ? { phienBan: c.deCuong.phienBan, trangThai: c.deCuong.trangThai }
            : null,
          enrolledCount,
          scoresEntered,
          totalExpectedScores: totalExpected,
          scoreProgress:
            totalExpected > 0
              ? Number((scoresEntered / totalExpected).toFixed(4))
              : 0,
        };
      }),
    );

    const totalStudents = summaries.reduce((s, c) => s + c.enrolledCount, 0);
    const totalScores = summaries.reduce((s, c) => s + c.scoresEntered, 0);
    const totalExpected = summaries.reduce(
      (s, c) => s + c.totalExpectedScores,
      0,
    );

    return {
      totalClasses: summaries.length,
      totalStudents,
      totalScoresEntered: totalScores,
      totalExpectedScores: totalExpected,
      overallProgress:
        totalExpected > 0
          ? Number((totalScores / totalExpected).toFixed(4))
          : 0,
      classes: summaries,
    };
  }

  /**
   * Phân bố điểm theo từng cách đánh giá cho 1 lớp
   */
  async getScoreDistribution(MSGV: string, maLopHocPhan: string) {
    const lop = await this.assertClassOwnership(MSGV, maLopHocPhan);

    if (!lop.maDeCuong) {
      return { maLopHocPhan, distributions: [] };
    }

    const [cachDanhGias, diemSos] = await Promise.all([
      this.prisma.cachDanhGia.findMany({
        where: { maDeCuong: lop.maDeCuong! },
        orderBy: { tenThanhPhan: "asc" },
      }),
      this.prisma.diemSo.findMany({
        where: { maLopHocPhan },
        select: { maCDG: true, diem: true, tiLeHoanThanh: true },
      }),
    ]);

    const scoresByCdg = new Map<string, number[]>();
    for (const d of diemSos) {
      const list = scoresByCdg.get(d.maCDG) ?? [];
      list.push(Number(d.tiLeHoanThanh ?? 0));
      scoresByCdg.set(d.maCDG, list);
    }

    const distributions = cachDanhGias.map((cdg) => {
      const values = (scoresByCdg.get(cdg.maCDG) ?? []).sort((a, b) => a - b);
      const n = values.length;

      if (n === 0) {
        return {
          maCDG: cdg.maCDG,
          tenThanhPhan: cdg.tenThanhPhan,
          trongSo: Number(cdg.trongSo),
          count: 0,
          min: null,
          max: null,
          avg: null,
          median: null,
          stdDev: null,
        };
      }

      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / n;
      const median =
        n % 2 === 1
          ? values[Math.floor(n / 2)]
          : (values[n / 2 - 1] + values[n / 2]) / 2;
      const variance =
        values.reduce((s, v) => s + (v - avg) ** 2, 0) / n;

      return {
        maCDG: cdg.maCDG,
        tenThanhPhan: cdg.tenThanhPhan,
        trongSo: Number(cdg.trongSo),
        count: n,
        min: Number(values[0].toFixed(4)),
        max: Number(values[n - 1].toFixed(4)),
        avg: Number(avg.toFixed(4)),
        median: Number(median.toFixed(4)),
        stdDev: Number(Math.sqrt(variance).toFixed(4)),
      };
    });

    return { maLopHocPhan, distributions };
  }

  /**
   * Tóm tắt mức đạt CLO của 1 lớp: trung bình, tỉ lệ đạt
   */
  async getCloSummary(
    MSGV: string,
    maLopHocPhan: string,
    nguongDat?: number,
  ) {
    const lop = await this.assertClassOwnership(MSGV, maLopHocPhan);
    const threshold = nguongDat ?? 0.5;

    if (!lop.maDeCuong) {
      return { maLopHocPhan, threshold, clos: [] };
    }

    const [clos, ketQuaCLOs] = await Promise.all([
      this.prisma.cLO.findMany({
        where: { maDeCuong: lop.maDeCuong! },
        select: { maCLO: true, code: true, noiDungChuanDauRa: true },
        orderBy: { code: "asc" },
      }),
      this.prisma.ketQuaCLO.findMany({
        where: { maLopHocPhan },
        select: { maCLO: true, tiLeDat: true },
      }),
    ]);

    const resultMap = new Map<string, number[]>();
    for (const r of ketQuaCLOs) {
      const list = resultMap.get(r.maCLO) ?? [];
      list.push(Number(r.tiLeDat));
      resultMap.set(r.maCLO, list);
    }

    const cloSummaries = clos.map((clo) => {
      const values = resultMap.get(clo.maCLO) ?? [];
      const n = values.length;
      const avg = n > 0 ? values.reduce((a, b) => a + b, 0) / n : 0;
      const passed = values.filter((v) => v >= threshold).length;

      return {
        maCLO: clo.maCLO,
        code: clo.code,
        noiDung: clo.noiDungChuanDauRa,
        studentCount: n,
        avgTiLeDat: Number(avg.toFixed(4)),
        passCount: passed,
        passRate: n > 0 ? Number((passed / n).toFixed(4)) : 0,
      };
    });

    return { maLopHocPhan, threshold, clos: cloSummaries };
  }

  /**
   * Tóm tắt mức đạt CO của 1 lớp
   */
  async getCoSummary(
    MSGV: string,
    maLopHocPhan: string,
    nguongDat?: number,
  ) {
    const lop = await this.assertClassOwnership(MSGV, maLopHocPhan);
    const threshold = nguongDat ?? 0.5;

    if (!lop.maDeCuong) {
      return { maLopHocPhan, threshold, cos: [] };
    }

    const [cos, ketQuaCOs] = await Promise.all([
      this.prisma.cO.findMany({
        where: { maDeCuong: lop.maDeCuong! },
        select: { maCO: true, code: true, noiDungChuanDauRa: true },
        orderBy: { code: "asc" },
      }),
      this.prisma.ketQuaCO.findMany({
        where: { maLopHocPhan },
        select: { maCO: true, tiLeDat: true },
      }),
    ]);

    const resultMap = new Map<string, number[]>();
    for (const r of ketQuaCOs) {
      const list = resultMap.get(r.maCO) ?? [];
      list.push(Number(r.tiLeDat));
      resultMap.set(r.maCO, list);
    }

    const coSummaries = cos.map((co) => {
      const values = resultMap.get(co.maCO) ?? [];
      const n = values.length;
      const avg = n > 0 ? values.reduce((a, b) => a + b, 0) / n : 0;
      const passed = values.filter((v) => v >= threshold).length;

      return {
        maCO: co.maCO,
        code: co.code,
        noiDung: co.noiDungChuanDauRa,
        studentCount: n,
        avgTiLeDat: Number(avg.toFixed(4)),
        passCount: passed,
        passRate: n > 0 ? Number((passed / n).toFixed(4)) : 0,
      };
    });

    return { maLopHocPhan, threshold, cos: coSummaries };
  }

  /**
   * Chi tiết OBE từng sinh viên trong lớp: bảng CO + CLO
   */
  async getStudentObeDetails(MSGV: string, maLopHocPhan: string) {
    const lop = await this.assertClassOwnership(MSGV, maLopHocPhan);

    const [enrollments, ketQuaCOs, ketQuaCLOs] = await Promise.all([
      this.prisma.dangKyHocPhan.findMany({
        where: { maLopHocPhan },
        select: {
          maDangKy: true,
          MSSV: true,
          sinhVien: { select: { MSSV: true, hoTen: true } },
        },
        orderBy: { MSSV: "asc" },
      }),
      this.prisma.ketQuaCO.findMany({
        where: { maLopHocPhan },
        select: { MSSV: true, maCO: true, tiLeDat: true },
      }),
      this.prisma.ketQuaCLO.findMany({
        where: { maLopHocPhan },
        select: { MSSV: true, maCLO: true, tiLeDat: true },
      }),
    ]);

    const coByStudent = new Map<string, Array<{ maCO: string; tiLeDat: number }>>();
    for (const r of ketQuaCOs) {
      const list = coByStudent.get(r.MSSV) ?? [];
      list.push({ maCO: r.maCO, tiLeDat: Number(r.tiLeDat) });
      coByStudent.set(r.MSSV, list);
    }

    const cloByStudent = new Map<string, Array<{ maCLO: string; tiLeDat: number }>>();
    for (const r of ketQuaCLOs) {
      const list = cloByStudent.get(r.MSSV) ?? [];
      list.push({ maCLO: r.maCLO, tiLeDat: Number(r.tiLeDat) });
      cloByStudent.set(r.MSSV, list);
    }

    const students = enrollments.map((e) => {
      const cos = coByStudent.get(e.MSSV) ?? [];
      const clos = cloByStudent.get(e.MSSV) ?? [];

      const avgCO =
        cos.length > 0
          ? cos.reduce((s, c) => s + c.tiLeDat, 0) / cos.length
          : 0;
      const avgCLO =
        clos.length > 0
          ? clos.reduce((s, c) => s + c.tiLeDat, 0) / clos.length
          : 0;

      return {
        MSSV: e.MSSV,
        hoTen: e.sinhVien.hoTen,
        maDangKy: e.maDangKy,
        coResults: cos.sort((a, b) => a.maCO.localeCompare(b.maCO)),
        cloResults: clos.sort((a, b) => a.maCLO.localeCompare(b.maCLO)),
        avgCO: Number(avgCO.toFixed(4)),
        avgCLO: Number(avgCLO.toFixed(4)),
      };
    });

    return {
      maLopHocPhan,
      maHocPhan: lop.maHocPhan,
      tenHocPhan: lop.hocPhan.tenHocPhan,
      students,
    };
  }

  /**
   * Sinh viên có nguy cơ không đạt trong lớp (CO hoặc CLO dưới ngưỡng)
   */
  async getAtRiskStudents(
    MSGV: string,
    maLopHocPhan: string,
    nguongDat?: number,
  ) {
    const lop = await this.assertClassOwnership(MSGV, maLopHocPhan);
    const threshold = nguongDat ?? 0.5;

    const [enrollments, ketQuaCOs, ketQuaCLOs] = await Promise.all([
      this.prisma.dangKyHocPhan.findMany({
        where: { maLopHocPhan },
        select: {
          MSSV: true,
          sinhVien: { select: { MSSV: true, hoTen: true, email: true } },
        },
      }),
      this.prisma.ketQuaCO.findMany({
        where: { maLopHocPhan },
        select: { MSSV: true, maCO: true, tiLeDat: true },
      }),
      this.prisma.ketQuaCLO.findMany({
        where: { maLopHocPhan },
        select: { MSSV: true, maCLO: true, tiLeDat: true },
      }),
    ]);

    const coMap = new Map<string, Array<{ maCO: string; tiLeDat: number }>>();
    for (const r of ketQuaCOs) {
      const list = coMap.get(r.MSSV) ?? [];
      list.push({ maCO: r.maCO, tiLeDat: Number(r.tiLeDat) });
      coMap.set(r.MSSV, list);
    }

    const cloMap = new Map<string, Array<{ maCLO: string; tiLeDat: number }>>();
    for (const r of ketQuaCLOs) {
      const list = cloMap.get(r.MSSV) ?? [];
      list.push({ maCLO: r.maCLO, tiLeDat: Number(r.tiLeDat) });
      cloMap.set(r.MSSV, list);
    }

    const atRisk = enrollments
      .map((e) => {
        const cos = coMap.get(e.MSSV) ?? [];
        const clos = cloMap.get(e.MSSV) ?? [];

        const failedCOs = cos.filter((c) => c.tiLeDat < threshold);
        const failedCLOs = clos.filter((c) => c.tiLeDat < threshold);

        if (failedCOs.length === 0 && failedCLOs.length === 0) return null;

        const avgCO =
          cos.length > 0
            ? cos.reduce((s, c) => s + c.tiLeDat, 0) / cos.length
            : 0;

        return {
          MSSV: e.MSSV,
          hoTen: e.sinhVien.hoTen,
          email: e.sinhVien.email,
          avgCO: Number(avgCO.toFixed(4)),
          failedCOCount: failedCOs.length,
          failedCLOCount: failedCLOs.length,
          failedCOs: failedCOs.map((c) => c.maCO),
          failedCLOs: failedCLOs.map((c) => c.maCLO),
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          (b!.failedCLOCount + b!.failedCOCount) -
          (a!.failedCLOCount + a!.failedCOCount),
      );

    return {
      maLopHocPhan,
      threshold,
      totalEnrolled: enrollments.length,
      atRiskCount: atRisk.length,
      students: atRisk,
    };
  }

  /**
   * Bảng điểm tổng hợp theo từng sinh viên + từng cách đánh giá (score matrix)
   */
  async getScoreMatrix(MSGV: string, maLopHocPhan: string) {
    const lop = await this.assertClassOwnership(MSGV, maLopHocPhan);

    const cachDanhGias = lop.maDeCuong
      ? await this.prisma.cachDanhGia.findMany({
          where: { maDeCuong: lop.maDeCuong! },
          orderBy: { tenThanhPhan: "asc" },
          select: { maCDG: true, tenThanhPhan: true, trongSo: true },
        })
      : [];

    const [enrollments, diemSos] = await Promise.all([
      this.prisma.dangKyHocPhan.findMany({
        where: { maLopHocPhan },
        select: {
          maDangKy: true,
          MSSV: true,
          sinhVien: { select: { hoTen: true } },
        },
        orderBy: { MSSV: "asc" },
      }),
      this.prisma.diemSo.findMany({
        where: { maLopHocPhan },
        select: { MSSV: true, maCDG: true, diem: true, tiLeHoanThanh: true },
      }),
    ]);

    const scoreMap = new Map<string, Map<string, { diem: number; tiLeHoanThanh: number }>>();
    for (const d of diemSos) {
      if (!scoreMap.has(d.MSSV)) scoreMap.set(d.MSSV, new Map());
      scoreMap.get(d.MSSV)!.set(d.maCDG, {
        diem: Number(d.diem),
        tiLeHoanThanh: Number(d.tiLeHoanThanh ?? 0),
      });
    }

    const rows = enrollments.map((e) => {
      const studentScores = scoreMap.get(e.MSSV) ?? new Map();
      const scores = cachDanhGias.map((cdg) => {
        const s = studentScores.get(cdg.maCDG);
        return {
          maCDG: cdg.maCDG,
          diem: s?.diem ?? null,
          tiLeHoanThanh: s?.tiLeHoanThanh ?? null,
        };
      });

      const enteredScores = scores.filter((s) => s.diem !== null);
      const totalWeighted = enteredScores.reduce(
        (sum, s) => sum + (s.diem ?? 0),
        0,
      );

      return {
        MSSV: e.MSSV,
        hoTen: e.sinhVien.hoTen,
        maDangKy: e.maDangKy,
        scores,
        tongDiem: Number(totalWeighted.toFixed(2)),
        completedCount: enteredScores.length,
        totalCount: cachDanhGias.length,
      };
    });

    return {
      maLopHocPhan,
      columns: cachDanhGias.map((c) => ({
        maCDG: c.maCDG,
        tenThanhPhan: c.tenThanhPhan,
        trongSo: Number(c.trongSo),
      })),
      rows,
    };
  }
}
