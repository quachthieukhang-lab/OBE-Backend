import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateNienKhoaDto {
  @ApiProperty({ example: 46, description: "Khóa học (số nguyên)" })
    @IsInt()
    @Min(1)
    khoa!: number;

  @ApiProperty({ example: 2023, description: "Năm bắt đầu" })
    @IsInt()
    @Min(1900)
    namBatDau!: number;

  @ApiProperty({ example: 2027, description: "Năm kết thúc (tùy chọn)" })
    @IsInt()
    @Min(1900)
    namKetThuc?: number;

  @ApiPropertyOptional({ example: "Ghi chú cho khóa 46" })
    @IsOptional()
    @IsString()
    ghiChu?: string;
}