import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, IsUrl } from "class-validator";

export class CreateDonViDto {
  @ApiProperty({ example: "CNTT_TT", description: "Mã định danh của đơn vị (viết tắt)" })
  @IsString()
  @MaxLength(30)
  maDonVi!: string;

  @ApiProperty({ example: "Khoa CNTT&TT", description: "Tên đầy đủ của đơn vị" })
  @IsString()
  @MaxLength(255)
  tenDonVi!: string;

  @ApiProperty({ example: "FACULTY", description: "Loại đơn vị (ví dụ: KHOA, PHONG_BAN, TRUNG_TAM)" })
  @IsString()
  @MaxLength(30)
  loaiDonVi!: string;

  @ApiPropertyOptional({ example: "contact@ctu.edu.vn", description: "Email liên hệ chính thức" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "0909123456", description: "Số điện thoại liên hệ" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  soDienThoai?: string;

  @ApiPropertyOptional({ example: "Cần Thơ", description: "Địa chỉ trụ sở đơn vị" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  diaChi?: string;

  @ApiPropertyOptional({ example: "https://cit.ctu.edu.vn", description: "Đường dẫn website đơn vị" })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({ example: true, default: true, description: "Trạng thái hoạt động (true: đang hoạt động)" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}