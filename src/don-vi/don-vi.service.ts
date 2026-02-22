import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonViDto } from './dto/create-don-vi.dto';
import { UpdateDonViDto } from './dto/update-don-vi.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DonViService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateDonViDto) {
    try {
      return await this.prisma.donVi.create({ data: dto });
    }
    catch(e: any){
      if (e?.code === "P2002") throw new ConflictException("maDonVi đã tồn tại");
      throw e;
    }
  }

  findAll() {
    return this.prisma.donVi.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(maDonVi: string) {
    const item = await this.prisma.donVi.findUnique({ where: { maDonVi } });
    if (!item) throw new NotFoundException("Không tìm thấy đơn vị");
    return item;
  }

  async update(maDonVi: string, dto: UpdateDonViDto) {
    await this.findOne(maDonVi);
    return this.prisma.donVi.update({ where: { maDonVi }, data: dto });
  }

  async remove(maDonVi: string) {
    await this.findOne(maDonVi);
    return this.prisma.donVi.delete({ where: { maDonVi } });
  }
}
