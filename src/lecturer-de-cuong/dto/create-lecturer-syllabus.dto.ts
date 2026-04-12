import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateLecturerSyllabusDto {
  @ApiProperty({ example: "2024-v1", description: "Phiên bản đề cương" })
  @IsString()
  phienBan!: string;

  @ApiPropertyOptional({ example: "2024-08-01", description: "Ngày áp dụng (ISO 8601)" })
  @IsOptional()
  @IsDateString()
  ngayApDung?: string;

  @ApiPropertyOptional({ example: "draft", description: "Trạng thái: draft | active | archived" })
  @IsOptional()
  @IsString()
  trangThai?: string;

  @ApiPropertyOptional({ example: "Đề cương mới", description: "Ghi chú" })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}
