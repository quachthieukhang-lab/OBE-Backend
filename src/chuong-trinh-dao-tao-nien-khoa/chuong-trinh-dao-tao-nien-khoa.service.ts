import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChuongTrinhDaoTaoNienKhoaDto } from "./dto/create-chuong-trinh-dao-tao-nien-khoa.dto";
import { UpdateChuongTrinhDaoTaoNienKhoaDto } from "./dto/update-chuong-trinh-dao-tao-nien-khoa.dto";

@Injectable()
export class ChuongTrinhDaoTaoNienKhoaService {
  constructor(private readonly prisma: PrismaService) { }

  private key(maSoNganh: string, khoa: number) {
    // Prisma tạo input name cho compound @@id thường theo pattern: field1_field2
    return { maSoNganh_khoa: { maSoNganh, khoa } } as const;
  }

  async create(maSoNganh: string, dto: CreateChuongTrinhDaoTaoNienKhoaDto) {
    // Check FK tồn tại để trả lỗi đẹp
    const ct = await this.prisma.chuongTrinhDaoTao.findUnique({
      where: { maSoNganh },
      select: { maSoNganh: true },
    });
    if (!ct) throw new BadRequestException("không tìm thấy ChuongTrinhDaoTao!");

    const nk = await this.prisma.nienKhoa.findUnique({
      where: { khoa: dto.khoa },
      select: { khoa: true },
    });
    if (!nk) throw new BadRequestException("không tìm thấy NienKhoa");

    try {
      return await this.prisma.chuongTrinhDaoTaoNienKhoa.create({
        data: {
          maSoNganh,
          khoa: dto.khoa,
          ngayApDung: dto.ngayApDung,
          ghiChu: dto.ghiChu,
          soTinChi: dto.soTinChi,
          hinhThucDaoTao: dto.hinhThucDaoTao,
          thoiGianDaoTao: dto.thoiGianDaoTao,
          thangDiemDanhGia: dto.thangDiemDanhGia,
          phienBan: dto.phienBan,
          ngayBanHanh: dto.ngayBanHanh,
          moTa: dto.moTa,
          trangThai: dto.trangThai,
        },
        include: { nienKhoa: true, chuongTrinh: true },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: unique constraint (ở đây là trùng PK kép)
        if (e.code === "P2002") throw new BadRequestException("bản ghi có (maSoNganh, khoa) đã tồn tại!");
      }
      throw e;
    }
  }

  async findAll(maSoNganh: string) {
    return this.prisma.chuongTrinhDaoTaoNienKhoa.findMany({
      where: { maSoNganh },
      orderBy: { khoa: "asc" },
      include: { chuongTrinh: true, nienKhoa: true },
    });
  }

  async findOne(maSoNganh: string, khoa: number) {
    const item = await this.prisma.chuongTrinhDaoTaoNienKhoa.findUnique({
      where: this.key(maSoNganh, khoa),
      include: { nienKhoa: true, chuongTrinh: true },
    });
    if (!item) throw new NotFoundException("không tìm thấy CTDT-NienKhoa");
    return item;
  }

  async update(maSoNganh: string, khoa: number, dto: UpdateChuongTrinhDaoTaoNienKhoaDto) {
    // cách 1: findOne trước để trả 404 đẹp
    await this.findOne(maSoNganh, khoa);
    return this.prisma.chuongTrinhDaoTaoNienKhoa.update({
      where: this.key(maSoNganh, khoa),
      data: {
        ngayApDung: dto.ngayApDung,
        ghiChu: dto.ghiChu,
        soTinChi: dto.soTinChi,
        hinhThucDaoTao: dto.hinhThucDaoTao,
        thoiGianDaoTao: dto.thoiGianDaoTao,
        thangDiemDanhGia: dto.thangDiemDanhGia,
        phienBan: dto.phienBan,
        ngayBanHanh: dto.ngayBanHanh,
        moTa: dto.moTa,
        trangThai: dto.trangThai,
      },
      include: { nienKhoa: true, chuongTrinh: true },
    });
  }

  async remove(maSoNganh: string, khoa: number) {
    await this.findOne(maSoNganh, khoa);

    return this.prisma.chuongTrinhDaoTaoNienKhoa.delete({
      where: this.key(maSoNganh, khoa),
    });
  }
}