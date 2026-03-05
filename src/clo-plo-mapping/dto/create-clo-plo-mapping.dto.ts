import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateCloPloMappingDto {
  @ApiProperty({ example: "PLO1", description: "Mã chuẩn đầu ra chương trình (FK)" })
  @IsString()
  maPLO!: string;

  // Decimal: nên gửi string "0.2", "0.5"...
  @ApiProperty({ example: "0.5", description: "Trọng số đóng góp (0.0 - 1.0)" })
  @Matches(/^(0(\.\d+)?|1(\.0+)?)$/, { message: "trongSo must be between 0 and 1" })
  trongSo!: string;

  @ApiPropertyOptional({ example: "Ghi chú...", description: "Ghi chú thêm" })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}