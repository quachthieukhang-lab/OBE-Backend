import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObeCalculationService } from './obe-calculation.service';
import { CreateObeCalculationDto } from './dto/create-obe-calculation.dto';
import { UpdateObeCalculationDto } from './dto/update-obe-calculation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("obe-calculation")
@Controller("obe-calculation")
export class ObeCalculationController {
  constructor(private readonly service: ObeCalculationService) { }

  @Post("recalculate/enrollment/:maDangKy")
  recalculateForEnrollment(@Param("maDangKy") maDangKy: string) {
    return this.service.recalculateObeResultsForEnrollment(maDangKy);
  }

}
