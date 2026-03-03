import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateBanPhanCongNhapDeCuongChiTietHpDto {
  @ApiProperty({ example: "7480201", description: "Mã số ngành (FK)" })
  @IsString()
  maSoNganh!: string; 

  @ApiProperty({ example: "CT101", description: "Mã học phần (FK)" })
  @IsString()
  maHocPhan!: string; 

  @ApiProperty({ example: "00123", description: "Mã số giảng viên (FK)" })
  @IsString()
  MSGV!: string; 

  @ApiProperty({ example: "BienSoan", description: "Vai trò phân công" })
  @IsString()
  vaiTro!: string;

  @ApiProperty({ example: "ChuaNop", description: "Trạng thái phân công" })
  @IsString()
  trangThai!: string;

  @ApiPropertyOptional({ example: "2023-12-31T00:00:00.000Z", description: "Hạn chót nộp đề cương" })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ example: "Ghi chú thêm", description: "Ghi chú" })
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional({ example: "2023-01-01T00:00:00.000Z", description: "Ngày phân công" })
  @IsOptional()
  @IsDateString()
  assignedAt?: string;
}