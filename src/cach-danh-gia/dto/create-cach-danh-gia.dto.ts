import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateCachDanhGiaDto {
    @ApiPropertyOptional({ example: "Đánh giá quá trình", description: "Tên cách đánh giá" })
    @IsOptional()
    @IsString()
    cachDanhGia!: string;

    @ApiProperty({ example: "Kiểm tra giữa kỳ", description: "Tên thành phần đánh giá" })
    @IsString()
    tenThanhPhan!: string;

    @ApiPropertyOptional({ example: "Tự luận", description: "Loại hình đánh giá" })
    @IsOptional()
    @IsString()
    loai?: string;

    // Decimal: khuyên gửi string "0.1", "0.25"...
    @ApiProperty({ example: "0.3", description: "Trọng số (0.0 - 1.0)" })
    @Matches(/^(0(\.\d+)?|1(\.0+)?)$/, { message: "trongSo must be between 0 and 1" })
    trongSo!: string;
}