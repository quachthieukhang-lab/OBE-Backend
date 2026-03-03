import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEmail, IsIn, IsOptional, IsString } from "class-validator";

export class CreateGiangVienDto {
    @ApiProperty({ example: "00123", description: "Mã số giảng viên (PK)" })
    @IsString()
    MSGV!: string; // PK

    @ApiProperty({ example: "CNTT_TT", description: "Mã đơn vị (FK)" })
    @IsString()
    maDonVi!: string; // FK -> DonVi.maDonVi

    @ApiProperty({ example: "Nguyễn Văn A", description: "Họ và tên giảng viên" })
    @IsString()
    hoTen!: string;

    @ApiProperty({ example: "Nam", description: "Giới tính", enum: ["Nam", "Nữ"] })
    @IsIn(["Nam", "Nữ"])
    @IsString()
    gioiTinh: "Nam" | "Nữ" = "Nam";

    @ApiPropertyOptional({ example: "nva@ctu.edu.vn", description: "Email giảng viên" })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: "0909123456", description: "Số điện thoại" })
    @IsOptional()
    @IsString()
    soDienThoai?: string;

    @ApiPropertyOptional({ example: "ThS", description: "Học vị" })
    @IsOptional()
    @IsString()
    hocVi?: string;

    @ApiPropertyOptional({ example: "Giảng viên chính", description: "Chức danh" })
    @IsOptional()
    @IsString()
    chucDanh?: string;

    @ApiPropertyOptional({ example: "Hệ thống thông tin", description: "Bộ môn" })
    @IsOptional()
    @IsString()
    boMon?: string;

    @ApiPropertyOptional({ example: "1990-01-01", description: "Ngày sinh (ISO 8601 string)" })
    @IsOptional()
    @IsDateString()
    ngaySinh?: string; // ISO string

    @ApiPropertyOptional({ example: true, description: "Trạng thái hoạt động", default: true })
    @IsOptional()
    @IsBoolean()
    isActive: boolean = true;
}