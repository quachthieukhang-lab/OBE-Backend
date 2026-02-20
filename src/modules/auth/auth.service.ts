import { UnauthorizedException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async signUp(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hash },
      select: { id: true, email: true, role: true },
    });
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { accessToken };
  }
}