import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function calculateTiLeHoanThanh(
  diem: Prisma.Decimal,
  trongSo: Prisma.Decimal
): Prisma.Decimal {
  if (trongSo.equals(0)) return new Prisma.Decimal(0);

  const ratio = diem.div(trongSo);

  if (ratio.lessThan(0)) return new Prisma.Decimal(0);
  if (ratio.greaterThan(1)) return new Prisma.Decimal(1);

  return ratio.toDecimalPlaces(4);
}

async function main() {
  const diemSos = await prisma.diemSo.findMany({
    include: {
      cachDanhGia: {
        select: {
          trongSo: true,
        },
      },
    },
  });

  for (const item of diemSos) {
    const tiLeHoanThanh = calculateTiLeHoanThanh(
      new Prisma.Decimal(item.diem),
      new Prisma.Decimal(item.cachDanhGia.trongSo)
    );

    await prisma.diemSo.update({
      where: { id: item.id },
      data: { tiLeHoanThanh },
    });
  }

  console.log("Backfill tiLeHoanThanh done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });