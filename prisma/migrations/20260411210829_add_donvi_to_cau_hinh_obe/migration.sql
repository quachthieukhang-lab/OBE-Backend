/*
  Warnings:

  - You are about to drop the column `nam_hoc` on the `cau_hinh_obe` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[khoa]` on the table `cau_hinh_obe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `khoa` to the `cau_hinh_obe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma_don_vi` to the `cau_hinh_obe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cau_hinh_obe_nam_hoc_key";

-- AlterTable
ALTER TABLE "cau_hinh_obe" DROP COLUMN "nam_hoc",
ADD COLUMN     "khoa" INTEGER NOT NULL,
ADD COLUMN     "ma_don_vi" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LECTURER',
    "msgv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_msgv_key" ON "user"("msgv");

-- CreateIndex
CREATE UNIQUE INDEX "cau_hinh_obe_khoa_key" ON "cau_hinh_obe"("khoa");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_msgv_fkey" FOREIGN KEY ("msgv") REFERENCES "giang_vien"("msgv") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cau_hinh_obe" ADD CONSTRAINT "cau_hinh_obe_khoa_fkey" FOREIGN KEY ("khoa") REFERENCES "nien_khoa"("khoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cau_hinh_obe" ADD CONSTRAINT "cau_hinh_obe_ma_don_vi_fkey" FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi"("ma_don_vi") ON DELETE RESTRICT ON UPDATE CASCADE;
