import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DashboardAdminService } from "./dashboard-admin.service";

@ApiTags("dashboard-admin")
@Controller("dashboard-admin")
export class DashboardAdminController {
  constructor(private readonly service: DashboardAdminService) {}

  @Get()
  getDashboard() {
    return this.service.getDashboard();
  }
}