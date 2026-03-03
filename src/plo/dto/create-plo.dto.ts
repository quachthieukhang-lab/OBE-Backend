import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePloDto {
    @ApiProperty({ example: "Có khả năng áp dụng kiến thức toán học...", description: "Nội dung chuẩn đầu ra" })
    @IsString()
    noiDungChuanDauRa!: string;

    @ApiPropertyOptional({ example: "PLO1", description: "Mã PLO (ví dụ: PLO1, PLO2...)" })
    @IsOptional()
    @IsString()
    code?: string; // PLO1, PLO2...

    @ApiPropertyOptional({ example: "Kiến thức", description: "Nhóm PLO" })
    @IsOptional()
    @IsString()
    nhom?: string;

    @ApiPropertyOptional({ example: "3", description: "Mức độ" })
    @IsOptional()
    @IsString()
    mucDo?: string;

    @ApiPropertyOptional({ example: "Ghi chú thêm", description: "Ghi chú" })
    @IsOptional()
    @IsString()
    ghiChu?: string;

    @ApiPropertyOptional({ example: true, description: "Trạng thái hoạt động", default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}