import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateDangKyHocPhanDto {
    @ApiProperty({ example: "B2012345", description: "Mã số sinh viên (FK)" })
    @IsString()
    MSSV!: string;

    @ApiPropertyOptional({ example: "2023-08-15T00:00:00.000Z", description: "Ngày đăng ký" })
    @IsOptional()
    @IsDateString()
    ngayDangKy?: string; // ISO date

    @ApiPropertyOptional({ example: "dang_hoc", description: "Trạng thái đăng ký" })
    @IsOptional()
    @IsString()
    trangThai?: string;

    @ApiPropertyOptional({ example: 1, description: "Lần học (mặc định 1)" })
    @IsOptional()
    @IsInt()
    @Min(1)
    lanHoc?: number; // attempt

    @ApiPropertyOptional({ example: "Học cải thiện", description: "Ghi chú" })
    @IsOptional()
    @IsString()
    ghiChu?: string;
}