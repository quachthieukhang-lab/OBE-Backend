import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminObeDashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getOverview(params: {
    maDonVi?: string;
    khoa?: number;
    hocKy?: number;
  }) {
    const { maDonVi, khoa, hocKy } = params;

    if (!maDonVi) {
      throw new NotFoundException("maDonVi is required");
    }

    const cauHinh = await this.prisma.cauHinhOBE.findFirst({
      where: {
        maDonVi,
        ...(khoa !== undefined ? { khoa } : {}),
      },
      include: {
        nienKhoa: true,
        donVi: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!cauHinh) {
      throw new NotFoundException("CauHinhOBE not found");
    }

    const [ploRadar, bottleneckCourses, atRiskStudents] = await Promise.all([
      this.getPloRadar({
        maDonVi,
        khoa: cauHinh.khoa,
        nguongDatCaNhan: Number(cauHinh.nguongDatCaNhan),
      }),
      this.getBottleneckCourses({
        maDonVi,
        khoa: cauHinh.khoa,
        hocKy,
        nguongDatCaNhan: Number(cauHinh.nguongDatCaNhan),
      }),
      this.getAtRiskStudents({
        maDonVi,
        khoa: cauHinh.khoa,
        nguongDatCaNhan: Number(cauHinh.nguongDatCaNhan),
      }),
    ]);

    return {
      config: {
        maDonVi: cauHinh.maDonVi,
        tenDonVi: cauHinh.donVi.tenDonVi,
        khoa: cauHinh.khoa,
        namBatDau: cauHinh.nienKhoa.namBatDau,
        namKetThuc: cauHinh.nienKhoa.namKetThuc,
        nguongDatCaNhan: Number(cauHinh.nguongDatCaNhan),
        kpiLopHoc: Number(cauHinh.kpiLopHoc),
      },
      ploRadar,
      bottleneckCourses,
      atRiskStudents,
    };
  }

  private async getPloRadar(params: {
    maDonVi: string;
    khoa: number;
    nguongDatCaNhan: number;
  }) {
    const { maDonVi, khoa, nguongDatCaNhan } = params;

    const rows = await this.prisma.ketQuaPLO.findMany({
      where: {
        sinhVien: {
          maDonVi,
          khoa,
        },
      },
      select: {
        maPLO: true,
        tiLeDat: true,
        plo: {
          select: {
            maPLO: true,
            code: true,
            noiDungChuanDauRa: true,
          },
        },
      },
    });

    const grouped = new Map<
      string,
      {
        maPLO: string;
        label: string;
        noiDung: string;
        values: number[];
        passed: number;
        total: number;
      }
    >();

    for (const row of rows) {
      const score = Number(row.tiLeDat);

      const current = grouped.get(row.maPLO) ?? {
        maPLO: row.maPLO,
        label: row.plo.code ?? row.maPLO,
        noiDung: row.plo.noiDungChuanDauRa,
        values: [],
        passed: 0,
        total: 0,
      };

      current.values.push(score);
      current.total += 1;
      if (score >= nguongDatCaNhan) {
        current.passed += 1;
      }

      grouped.set(row.maPLO, current);
    }

    return Array.from(grouped.values())
      .map((item) => {
        const avg =
          item.values.length > 0
            ? item.values.reduce((a, b) => a + b, 0) / item.values.length
            : 0;

        const passRate = item.total > 0 ? item.passed / item.total : 0;

        return {
          maPLO: item.maPLO,
          label: item.label,
          noiDung: item.noiDung,
          avgTiLeDat: Number(avg.toFixed(4)),
          avgDiemHe10: Number((avg * 10).toFixed(2)),
          passRate: Number(passRate.toFixed(4)),
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private async getBottleneckCourses(params: {
    maDonVi: string;
    khoa: number;
    hocKy?: number;
    nguongDatCaNhan: number;
  }) {
    const { maDonVi, khoa, hocKy, nguongDatCaNhan } = params;

    const rows = await this.prisma.ketQuaCLO.findMany({
      where: {
        sinhVien: {
          maDonVi,
          khoa,
        },
        ...(hocKy !== undefined
          ? {
            lopHocPhan: {
              hocKy,
            },
          }
          : {}),
      },
      select: {
        maCLO: true,
        maLopHocPhan: true,
        tiLeDat: true,
        clo: {
          select: {
            maCLO: true,
            maHocPhan: true,
            code: true,
            hocPhan: {
              select: {
                maHocPhan: true,
                tenHocPhan: true,
              },
            },
          },
        },
        lopHocPhan: {
          select: {
            maLopHocPhan: true,
            hocKy: true,
          },
        },
      },
    });

    const courseMap = new Map<
      string,
      {
        maHocPhan: string;
        tenHocPhan: string;
        classes: Set<string>;
        cloStats: Map<string, { total: number; passed: number }>;
      }
    >();

    for (const row of rows) {
      const maHocPhan = row.clo.maHocPhan;
      const tenHocPhan = row.clo.hocPhan.tenHocPhan;

      if (!courseMap.has(maHocPhan)) {
        courseMap.set(maHocPhan, {
          maHocPhan,
          tenHocPhan,
          classes: new Set(),
          cloStats: new Map(),
        });
      }

      const course = courseMap.get(maHocPhan)!;
      course.classes.add(row.maLopHocPhan);

      const stat = course.cloStats.get(row.maCLO) ?? { total: 0, passed: 0 };
      stat.total += 1;
      if (Number(row.tiLeDat) >= nguongDatCaNhan) {
        stat.passed += 1;
      }
      course.cloStats.set(row.maCLO, stat);
    }

    return Array.from(courseMap.values())
      .map((course) => {
        const cloRates = Array.from(course.cloStats.values()).map((x) =>
          x.total > 0 ? x.passed / x.total : 0,
        );

        const avgCloPassRate =
          cloRates.length > 0
            ? cloRates.reduce((a, b) => a + b, 0) / cloRates.length
            : 0;

        const minCloPassRate =
          cloRates.length > 0 ? Math.min(...cloRates) : 0;

        return {
          maHocPhan: course.maHocPhan,
          tenHocPhan: course.tenHocPhan,
          avgCloPassRate: Number(avgCloPassRate.toFixed(4)),
          minCloPassRate: Number(minCloPassRate.toFixed(4)),
          affectedClasses: course.classes.size,
        };
      })
      .sort((a, b) => a.avgCloPassRate - b.avgCloPassRate)
      .slice(0, 10);
  }

  private async getAtRiskStudents(params: {
    maDonVi: string;
    khoa: number;
    nguongDatCaNhan: number;
  }) {
    const { maDonVi, khoa, nguongDatCaNhan } = params;

    const nienKhoa = await this.prisma.nienKhoa.findUnique({
      where: { khoa },
      select: {
        khoa: true,
        namBatDau: true,
        namKetThuc: true,
      },
    });

    if (!nienKhoa) {
      throw new NotFoundException("NienKhoa not found");
    }

    const currentYear = new Date().getFullYear();
    const currentStudyYear = currentYear - nienKhoa.namBatDau + 1;

    const rows = await this.prisma.ketQuaPLO.findMany({
      where: {
        sinhVien: {
          maDonVi,
          khoa,
        },
      },
      select: {
        MSSV: true,
        maPLO: true,
        tiLeDat: true,
        sinhVien: {
          select: {
            MSSV: true,
            hoTen: true,
            khoa: true,
            maDonVi: true,
          },
        },
      },
    });

    const studentMap = new Map<
      string,
      {
        MSSV: string;
        hoTen: string;
        khoa: number | null;
        total: number;
        sum: number;
        belowCount: number;
      }
    >();

    for (const row of rows) {
      const key = row.MSSV;

      if (!studentMap.has(key)) {
        studentMap.set(key, {
          MSSV: row.sinhVien.MSSV,
          hoTen: row.sinhVien.hoTen,
          khoa: row.sinhVien.khoa ?? null,
          total: 0,
          sum: 0,
          belowCount: 0,
        });
      }

      const item = studentMap.get(key)!;
      const score = Number(row.tiLeDat);

      item.total += 1;
      item.sum += score;
      if (score < nguongDatCaNhan) {
        item.belowCount += 1;
      }
    }

    return Array.from(studentMap.values())
      .map((student) => {
        const avg = student.total > 0 ? student.sum / student.total : 0;
        return {
          MSSV: student.MSSV,
          hoTen: student.hoTen,
          khoa: student.khoa,
          namHocHienTai: currentStudyYear,
          avgPlo: Number(avg.toFixed(4)),
          avgDiemHe10: Number((avg * 10).toFixed(2)),
          ploBelowThresholdCount: student.belowCount,
        };
      })
      .filter(
        (student) =>
          student.namHocHienTai >= 3 && student.avgPlo < nguongDatCaNhan,
      )
      .sort((a, b) => a.avgPlo - b.avgPlo)
      .slice(0, 20);
  }
}