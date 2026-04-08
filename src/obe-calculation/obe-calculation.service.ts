import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

type DecimalLike = Prisma.Decimal | number | string;

@Injectable()
export class ObeCalculationService {
  constructor(private readonly prisma: PrismaService) {}

  private toDecimal(value: DecimalLike) {
    return new Prisma.Decimal(value);
  }

  private zero() {
    return new Prisma.Decimal(0);
  }

  private divideSafe(numerator: Prisma.Decimal, denominator: Prisma.Decimal) {
    if (denominator.equals(0)) return this.zero();
    return numerator.div(denominator).toDecimalPlaces(4);
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
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException("DangKyHocPhan not found");
    }

    return enrollment;
  }

  /**
   * Recalculate toàn bộ kết quả OBE cho 1 đăng ký học phần
   */
  async recalculateObeResultsForEnrollment(maDangKy: string) {
    const enrollment = await this.getEnrollmentOrThrow(maDangKy);
    const MSSV = enrollment.MSSV;
    const maLopHocPhan = enrollment.maLopHocPhan;
    const maHocPhan = enrollment.lopHocPhan.maHocPhan;

    await this.prisma.$transaction(async (tx) => {
      await this.recalculateCO(tx, {
        maDangKy,
        MSSV,
        maLopHocPhan,
        maHocPhan,
      });

      await this.recalculateCLO(tx, {
        MSSV,
        maLopHocPhan,
        maHocPhan,
      });

      await this.recalculatePLO(tx, {
        MSSV,
      });
    });

    return {
      success: true,
      maDangKy,
      MSSV,
      maLopHocPhan,
      maHocPhan,
    };
  }

  /**
   * 1) CDG -> CO
   * KetQuaCO theo từng sinh viên, từng lớp
   */
  private async recalculateCO(
    tx: Prisma.TransactionClient,
    input: {
      maDangKy: string;
      MSSV: string;
      maLopHocPhan: string;
      maHocPhan: string;
    }
  ) {
    const { maDangKy, MSSV, maLopHocPhan, maHocPhan } = input;

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
          cdg: {
            maHocPhan,
          },
        },
        select: {
          maCDG: true,
          maCO: true,
          trongSo: true,
        },
      }),
      tx.cO.findMany({
        where: { maHocPhan },
        select: {
          maCO: true,
        },
      }),
    ]);

    const scoreMap = new Map(
      scores.map((s) => [s.maCDG, this.toDecimal(s.tiLeHoanThanh ?? 0)])
    );

    const results: Array<{
      maCO: string;
      tiLeDat: Prisma.Decimal;
    }> = [];

    for (const co of cos) {
      const relatedMappings = mappings.filter((m) => m.maCO === co.maCO);

      let numerator = this.zero();
      let denominator = this.zero();

      for (const mapping of relatedMappings) {
        const weight = this.toDecimal(mapping.trongSo);
        const completion = scoreMap.get(mapping.maCDG) ?? this.zero();

        numerator = numerator.plus(completion.mul(weight));
        denominator = denominator.plus(weight);
      }

      const tiLeDat = this.divideSafe(numerator, denominator);
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
   * 2) CO -> CLO
   * KetQuaCLO theo từng sinh viên, từng lớp
   */
  private async recalculateCLO(
    tx: Prisma.TransactionClient,
    input: {
      MSSV: string;
      maLopHocPhan: string;
      maHocPhan: string;
    }
  ) {
    const { MSSV, maLopHocPhan, maHocPhan } = input;

    const [ketQuaCOs, mappings, clos] = await Promise.all([
      tx.ketQuaCO.findMany({
        where: {
          MSSV,
          maLopHocPhan,
          co: {
            maHocPhan,
          },
        },
        select: {
          maCO: true,
          tiLeDat: true,
        },
      }),
      tx.cloCoMapping.findMany({
        where: {
          clo: {
            maHocPhan,
          },
        },
        select: {
          maCLO: true,
          maCO: true,
          trongSo: true,
        },
      }),
      tx.cLO.findMany({
        where: { maHocPhan },
        select: {
          maCLO: true,
        },
      }),
    ]);

    const coResultMap = new Map(
      ketQuaCOs.map((x) => [x.maCO, this.toDecimal(x.tiLeDat)])
    );

    const results: Array<{
      maCLO: string;
      tiLeDat: Prisma.Decimal;
    }> = [];

    for (const clo of clos) {
      const relatedMappings = mappings.filter((m) => m.maCLO === clo.maCLO);

      let numerator = this.zero();
      let denominator = this.zero();

      for (const mapping of relatedMappings) {
        const weight = this.toDecimal(mapping.trongSo);
        const coCompletion = coResultMap.get(mapping.maCO) ?? this.zero();

        numerator = numerator.plus(coCompletion.mul(weight));
        denominator = denominator.plus(weight);
      }

      const tiLeDat = this.divideSafe(numerator, denominator);

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
   * 3) CLO -> PLO
   * KetQuaPLO là kết quả tích lũy cuối của sinh viên
   */
  private async recalculatePLO(
    tx: Prisma.TransactionClient,
    input: {
      MSSV: string;
    }
  ) {
    const { MSSV } = input;

    const [ketQuaCLOs, mappings, plos] = await Promise.all([
      tx.ketQuaCLO.findMany({
        where: { MSSV },
        select: {
          maCLO: true,
          tiLeDat: true,
        },
      }),
      tx.cloPloMapping.findMany({
        select: {
          maCLO: true,
          maPLO: true,
          trongSo: true,
        },
      }),
      tx.pLO.findMany({
        select: {
          maPLO: true,
        },
      }),
    ]);

    const cloResultsGrouped = new Map<string, Prisma.Decimal[]>();
    for (const item of ketQuaCLOs) {
      const list = cloResultsGrouped.get(item.maCLO) ?? [];
      list.push(this.toDecimal(item.tiLeDat));
      cloResultsGrouped.set(item.maCLO, list);
    }

    // Nếu 1 CLO xuất hiện nhiều lớp, lấy trung bình các lần đạt
    const cloAverageMap = new Map<string, Prisma.Decimal>();
    for (const [maCLO, values] of cloResultsGrouped.entries()) {
      let sum = this.zero();
      for (const v of values) sum = sum.plus(v);
      cloAverageMap.set(maCLO, this.divideSafe(sum, this.toDecimal(values.length)));
    }

    const results: Array<{
      maPLO: string;
      tiLeDat: Prisma.Decimal;
    }> = [];

    for (const plo of plos) {
      const relatedMappings = mappings.filter((m) => m.maPLO === plo.maPLO);

      let numerator = this.zero();
      let denominator = this.zero();

      for (const mapping of relatedMappings) {
        const weight = this.toDecimal(mapping.trongSo);
        const cloCompletion = cloAverageMap.get(mapping.maCLO) ?? this.zero();

        numerator = numerator.plus(cloCompletion.mul(weight));
        denominator = denominator.plus(weight);
      }

      const tiLeDat = this.divideSafe(numerator, denominator);

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