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
  ],
})
export class AppModule {}