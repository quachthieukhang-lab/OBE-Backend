import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminObeDashboardService } from "./admin-obe-dashboard.service";

@ApiTags("admin-obe-dashboard")
@Controller("admin-obe-dashboard")
export class AdminObeDashboardController {
  constructor(private readonly service: AdminObeDashboardService) {}

  @Get("overview")
  getOverview(
    @Query("maDonVi") maDonVi?: string,
    @Query("khoa") khoa?: string,
    @Query("hocKy") hocKy?: string,
  ) {
    return this.service.getOverview({
      maDonVi,
      khoa: khoa ? Number(khoa) : undefined,
      hocKy: hocKy ? Number(hocKy) : undefined,
    });
  }
}