import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateLopHocPhanDto {
    @ApiProperty({ example: "LHP001", description: "Mã lớp học phần (PK)" })
    @IsString()
    maLopHocPhan!: string; // PK

    @ApiProperty({ example: "00123", description: "Mã số giảng viên (FK)" })
    @IsString()
    MSGV!: string; // FK -> GiangVien.MSGV

    @ApiProperty({ example: "CT101", description: "Mã học phần (FK)" })
    @IsString()
    maHocPhan!: string; // FK -> HocPhan.maHocPhan

    @ApiProperty({ example: 46, description: "Khóa (FK)" })
    @IsInt()
    @Min(1)
    khoa!: number; // FK -> NienKhoa.khoa

    @ApiProperty({ example: 1, description: "Học kỳ" })
    @IsInt()
    @Min(1)
    hocKy!: number;

    @ApiPropertyOptional({ example: "01", description: "Nhóm lớp" })
    @IsOptional()
    @IsString()
    nhom?: string;

    @ApiPropertyOptional({ example: 60, description: "Sĩ số tối đa" })
    @IsOptional()
    @IsInt()
    @Min(0)
    siSoToiDa?: number;

    @ApiPropertyOptional({ example: "101/C1", description: "Phòng học" })
    @IsOptional()
    @IsString()
    phongHoc?: string;

    @ApiPropertyOptional({ example: "Thứ 2, tiết 1-3", description: "Lịch học" })
    @IsOptional()
    @IsString()
    lichHoc?: string;

    @ApiPropertyOptional({ example: "2023-08-01", description: "Ngày bắt đầu (ISO 8601)" })
    @IsOptional()
    @IsDateString()
    ngayBatDau?: string;

    @ApiPropertyOptional({ example: "2023-12-01", description: "Ngày kết thúc (ISO 8601)" })
    @IsOptional()
    @IsDateString()
    ngayKetThuc?: string;

    @ApiPropertyOptional({ example: "Đang mở", description: "Trạng thái lớp học phần" })
    @IsOptional()
    @IsString()
    status?: string;
}