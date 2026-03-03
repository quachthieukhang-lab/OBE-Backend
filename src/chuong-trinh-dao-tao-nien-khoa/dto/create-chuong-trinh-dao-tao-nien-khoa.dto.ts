import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateChuongTrinhDaoTaoNienKhoaDto {
    @ApiProperty({ example: 46, description: "Khóa học (số nguyên)" })
    @IsInt()
    @Min(1)
    khoa!: number;

    @ApiPropertyOptional({ example: "2020-08-01T00:00:00.000Z", description: "Ngày áp dụng" })
    @IsOptional()
    ngayApDung?: Date; // Prisma DateTime -> Date object

    @ApiPropertyOptional({ example: "Ghi chú...", description: "Ghi chú" })
    @IsOptional()
    @IsString()
    ghiChu?: string;

    @ApiPropertyOptional({ example: 150, description: "Tổng số tín chỉ" })
    @IsOptional()
    @IsInt()
    @Min(1)
    soTinChi?: number;

    @ApiPropertyOptional({ example: "Chính quy", description: "Hình thức đào tạo" })
    @IsOptional()
    @IsString()
    hinhThucDaoTao?: string;

    @ApiPropertyOptional({ example: "4 năm", description: "Thời gian đào tạo" })
    @IsOptional()
    @IsString()
    thoiGianDaoTao?: string;

    @ApiPropertyOptional({ example: "4.0", description: "Thang điểm đánh giá" })
    @IsOptional()
    @IsString()
    thangDiemDanhGia?: string;

    @ApiPropertyOptional({ example: "v1.0", description: "Phiên bản chương trình" })
    @IsOptional()
    @IsString()
    phienBan?: string;

    @ApiPropertyOptional({ example: "2020-01-01T00:00:00.000Z", description: "Ngày ban hành" })
    @IsOptional()
    ngayBanHanh?: Date;

    @ApiPropertyOptional({ example: "Mô tả...", description: "Mô tả chi tiết" })
    @IsOptional()
    @IsString()
    moTa?: string;

    @ApiPropertyOptional({ example: "active", description: "Trạng thái (active/inactive)" })
    @IsOptional()
    @IsString()
    trangThai?: string; // default "active" nếu bỏ trống
}