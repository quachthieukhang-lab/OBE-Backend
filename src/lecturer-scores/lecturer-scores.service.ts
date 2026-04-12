import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DiemSoService } from "src/diem-so/diem-so.service";
import { CreateLecturerScoreDto } from "./dto/create-lecturer-score.dto";
import { UpdateLecturerScoreDto } from "./dto/update-lecturer-score.dto";

@Injectable()
export class LecturerScoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly diemSoService: DiemSoService,
  ) {}

  private async getMyClassOrThrow(MSGV: string, maLopHocPhan: string) {
    const lop = await this.prisma.lopHocPhan.findUnique({
      where: { maLopHocPhan },
      include: {
        hocPhan: {
          select: {
            maHocPhan: true,
            tenHocPhan: true,
          },
        },
        deCuong: {
          select: {
            maDeCuong: true,
            phienBan: true,
          },
        },
      },
    });

    if (!lop) {
      throw new NotFoundException("LopHocPhan not found");
    }

    if (lop.MSGV !== MSGV) {
      throw new ForbiddenException("Bạn không phụ trách lớp học phần này");
    }

    return lop;
  }

  private async getMyEnrollmentOrThrow(MSGV: string, maDangKy: string) {
    const enrollment = await this.prisma.dangKyHocPhan.findUnique({
      where: { maDangKy },
      include: {
        lopHocPhan: {
          include: {
            hocPhan: {
              select: {
                maHocPhan: true,
                tenHocPhan: true,
              },
            },
          },
        },
        sinhVien: {
          select: {
            MSSV: true,
            hoTen: true,
            email: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException("DangKyHocPhan not found");
    }

    if (enrollment.lopHocPhan.MSGV !== MSGV) {
      throw new ForbiddenException("Bạn không phụ trách lớp học phần của đăng ký này");
    }

    return enrollment;
  }

  async listMyClasses(MSGV: string) {
    return this.prisma.lopHocPhan.findMany({
      where: { MSGV },
      orderBy: [{ khoa: "desc" }, { hocKy: "asc" }, { maLopHocPhan: "asc" }],
      include: {
        hocPhan: {
          select: {
            maHocPhan: true,
            tenHocPhan: true,
          },
        },
      },
    });
  }

  async listMyClassEnrollments(MSGV: string, maLopHocPhan: string) {
    await this.getMyClassOrThrow(MSGV, maLopHocPhan);

    return this.prisma.dangKyHocPhan.findMany({
      where: { maLopHocPhan },
      orderBy: [{ ngayDangKy: "asc" }, { maDangKy: "asc" }],
      include: {
        sinhVien: {
          select: {
            MSSV: true,
            hoTen: true,
            email: true,
          },
        },
      },
    });
  }

  async listMyClassCachDanhGia(MSGV: string, maLopHocPhan: string) {
    const lop = await this.getMyClassOrThrow(MSGV, maLopHocPhan);

    if (!lop.deCuong) {
      return [];
    }

    return this.prisma.cachDanhGia.findMany({
      where: { maDeCuong: lop.deCuong.maDeCuong },
      orderBy: [{ tenThanhPhan: "asc" }, { maCDG: "asc" }],
    });
  }

  async listEnrollmentScores(MSGV: string, maDangKy: string) {
    await this.getMyEnrollmentOrThrow(MSGV, maDangKy);
    return this.diemSoService.findAll(maDangKy);
  }

  async createEnrollmentScore(
    MSGV: string,
    maDangKy: string,
    dto: CreateLecturerScoreDto,
  ) {
    await this.getMyEnrollmentOrThrow(MSGV, maDangKy);
    return this.diemSoService.createForEnrollment(maDangKy, dto, MSGV);
  }

  async updateEnrollmentScore(
    MSGV: string,
    maDangKy: string,
    maCDG: string,
    dto: UpdateLecturerScoreDto,
  ) {
    await this.getMyEnrollmentOrThrow(MSGV, maDangKy);
    return this.diemSoService.updateForEnrollment(maDangKy, maCDG, dto, MSGV);
  }

  async deleteEnrollmentScore(MSGV: string, maDangKy: string, maCDG: string) {
    await this.getMyEnrollmentOrThrow(MSGV, maDangKy);
    return this.diemSoService.remove(maDangKy, maCDG);
  }
}