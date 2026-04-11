import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { redisStore } from "cache-manager-ioredis-yet";
import { validateEnv } from "./config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DonViModule } from './don-vi/don-vi.module';
import { NienKhoaModule } from './nien-khoa/nien-khoa.module';
import { ChuongTrinhDaoTaoModule } from './chuong-trinh-dao-tao/chuong-trinh-dao-tao.module';
import { HocPhanModule } from './hoc-phan/hoc-phan.module';
import { ChuongTrinhDaoTaoNienKhoaModule } from './chuong-trinh-dao-tao-nien-khoa/chuong-trinh-dao-tao-nien-khoa.module';
import { GiangVienModule } from './giang-vien/giang-vien.module';
import { ChuongTrinhDaoTaoHocPhanModule } from './chuong-trinh-dao-tao-hoc-phan/chuong-trinh-dao-tao-hoc-phan.module';
import { BanPhanCongNhapDeCuongChiTietHpModule } from './ban-phan-cong-nhap-de-cuong-chi-tiet-hp/ban-phan-cong-nhap-de-cuong-chi-tiet-hp.module';
import { PloModule } from './plo/plo.module';
import { SinhVienModule } from './sinh-vien/sinh-vien.module';
import { LopHocPhanModule } from './lop-hoc-phan/lop-hoc-phan.module';
import { DangKyHocPhanModule } from './dang-ky-hoc-phan/dang-ky-hoc-phan.module';
import { CachDanhGiaModule } from './cach-danh-gia/cach-danh-gia.module';
import { CloModule } from './clo/clo.module';
import { CloPloMappingModule } from './clo-plo-mapping/clo-plo-mapping.module';
import { CoModule } from './co/co.module';
import { DiemSoModule } from './diem-so/diem-so.module';
import { CloCoMappingModule } from './clo-co-mapping/clo-co-mapping.module';
import { CdgCoMappingModule } from './cdg-co-mapping/cdg-co-mapping.module';
import { DashboardAdminModule } from './dashboard-admin/dashboard-admin.module';
import { ObeCalculationModule } from './obe-calculation/obe-calculation.module';
import { CauHinhObeModule } from './cau-hinh-obe/cau-hinh-obe.module';
import { UsersModule } from './users/users.module';
import { LecturerScoresModule } from './lecturer-scores/lecturer-scores.module';
import { AdminObeDashboardModule } from './admin-obe-dashboard/admin-obe-dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL!,
        }),
      }),
    }),

    PrismaModule,
    AuthModule,
    DonViModule,
    NienKhoaModule,
    ChuongTrinhDaoTaoModule,
    HocPhanModule,
    ChuongTrinhDaoTaoNienKhoaModule,
    GiangVienModule,
    ChuongTrinhDaoTaoHocPhanModule,
    BanPhanCongNhapDeCuongChiTietHpModule,
    PloModule,
    SinhVienModule,
    LopHocPhanModule,
    DangKyHocPhanModule,
    CachDanhGiaModule,
    CloModule,
    CloPloMappingModule,
    CoModule,
    DiemSoModule,
    CloCoMappingModule,
    CdgCoMappingModule,
    DashboardAdminModule,
    ObeCalculationModule,
    CauHinhObeModule,
    UsersModule,
    LecturerScoresModule,
    AdminObeDashboardModule,
  ],
})
export class AppModule {}