import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpdateAssignmentStatusDto {
  @ApiProperty({
    example: "in_progress",
    description: "Trạng thái mới: assigned | in_progress | completed",
  })
  @IsString()
  @IsIn(["assigned", "in_progress", "completed"])
  trangThai!: string;
}
