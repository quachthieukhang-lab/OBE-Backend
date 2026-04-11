import { IsString, Matches } from "class-validator";

export class CreateCauHinhObeDto {
  @IsString()
  namHoc!: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: "nguongDatCaNhan must be a number with up to 4 decimals",
  })
  nguongDatCaNhan!: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: "kpiLopHoc must be a number with up to 4 decimals",
  })
  kpiLopHoc!: string;
}