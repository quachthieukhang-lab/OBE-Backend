import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateCdgCoMappingDto {
  @ApiProperty({ example: "CO1", description: "Mã chuẩn đầu ra môn học (FK)" })
  @IsString()
  maCO!: string;

  @ApiProperty({ example: "0.25", description: "Trọng số đóng góp (0.0 - 1.0)" })
  @Matches(/^(0(\.\d+)?|1(\.0+)?)$/, { message: "trongSo must be between 0 and 1" })
  trongSo!: string;

  @ApiPropertyOptional({ example: "Ghi chú...", description: "Ghi chú thêm" })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}