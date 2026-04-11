import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  msgv?: string;
}