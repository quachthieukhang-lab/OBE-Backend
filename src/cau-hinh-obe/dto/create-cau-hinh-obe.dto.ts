import { IsInt, Min, Matches } from "class-validator";
import { Type } from "class-transformer";

export class CreateCauHinhObeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  khoa!: number;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: "nguongDatCaNhan must be a number with up to 4 decimals",
  })
  nguongDatCaNhan!: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: "kpiLopHoc must be a number with up to 4 decimals",
  })
  kpiLopHoc!: string;
}