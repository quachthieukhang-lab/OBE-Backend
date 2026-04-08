import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DashboardAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalPrograms,
      totalCourses,
      totalLecturers,
      totalStudents,
      totalClasses,
      totalAssignments,
      openClasses,
      pendingAssignments,
      programs,
      studentsByKhoaRaw,
      classesByHocKyRaw,
      assignmentsByStatusRaw,
      courseProgramLinks,
    ] = await Promise.all([
      this.prisma.chuongTrinhDaoTao.count(),
      this.prisma.hocPhan.count(),
      this.prisma.giangVien.count(),
      this.prisma.sinhVien.count(),
      this.prisma.lopHocPhan.count(),
      this.prisma.banPhanCongNhapDeCuongChiTietHP.count(),

      this.prisma.lopHocPhan.count({
        where: { status: "open" },
      }),

      this.prisma.banPhanCongNhapDeCuongChiTietHP.count({
        where: {
          trangThai: {
            in: ["assigned", "in_progress"],
          },
        },
      }),

      this.prisma.chuongTrinhDaoTao.findMany({
        select: {
          maSoNganh: true,
          tenTiengViet: true,
        },
        orderBy: { tenTiengViet: "asc" },
      }),

      this.prisma.sinhVien.groupBy({
        by: ["khoa"],
        _count: {
          _all: true,
        },
        orderBy: {
          khoa: "asc",
        },
      }),

      this.prisma.lopHocPhan.groupBy({
        by: ["hocKy"],
        _count: {
          _all: true,
        },
        orderBy: {
          hocKy: "asc",
        },
      }),

      this.prisma.banPhanCongNhapDeCuongChiTietHP.groupBy({
        by: ["trangThai"],
        _count: {
          _all: true,
        },
        orderBy: {
          trangThai: "asc",
        },
      }),

      this.prisma.chuongTrinhDaoTaoHocPhan.groupBy({
        by: ["maSoNganh"],
        _count: {
          maHocPhan: true,
        },
      }),
    ]);

    const courseCountMap = new Map(
      courseProgramLinks.map((item) => [item.maSoNganh, item._count.maHocPhan])
    );

    const coursesByProgram = programs.map((program) => ({
      maSoNganh: program.maSoNganh,
      tenTiengViet: program.tenTiengViet,
      totalHocPhan: courseCountMap.get(program.maSoNganh) ?? 0,
    }));

    const studentsByKhoa = studentsByKhoaRaw.map((item) => ({
      khoa: item.khoa,
      totalStudents: item._count._all,
    }));

    const classesByHocKy = classesByHocKyRaw.map((item) => ({
      hocKy: item.hocKy,
      totalClasses: item._count._all,
    }));

    const assignmentsByStatus = assignmentsByStatusRaw.map((item) => ({
      trangThai: item.trangThai,
      total: item._count._all,
    }));

    return {
      overview: {
        totalPrograms,
        totalCourses,
        totalLecturers,
        totalStudents,
        totalClasses,
        totalAssignments,
        openClasses,
        pendingAssignments,
      },
      charts: {
        coursesByProgram,
        studentsByKhoa,
        classesByHocKy,
        assignmentsByStatus,
      },
    };
  }
}