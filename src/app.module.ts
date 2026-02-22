import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { redisStore } from "cache-manager-ioredis-yet";
import { validateEnv } from "./config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DonViModule } from './don-vi/don-vi.module';
import { NienKhoaModule } from './nien-khoa/nien-khoa.module';

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
  ],
})
export class AppModule {}