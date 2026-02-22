import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateDonViDto {
  @ApiProperty({ example: "CNTT_TT" })
  @IsString()
  @MaxLength(30)
  maDonVi!: string;

  @ApiProperty({ example: "Khoa CNTT&TT" })
  @IsString()
  @MaxLength(255)
  tenDonVi!: string;

  @ApiProperty({ example: "FACULTY" })
  @IsString()
  @MaxLength(30)
  loaiDonVi!: string;

  @ApiPropertyOptional({ example: "contact@ctu.edu.vn" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "0909123456" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  soDienThoai?: string;

  @ApiPropertyOptional({ example: "Cần Thơ" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  diaChi?: string;

  @ApiPropertyOptional({ example: "https://cit.ctu.edu.vn" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}