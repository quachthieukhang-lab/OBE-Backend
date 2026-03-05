import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateSinhVienDto {
    @ApiProperty({ example: "B2012345", description: "Mã số sinh viên (PK)" })
    @IsString()
    MSSV!: string;

    @ApiPropertyOptional({ example: "CNTT_TT", description: "Mã đơn vị quản lý (FK)" })
    @IsOptional()
    @IsString()
    maDonVi?: string;

    @ApiPropertyOptional({ example: 46, description: "Khóa học (FK)" })
    @IsOptional()
    @IsInt()
    @Min(1)
    khoa?: number;

    @ApiPropertyOptional({ example: "7480201", description: "Mã số ngành (FK)" })
    @IsOptional()
    @IsString()
    maSoNganh?: string;

    @ApiProperty({ example: "Nguyễn Văn B", description: "Họ và tên sinh viên" })
    @IsString()
    hoTen!: string;

    @ApiPropertyOptional({ example: "2002-01-30", description: "Ngày sinh (định dạng ISO 8601)" })
    @IsOptional()
    @IsDateString()
    ngaySinh?: string; // ISO date

    @ApiProperty({ example: "Nam", description: "Giới tính", enum: ["Nam", "Nữ"] })
    @IsIn(["Nam", "Nữ"])
    @IsString()
    gioiTinh: "Nam" | "Nữ" = "Nam";

    @ApiPropertyOptional({ example: "b2012345@student.ctu.edu.vn", description: "Email cá nhân" })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: "0987654321", description: "Số điện thoại" })
    @IsOptional()
    @IsString()
    soDienThoai?: string;

    @ApiPropertyOptional({ example: "Đang học", description: "Trạng thái học tập" })
    @IsOptional()
    @IsString()
    trangThaiHocTap?: string;
}