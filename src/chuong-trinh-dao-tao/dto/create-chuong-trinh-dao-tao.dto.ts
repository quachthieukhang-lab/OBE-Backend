import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateChuongTrinhDaoTaoDto {
  @ApiProperty({ example: "7480201", description: "Mã số ngành đào tạo" })
  @IsString()
  maSoNganh!: string;

  @ApiProperty({ example: "CNTT_TT", description: "Mã đơn vị quản lý (FK)" })
  @IsString()
  maDonVi!: string; // FK -> DonVi.maDonVi

  @ApiProperty({ example: "Công nghệ thông tin", description: "Tên chương trình (Tiếng Việt)" })
  @IsString()
  tenTiengViet!: string;

  @ApiPropertyOptional({ example: "Information Technology", description: "Tên chương trình (Tiếng Anh)" })
  @IsOptional()
  @IsString()
  tenTiengAnh?: string;

  @ApiPropertyOptional({ example: "Trường Đại học Cần Thơ", description: "Trường cấp bằng" })
  @IsOptional()
  @IsString()
  truongCapBang?: string;

  @ApiPropertyOptional({ example: "Cử nhân", description: "Tên gọi văn bằng" })
  @IsOptional()
  @IsString()
  tenGoiVanBang?: string;

  @ApiProperty({ example: "Đại học", description: "Trình độ đào tạo" })
  @IsString()
  trinhDoDaoTao!: string;
}