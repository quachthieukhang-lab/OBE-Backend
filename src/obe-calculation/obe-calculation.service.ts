import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

type DecimalLike = Prisma.Decimal | number | string;
type RetakeStrategy = "MAX" | "LATEST" | "AVERAGE";

@Injectable()
export class ObeCalculationService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly retakeStrategy: RetakeStrategy = "MAX";
  private readonly includeCreditsInPlo = true;

  private toDecimal(value: DecimalLike) {
    return new Prisma.Decimal(value);
  }

  private zero() {
    return new Prisma.Decimal(0);
  }

  private one() {
    return new Prisma.Decimal(1);
  }

  private clamp01(value: Prisma.Decimal) {
    if (value.lessThan(0)) return this.zero();
    if (value.greaterThan(1)) return this.one();
    return value;
  }

  private divideSafe(numerator: Prisma.Decimal, denominator: Prisma.Decimal) {
    if (denominator.equals(0)) return this.zero();
    return this.clamp01(numerator.div(denominator)).toDecimalPlaces(4);
  }

  private async getEnrollmentOrThrow(maDangKy: string) {
    const enrollment = await this.prisma.dangKyHocPhan.findUnique({
      where: { maDangKy },
      select: {
        maDangKy: true,
        MSSV: true,
        maLopHocPhan: true,
        lopHocPhan: {
          select: {
            maLopHocPhan: true,
            maHocPhan: true,
            maDeCuong: true,
            khoa: true,
            hocKy: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException("DangKyHocPhan not found");
    }

    if (!enrollment.lopHocPhan.maDeCuong) {
      throw new NotFoundException(
        "LopHocPhan chưa gắn đề cương chi tiết (maDeCuong). Không thể tính OBE.",
      );
    }

    return enrollment;
  }

  private calculateWeightedAverage(
    items: Array<{ value: Prisma.Decimal; weight: Prisma.Decimal }>,
  ) {
    let numerator = this.zero();
    let denominator = this.zero();

    for (const item of items) {
      if (item.weight.lessThanOrEqualTo(0)) continue;

      numerator = numerator.plus(item.value.mul(item.weight));
      denominator = denominator.plus(item.weight);
    }

    return this.divideSafe(numerator, denominator);
  }

  private aggregateRetakeResults(
    rows: Array<{
      maCLO: string;
      tiLeDat: Prisma.Decimal;
      updatedAt: Date;
      createdAt: Date;
    }>,
  ) {
    const grouped = new Map<
      string,
      Array<{
        tiLeDat: Prisma.Decimal;
        updatedAt: Date;
        createdAt: Date;
      }>
    >();

    for (const row of rows) {
      const list = grouped.get(row.maCLO) ?? [];
      list.push({
        tiLeDat: this.toDecimal(row.tiLeDat),
        updatedAt: row.updatedAt,
        createdAt: row.createdAt,
      });
      grouped.set(row.maCLO, list);
    }

    const result = new Map<string, Prisma.Decimal>();

    for (const [maCLO, values] of grouped.entries()) {
      if (this.retakeStrategy === "MAX") {
        let best = this.zero();
        for (const item of values) {
          if (item.tiLeDat.greaterThan(best)) {
            best = item.tiLeDat;
          }
        }
        result.set(maCLO, best.toDecimalPlaces(4));
        continue;
      }

      if (this.retakeStrategy === "LATEST") {
        const latest = [...values].sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
        )[0];
        result.set(maCLO, latest.tiLeDat.toDecimalPlaces(4));
        continue;
      }

      let sum = this.zero();
      for (const item of values) {
        sum = sum.plus(item.tiLeDat);
      }
      result.set(maCLO, this.divideSafe(sum, this.toDecimal(values.length)));
    }

    return result;
  }

  async recalculateObeResultsForEnrollment(maDangKy: string) {
    const enrollment = await this.getEnrollmentOrThrow(maDangKy);
    const MSSV = enrollment.MSSV;
    const maLopHocPhan = enrollment.maLopHocPhan;
    const maDeCuong = enrollment.lopHocPhan.maDeCuong!;

    const sinhVien = await this.prisma.sinhVien.findUnique({
      where: { MSSV },
      select: { maSoNganh: true, khoa: true },
    });

    await this.prisma.$transaction(async (tx) => {
      await this.recalculateCO(tx, {
        maDangKy,
        MSSV,
        maLopHocPhan,
        maDeCuong,
      });

      await this.recalculateCLO(tx, {
        MSSV,
        maLopHocPhan,
        maDeCuong,
      });

      await this.recalculatePLO(tx, {
        MSSV,
        maSoNganh: sinhVien?.maSoNganh ?? null,
        khoa: sinhVien?.khoa ?? null,
      });
    });

    return {
      success: true,
      maDangKy,
      MSSV,
      maLopHocPhan,
      maDeCuong,
      retakeStrategy: this.retakeStrategy,
      includeCreditsInPlo: this.includeCreditsInPlo,
    };
  }

  /**
   * CDG -> CO (scoped to the syllabus version via maDeCuong)
   */
  private async recalculateCO(
    tx: Prisma.TransactionClient,
    input: {
      maDangKy: string;
      MSSV: string;
      maLopHocPhan: string;
      maDeCuong: string;
    },
  ) {
    const { maDangKy, MSSV, maLopHocPhan, maDeCuong } = input;

    const [scores, mappings, cos] = await Promise.all([
      tx.diemSo.findMany({
        where: { maDangKy },
        select: {
          maCDG: true,
          tiLeHoanThanh: true,
        },
      }),
      tx.cdgCoMapping.findMany({
        where: {
          cdg: { maDeCuong },
        },
        select: {
          maCDG: true,
          maCO: true,
          trongSo: true,
        },
      }),
      tx.cO.findMany({
        where: { maDeCuong },
        select: {
          maCO: true,
        },
      }),
    ]);

    const scoreMap = new Map(
      scores.map((s) => [s.maCDG, this.toDecimal(s.tiLeHoanThanh ?? 0)]),
    );

    const results: Array<{
      maCO: string;
      tiLeDat: Prisma.Decimal;
    }> = [];

    for (const co of cos) {
      const relatedMappings = mappings.filter((m) => m.maCO === co.maCO);

      const weightedItems = relatedMappings.map((mapping) => ({
        value: scoreMap.get(mapping.maCDG) ?? this.zero(),
        weight: this.toDecimal(mapping.trongSo),
      }));

      const tiLeDat = this.calculateWeightedAverage(weightedItems);

      results.push({
        maCO: co.maCO,
        tiLeDat,
      });
    }

    for (const item of results) {
      await tx.ketQuaCO.upsert({
        where: {
          MSSV_maCO_maLopHocPhan: {
            MSSV,
            maCO: item.maCO,
            maLopHocPhan,
          },
        },
        create: {
          MSSV,
          maCO: item.maCO,
          maLopHocPhan,
          tiLeDat: item.tiLeDat,
        },
        update: {
          tiLeDat: item.tiLeDat,
        },
      });
    }
  }

  /**
   * CO -> CLO (scoped to the syllabus version via maDeCuong)
   */
  private async recalculateCLO(
    tx: Prisma.TransactionClient,
    input: {
      MSSV: string;
      maLopHocPhan: string;
      maDeCuong: string;
    },
  ) {
    const { MSSV, maLopHocPhan, maDeCuong } = input;

    const [ketQuaCOs, mappings, clos] = await Promise.all([
      tx.ketQuaCO.findMany({
        where: {
          MSSV,
          maLopHocPhan,
          co: { maDeCuong },
        },
        select: {
          maCO: true,
          tiLeDat: true,
        },
      }),
      tx.cloCoMapping.findMany({
        where: {
          clo: { maDeCuong },
        },
        select: {
          maCLO: true,
          maCO: true,
          trongSo: true,
        },
      }),
      tx.cLO.findMany({
        where: { maDeCuong },
        select: {
          maCLO: true,
        },
      }),
    ]);

    const coResultMap = new Map(
      ketQuaCOs.map((x) => [x.maCO, this.toDecimal(x.tiLeDat)]),
    );

    const results: Array<{
      maCLO: string;
      tiLeDat: Prisma.Decimal;
    }> = [];

    for (const clo of clos) {
      const relatedMappings = mappings.filter((m) => m.maCLO === clo.maCLO);

      const weightedItems = relatedMappings.map((mapping) => ({
        value: coResultMap.get(mapping.maCO) ?? this.zero(),
        weight: this.toDecimal(mapping.trongSo),
      }));

      const tiLeDat = this.calculateWeightedAverage(weightedItems);

      results.push({
        maCLO: clo.maCLO,
        tiLeDat,
      });
    }

    for (const item of results) {
      await tx.ketQuaCLO.upsert({
        where: {
          MSSV_maCLO_maLopHocPhan: {
            MSSV,
            maCLO: item.maCLO,
            maLopHocPhan,
          },
        },
        create: {
          MSSV,
          maCLO: item.maCLO,
          maLopHocPhan,
          tiLeDat: item.tiLeDat,
        },
        update: {
          tiLeDat: item.tiLeDat,
        },
      });
    }
  }

  /**
   * CLO -> PLO (aggregated across all CLOs the student has, filtered to CTDT's PLOs)
   */
  private async recalculatePLO(
    tx: Prisma.TransactionClient,
    input: {
      MSSV: string;
      maSoNganh: string | null;
      khoa: number | null;
    },
  ) {
    const { MSSV, maSoNganh, khoa } = input;

    if (maSoNganh == null || khoa == null) {
      return;
    }

    const plos = await tx.pLO.findMany({
      where: { maSoNganh, khoa },
      select: { maPLO: true },
    });

    if (plos.length === 0) return;

    const allowedPloIds = plos.map((p) => p.maPLO);

    const [ketQuaCLOs, mappings] = await Promise.all([
      tx.ketQuaCLO.findMany({
        where: { MSSV },
        select: {
          maCLO: true,
          tiLeDat: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      tx.cloPloMapping.findMany({
        where: {
          maPLO: { in: allowedPloIds },
        },
        select: {
          maCLO: true,
          maPLO: true,
          trongSo: true,
          clo: {
            select: {
              deCuong: {
                select: {
                  hocPhan: {
                    select: { soTinChi: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const cloAggregatedMap = this.aggregateRetakeResults(
      ketQuaCLOs.map((item) => ({
        maCLO: item.maCLO,
        tiLeDat: this.toDecimal(item.tiLeDat),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    );

    const results: Array<{
      maPLO: string;
      tiLeDat: Prisma.Decimal;
    }> = [];

    for (const plo of plos) {
      const relatedMappings = mappings.filter((m) => m.maPLO === plo.maPLO);

      let hasAttemptedAnyCLO = false;

      const weightedItems = relatedMappings.map((mapping) => {
        const mappingWeight = this.toDecimal(mapping.trongSo);

        let cloCompletion = this.zero();

        if (cloAggregatedMap.has(mapping.maCLO)) {
          cloCompletion = cloAggregatedMap.get(mapping.maCLO) ?? this.zero();
          hasAttemptedAnyCLO = true;
        }

        const tinChi = this.toDecimal(mapping.clo.deCuong.hocPhan.soTinChi ?? 0);
        const effectiveWeight = this.includeCreditsInPlo
          ? mappingWeight.mul(tinChi)
          : mappingWeight;

        return {
          value: cloCompletion,
          weight: effectiveWeight,
        };
      });

      if (!hasAttemptedAnyCLO) {
        continue;
      }

      const tiLeDat = this.calculateWeightedAverage(weightedItems);

      results.push({
        maPLO: plo.maPLO,
        tiLeDat,
      });
    }

    for (const item of results) {
      await tx.ketQuaPLO.upsert({
        where: {
          MSSV_maPLO: {
            MSSV,
            maPLO: item.maPLO,
          },
        },
        create: {
          MSSV,
          maPLO: item.maPLO,
          tiLeDat: item.tiLeDat,
        },
        update: {
          tiLeDat: item.tiLeDat,
        },
      });
    }
  }
}
