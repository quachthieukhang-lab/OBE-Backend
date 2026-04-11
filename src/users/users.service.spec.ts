import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertGiangVienExists(msgv: string) {
    const giangVien = await this.prisma.giangVien.findUnique({
      where: { MSGV: msgv },
      select: { MSGV: true, hoTen: true },
    });

    if (!giangVien) {
      throw new BadRequestException("GiangVien not found");
    }

    return giangVien;
  }

  private validateRoleMsgv(role: Role, msgv?: string | null) {
    if (role === Role.LECTURER && !msgv) {
      throw new BadRequestException("LECTURER account must have msgv");
    }

    if (role !== Role.LECTURER && msgv) {
      throw new BadRequestException("Only LECTURER account can link to msgv");
    }
  }

  async create(dto: CreateUserDto) {
    this.validateRoleMsgv(dto.role, dto.msgv);

    if (dto.msgv) {
      await this.assertGiangVienExists(dto.msgv);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
          msgv: dto.msgv ?? null,
        },
        include: {
          giangVien: {
            select: {
              MSGV: true,
              hoTen: true,
              maDonVi: true,
            },
          },
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("Email or msgv already exists");
        }
      }
      throw e;
    }
  }

  async findAll(params?: { role?: Role; q?: string }) {
    const where: Prisma.UserWhereInput = {
      ...(params?.role ? { role: params.role } : {}),
      ...(params?.q
        ? {
            OR: [
              { email: { contains: params.q, mode: "insensitive" } },
              { msgv: { contains: params.q, mode: "insensitive" } },
              {
                giangVien: {
                  hoTen: { contains: params.q, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        giangVien: {
          select: {
            MSGV: true,
            hoTen: true,
            maDonVi: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        giangVien: {
          select: {
            MSGV: true,
            hoTen: true,
            maDonVi: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const current = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!current) {
      throw new NotFoundException("User not found");
    }

    const nextRole = dto.role ?? current.role;
    const nextMsgv =
      dto.msgv !== undefined ? dto.msgv : current.msgv;

    this.validateRoleMsgv(nextRole, nextMsgv);

    if (nextMsgv) {
      await this.assertGiangVienExists(nextMsgv);
    }

    const data: Prisma.UserUpdateInput = {
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.role !== undefined ? { role: dto.role } : {}),
      ...(dto.msgv !== undefined ? { msgv: dto.msgv } : {}),
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        include: {
          giangVien: {
            select: {
              MSGV: true,
              hoTen: true,
              maDonVi: true,
            },
          },
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new BadRequestException("Email or msgv already exists");
        }
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}