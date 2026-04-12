import { PartialType } from "@nestjs/swagger";
import { CreateLecturerSyllabusDto } from "./create-lecturer-syllabus.dto";

export class UpdateLecturerSyllabusDto extends PartialType(CreateLecturerSyllabusDto) {}
