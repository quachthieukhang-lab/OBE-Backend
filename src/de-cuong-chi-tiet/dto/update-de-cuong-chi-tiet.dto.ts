import { PartialType } from "@nestjs/swagger";
import { CreateDeCuongChiTietDto } from "./create-de-cuong-chi-tiet.dto";

export class UpdateDeCuongChiTietDto extends PartialType(CreateDeCuongChiTietDto) {}
