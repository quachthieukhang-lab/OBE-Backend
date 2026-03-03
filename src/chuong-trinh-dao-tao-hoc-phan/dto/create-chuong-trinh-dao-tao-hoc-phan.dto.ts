import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";
export class CreateChuongTrinhDaoTaoHocPhanDto {
    @ApiProperty({ example: "CT101", description: "Mã học phần (FK)" })
    @IsString()
    maHocPhan!: string;

    @ApiPropertyOptional({ example: 1, description: "Học kỳ dự kiến trong chương trình đào tạo" })
    @IsOptional()
    @IsInt()
    @Min(1)
    hocKyDuKien?: number;

    @ApiPropertyOptional({ example: 1, description: "Năm học dự kiến trong chương trình đào tạo" })
    @IsOptional()
    @IsInt()
    @Min(1)
    namHocDuKien?: number;

    @ApiPropertyOptional({ example: true, description: "Học phần này là bắt buộc hay tự chọn" })
    @IsOptional()
    @IsBoolean()
    batBuoc?: boolean;

    @ApiPropertyOptional({ example: "TC1", description: "Tên nhóm tự chọn (nếu là học phần tự chọn)" })
    @IsOptional()
    @IsString()
    nhomTuChon?: string;

    @ApiPropertyOptional({ description: "Ghi chú thêm", example: "Học phần tiên quyết: CT176" })
    @IsOptional()
    @IsString()
    ghiChu?: string;
}
