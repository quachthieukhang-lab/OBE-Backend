import { IsOptional, Matches } from "class-validator";

export class UpdateLecturerScoreDto {
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: "diem must be a number with up to 2 decimals",
  })
  diem?: string;
}