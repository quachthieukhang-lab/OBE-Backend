import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBanPhanCongNhapDeCuongChiTietHpDto } from './dto/create-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto';
import { UpdateBanPhanCongNhapDeCuongChiTietHpDto } from './dto/update-ban-phan-cong-nhap-de-cuong-chi-tiet-hp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BanPhanCongNhapDeCuongChiTietHpService {
  constructor(private readonly prisma: PrismaService) { }

  private async assertRefs(dto: { maSoNganh: string; maHocPhan: string; MSGV: string }) {
    const [ctdt, hp, gv] = await Promise.all([
      this.prisma.chuongTrinhDaoTao.findUnique({
        where: { maSoNganh: dto.maSoNganh },
        select: { maSoNganh: true },
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

    if (!ctdt) throw new BadRequestException("ChuongTrinhDaoTao not found");
    if (!hp) throw new BadRequestException("HocPhan not found");
    if (!gv) throw new BadRequestException("GiangVien not found");
  }
  async create(dto: CreateBanPhanCongNhapDeCuongChiTietHpDto) {
    await this.assertRefs(dto);
    try {
      const { deadline, assignedAt, ...rest } = dto
      return await this.prisma.banPhanCongNhapDeCuongChiTietHP.create({
        data: {
          ...rest,
          deadline: dto.deadline ? new Date(dto.deadline) : undefined,
          assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : new Date(),
        },
        include: {
          chuongTrinh: true,
          hocPhan: true,
          giangVien: true,
        },
      });
    } catch (e: any) {
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
        chuongTrinh: true,
        hocPhan: true,
        giangVien: true,
      },
    });
  }

  async findOne(maBanPhanCong: string) {
    const item = await this.prisma.banPhanCongNhapDeCuongChiTietHP.findUnique({
      where: { maBanPhanCong },
      include: {
        chuongTrinh: true,
        hocPhan: true,
        giangVien: true,
      },
    });
    if (!item) throw new NotFoundException("BanPhanCong not found");
    return item;
  }

  async update(maBanPhanCong: string, dto: UpdateBanPhanCongNhapDeCuongChiTietHpDto) {
    await this.findOne(maBanPhanCong);
    if (dto.maSoNganh || dto.maHocPhan || dto.MSGV) {
      await this.assertRefs({
        maSoNganh: dto.maSoNganh ?? (await this.findOne(maBanPhanCong)).maSoNganh,
        maHocPhan: dto.maHocPhan ?? (await this.findOne(maBanPhanCong)).maHocPhan,
        MSGV: dto.MSGV ?? (await this.findOne(maBanPhanCong)).MSGV,
      });
    }
    const { deadline, assignedAt, ...rest } = dto
    return this.prisma.banPhanCongNhapDeCuongChiTietHP.update({
      where: { maBanPhanCong },
      data: {
        ...rest,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : undefined,
      },
      include: {
        chuongTrinh: true,
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
