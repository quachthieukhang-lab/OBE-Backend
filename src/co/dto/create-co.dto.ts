import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCoDto {
  @ApiProperty({ example: "Sinh viên có khả năng áp dụng kiến thức...", description: "Nội dung chuẩn đầu ra môn học" })
  @IsString()
  noiDungChuanDauRa!: string;

  @ApiPropertyOptional({ example: "CO1", description: "Mã định danh CO (tùy chọn)" })
  @IsOptional()
  @IsString()
  code?: string; // CO1, CO2...
}