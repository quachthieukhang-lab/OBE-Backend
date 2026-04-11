import { PartialType } from '@nestjs/swagger';
import { CreateAdminObeDashboardDto } from './create-admin-obe-dashboard.dto';

export class UpdateAdminObeDashboardDto extends PartialType(CreateAdminObeDashboardDto) {}
