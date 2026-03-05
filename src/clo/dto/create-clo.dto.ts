import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCloDto {
  @ApiProperty({ example: "Sinh viên có khả năng áp dụng kiến thức...", description: "Nội dung chuẩn đầu ra học phần" })
  @IsString()
  noiDungChuanDauRa!: string;

  @ApiPropertyOptional({ example: "CLO1", description: "Mã định danh CLO (tùy chọn)" })
  @IsOptional()
  @IsString()
  code?: string; // CLO1, CLO2...
}