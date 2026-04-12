import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateDeCuongChiTietDto {
  @ApiProperty({ example: "CT243", description: "Mã học phần (FK)" })
  @IsString()
  maHocPhan!: string;

  @ApiProperty({ example: "2024-v1", description: "Phiên bản đề cương (unique per học phần)" })
  @IsString()
  phienBan!: string;

  @ApiPropertyOptional({ example: "2024-08-01", description: "Ngày áp dụng (ISO 8601)" })
  @IsOptional()
  @IsDateString()
  ngayApDung?: string;

  @ApiPropertyOptional({ example: "draft", description: "Trạng thái: draft | active | archived", default: "draft" })
  @IsOptional()
  @IsString()
  trangThai?: string;

  @ApiPropertyOptional({ example: "Đề cương mới cho khóa 48", description: "Ghi chú" })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}
