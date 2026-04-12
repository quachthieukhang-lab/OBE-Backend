import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBanPhanCongNhapDeCuongChiTietHpDto } from "./dto/create-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto";
import { UpdateBanPhanCongNhapDeCuongChiTietHpDto } from "./dto/update-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class BanPhanCongNhapDeCuongChiTietHpService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertRefs(dto: { maSoNganh: string; khoa: number; maHocPhan: string; MSGV: string }) {
    const [ctdt, hp, gv] = await Promise.all([
      this.prisma.chuongTrinhDaoTaoNienKhoa.findUnique({
        where: { maSoNganh_khoa: { maSoNganh: dto.maSoNganh, khoa: dto.khoa } },
        select: { maSoNganh: true, khoa: true },
      }),
      this.prisma.hocPhan.findUnique({
        where: { maHocPhan: dto.maHocPhan },
        select: { maHocPhan: true },
      }),
      this.prisma.giangVien.findUnique({
        where: { MSGV: dto.MSGV },
        select: { MSGV: true },
      }),
    ]);

    if (!ctdt) throw new BadRequestException("ChuongTrinhDaoTaoNienKhoa not found for (maSoNganh, khoa)");
    if (!hp) throw new BadRequestException("HocPhan not found");
    if (!gv) throw new BadRequestException("GiangVien not found");
  }

  async create(dto: CreateBanPhanCongNhapDeCuongChiTietHpDto) {
    await this.assertRefs(dto);
    try {
      const { deadline, assignedAt, ...rest } = dto;
      return await this.prisma.banPhanCongNhapDeCuongChiTietHP.create({
        data: {
          ...rest,
          deadline: dto.deadline ? new Date(dto.deadline) : undefined,
          assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : new Date(),
        },
        include: {
          ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
          hocPhan: true,
          giangVien: true,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2003") throw new BadRequestException("Foreign key constraint failed");
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.banPhanCongNhapDeCuongChiTietHP.findMany({
      orderBy: { assignedAt: "desc" },
      include: {
        ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
        hocPhan: true,
        giangVien: true,
      },
    });
  }

  async findOne(maBanPhanCong: string) {
    const item = await this.prisma.banPhanCongNhapDeCuongChiTietHP.findUnique({
      where: { maBanPhanCong },
      include: {
        ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
        hocPhan: true,
        giangVien: true,
      },
    });
    if (!item) throw new NotFoundException("BanPhanCong not found");
    return item;
  }

  async update(maBanPhanCong: string, dto: UpdateBanPhanCongNhapDeCuongChiTietHpDto) {
    const current = await this.findOne(maBanPhanCong);
    if (dto.maSoNganh != null || dto.khoa != null || dto.maHocPhan != null || dto.MSGV != null) {
      await this.assertRefs({
        maSoNganh: dto.maSoNganh ?? current.maSoNganh,
        khoa: dto.khoa ?? current.khoa,
        maHocPhan: dto.maHocPhan ?? current.maHocPhan,
        MSGV: dto.MSGV ?? current.MSGV,
      });
    }
    const { deadline, assignedAt, ...rest } = dto;
    return this.prisma.banPhanCongNhapDeCuongChiTietHP.update({
      where: { maBanPhanCong },
      data: {
        ...rest,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : undefined,
      },
      include: {
        ctdtNienKhoa: { include: { chuongTrinh: true, nienKhoa: true } },
        hocPhan: true,
        giangVien: true,
      },
    });
  }

  async remove(maBanPhanCong: string) {
    await this.findOne(maBanPhanCong);
    return this.prisma.banPhanCongNhapDeCuongChiTietHP.delete({
      where: { maBanPhanCong },
    });
  }
}
