import { Type } from "class-transformer";
import { IsInt, IsString, Matches, Min } from "class-validator";

export class CreateCauHinhObeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  khoa!: number;

  @IsString()
  maDonVi!: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: "nguongDatCaNhan must be a number with up to 4 decimals",
  })
  nguongDatCaNhan!: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: "kpiLopHoc must be a number with up to 4 decimals",
  })
  kpiLopHoc!: string;
}