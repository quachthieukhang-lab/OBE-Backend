import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCloPloMappingDto } from "./dto/create-clo-plo-mapping.dto";
import { UpdateCloPloMappingDto } from "./dto/update-clo-plo-mapping.dto";

export type CloPloCohortScope = { maSoNganh: string; khoa: number };

@Injectable()
export class CloPloMappingService {
  constructor(private readonly prisma: PrismaService) {}

  private key(maPLO: string, maCLO: string) {
    return { maPLO_maCLO: { maPLO, maCLO } } as const;
  }

  private parseOptionalCohortScope(scope?: Partial<CloPloCohortScope>): CloPloCohortScope | undefined {
    const ma = scope?.maSoNganh?.trim();
    const khoa = scope?.khoa;
    const hasMa = ma != null && ma !== "";
    const hasKhoa = khoa != null && Number.isInteger(khoa);
    if (hasMa !== hasKhoa) {
      throw new BadRequestException("Query maSoNganh và khoa phải gửi kèm nhau khi chỉ định phiên bản CTĐT");
    }
    if (hasMa && hasKhoa) {
      return { maSoNganh: ma!, khoa: khoa! };
    }
    return undefined;
  }

  private requireCohortScope(scope?: Partial<CloPloCohortScope>): CloPloCohortScope {
    const parsed = this.parseOptionalCohortScope(scope);
    if (!parsed) {
      throw new BadRequestException(
        "Bắt buộc query maSoNganh và khoa (phiên bản CTĐT) khi tạo mapping CLO–PLO",
      );
    }
    return parsed;
  }

  private async assertCloExistsInDeCuong(maDeCuong: string, maCLO: string) {
    const clo = await this.prisma.cLO.findFirst({
      where: { maDeCuong, maCLO },
      select: { maCLO: true },
    });
    if (!clo) throw new BadRequestException("CLO not found in this DeCuong");
  }

  private async getDeCuongMaHocPhan(maDeCuong: string): Promise<string> {
    const dc = await this.prisma.deCuongChiTiet.findUnique({
      where: { maDeCuong },
      select: { maHocPhan: true },
    });
    if (!dc) throw new BadRequestException("DeCuongChiTiet not found");
    return dc.maHocPhan;
  }

  private async assertHocPhanInProgramCohort(maHocPhan: string, maSoNganh: string, khoa: number) {
    const row = await this.prisma.chuongTrinhDaoTaoHocPhan.findUnique({
      where: {
        maSoNganh_khoa_maHocPhan: { maSoNganh, khoa, maHocPhan },
      },
      select: { maHocPhan: true },
    });
    if (!row) {
      throw new BadRequestException("Học phần không thuộc khung CTĐT (maSoNganh, khoa) đã chọn");
    }
  }

  private async assertPloBelongsToCohort(maPLO: string, maSoNganh: string, khoa: number) {
    const plo = await this.prisma.pLO.findFirst({
      where: { maPLO, maSoNganh, khoa },
      select: { maPLO: true },
    });
    if (!plo) {
      throw new BadRequestException("PLO không tồn tại hoặc không thuộc (maSoNganh, khoa) đã chọn");
    }
  }

  async create(maDeCuong: string, maCLO: string, dto: CreateCloPloMappingDto, scope?: Partial<CloPloCohortScope>) {
    const cohort = this.requireCohortScope(scope);
    const maHocPhan = await this.getDeCuongMaHocPhan(maDeCuong);

    await this.assertCloExistsInDeCuong(maDeCuong, maCLO);
    await this.assertHocPhanInProgramCohort(maHocPhan, cohort.maSoNganh, cohort.khoa);
    await this.assertPloBelongsToCohort(dto.maPLO, cohort.maSoNganh, cohort.khoa);

    try {
      return await this.prisma.cloPloMapping.create({
        data: {
          maCLO,
          maPLO: dto.maPLO,
          trongSo: new Prisma.Decimal(dto.trongSo),
          ghiChu: dto.ghiChu,
        },
        include: { plo: true, clo: true },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new BadRequestException("Mapping already exists (maPLO, maCLO)");
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll(maDeCuong: string, maCLO: string, scope?: Partial<CloPloCohortScope>) {
    await this.assertCloExistsInDeCuong(maDeCuong, maCLO);

    const cohort = this.parseOptionalCohortScope(scope);
    const cohortFilter = cohort ? { plo: { maSoNganh: cohort.maSoNganh, khoa: cohort.khoa } } : {};

    return this.prisma.cloPloMapping.findMany({
      where: { maCLO, ...cohortFilter },
      orderBy: { maPLO: "asc" },
      include: { plo: true, clo: true },
    });
  }

  async findOne(maDeCuong: string, maCLO: string, maPLO: string, scope?: Partial<CloPloCohortScope>) {
    await this.assertCloExistsInDeCuong(maDeCuong, maCLO);

    const item = await this.prisma.cloPloMapping.findUnique({
      where: this.key(maPLO, maCLO),
      include: { plo: true, clo: true },
    });
    if (!item) throw new NotFoundException("CLO-PLO mapping not found");

    const cohort = this.parseOptionalCohortScope(scope);
    if (cohort) {
      if (item.plo.maSoNganh !== cohort.maSoNganh || item.plo.khoa !== cohort.khoa) {
        throw new BadRequestException("Mapping không thuộc phiên bản CTĐT (maSoNganh, khoa) đã chọn");
      }
    }

    return item;
  }

  async update(
    maDeCuong: string,
    maCLO: string,
    maPLO: string,
    dto: UpdateCloPloMappingDto,
    scope?: Partial<CloPloCohortScope>,
  ) {
    await this.findOne(maDeCuong, maCLO, maPLO, scope);

    return this.prisma.cloPloMapping.update({
      where: this.key(maPLO, maCLO),
      data: {
        ...(dto.trongSo != null ? { trongSo: new Prisma.Decimal(dto.trongSo) } : {}),
        ghiChu: dto.ghiChu,
      },
      include: { plo: true, clo: true },
    });
  }

  async remove(maDeCuong: string, maCLO: string, maPLO: string, scope?: Partial<CloPloCohortScope>) {
    await this.findOne(maDeCuong, maCLO, maPLO, scope);

    return this.prisma.cloPloMapping.delete({
      where: this.key(maPLO, maCLO),
    });
  }
}
