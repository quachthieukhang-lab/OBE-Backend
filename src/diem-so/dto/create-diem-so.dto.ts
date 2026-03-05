import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateDiemSoDto {
    @ApiProperty({ example: "CDG001", description: "Mã cách đánh giá (FK)" })
    @IsString()
    maCDG!: string;

    // Decimal: khuyên gửi string "0.00" -> "10.00" (tuỳ thang điểm của bạn)
    @ApiProperty({ example: "8.5", description: "Điểm số (dạng chuỗi số thực)" })
    @Matches(/^\d+(\.\d{1,2})?$/, { message: "diem must be a number with up to 2 decimals" })
    diem!: string;

    // người nhập/sửa (giảng viên)
    @ApiPropertyOptional({ example: "00123", description: "Mã số giảng viên nhập điểm (FK)" })
    @IsOptional()
    @IsString()
    MSGV?: string;
}