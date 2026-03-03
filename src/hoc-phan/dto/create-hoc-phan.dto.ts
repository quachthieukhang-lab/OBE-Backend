import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateHocPhanDto {
    @ApiProperty({ example: "CT101", description: "Mã học phần (PK)" })
    @IsString()
    maHocPhan!: string; // PK

    @ApiProperty({ example: "CNTT_TT", description: "Mã đơn vị quản lý (FK)" })
    @IsString()
    maDonVi!: string; // FK -> DonVi.maDonVi

    @ApiProperty({ example: "Lập trình căn bản A", description: "Tên học phần" })
    @IsString()
    tenHocPhan!: string;

    @ApiProperty({ example: 4, description: "Số tín chỉ" })
    @IsInt()
    @Min(1)
    soTinChi!: number;

    @ApiPropertyOptional({ example: "CS", description: "Loại học phần (Cơ sở, Chuyên ngành...)" })
    @IsOptional()
    @IsString()
    loaiHocPhan?: string;

    @ApiPropertyOptional({ example: "Mô tả chi tiết học phần...", description: "Mô tả" })
    @IsOptional()
    @IsString()
    moTa?: string;

    @ApiPropertyOptional({ example: 30, description: "Số tiết lý thuyết" })
    @IsOptional()
    @IsInt()
    @Min(0)
    soTietLyThuyet?: number;

    @ApiPropertyOptional({ example: 30, description: "Số tiết thực hành" })
    @IsOptional()
    @IsInt()
    @Min(0)
    soTietThucHanh?: number;

    @ApiPropertyOptional({ example: "Tiếng Việt", description: "Ngôn ngữ giảng dạy" })
    @IsOptional()
    @IsString()
    ngonNguGiangDay?: string;

    @ApiPropertyOptional({ example: "Giáo trình A, Sách B...", description: "Tài liệu tham khảo" })
    @IsOptional()
    @IsString()
    taiLieuThamKhao?: string;
}