/*
  Warnings:

  - You are about to drop the column `ma_hoc_phan` on the `cach_danh_gia` table. All the data in the column will be lost.
  - The primary key for the `chuong_trinh_dao_tao_hoc_phan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ma_hoc_phan` on the `clo` table. All the data in the column will be lost.
  - You are about to drop the column `ma_hoc_phan` on the `co` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[khoa,ma_don_vi]` on the table `cau_hinh_obe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `khoa` to the `ban_phan_cong_nhap_de_cuong_chi_tiet_hp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma_de_cuong` to the `cach_danh_gia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `khoa` to the `chuong_trinh_dao_tao_hoc_phan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma_de_cuong` to the `clo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma_de_cuong` to the `co` table without a default value. This is not possible if the table is not empty.
  - Added the required column `khoa` to the `plo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" DROP CONSTRAINT "ban_phan_cong_nhap_de_cuong_chi_tiet_hp_ma_so_nganh_fkey";

-- DropForeignKey
ALTER TABLE "cach_danh_gia" DROP CONSTRAINT "cach_danh_gia_ma_hoc_phan_fkey";

-- DropForeignKey
ALTER TABLE "chuong_trinh_dao_tao_hoc_phan" DROP CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_ma_so_nganh_fkey";

-- DropForeignKey
ALTER TABLE "clo" DROP CONSTRAINT "clo_ma_hoc_phan_fkey";

-- DropForeignKey
ALTER TABLE "co" DROP CONSTRAINT "co_ma_hoc_phan_fkey";

-- DropForeignKey
ALTER TABLE "plo" DROP CONSTRAINT "plo_ma_so_nganh_fkey";

-- DropIndex
DROP INDEX "cau_hinh_obe_khoa_key";

-- AlterTable
ALTER TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" ADD COLUMN     "khoa" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cach_danh_gia" DROP COLUMN "ma_hoc_phan",
ADD COLUMN     "ma_de_cuong" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "chuong_trinh_dao_tao_hoc_phan" DROP CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_pkey",
ADD COLUMN     "khoa" INTEGER NOT NULL,
ADD CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_pkey" PRIMARY KEY ("ma_so_nganh", "khoa", "ma_hoc_phan");

-- AlterTable
ALTER TABLE "clo" DROP COLUMN "ma_hoc_phan",
ADD COLUMN     "ma_de_cuong" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "co" DROP COLUMN "ma_hoc_phan",
ADD COLUMN     "ma_de_cuong" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lop_hoc_phan" ADD COLUMN     "ma_de_cuong" TEXT;

-- AlterTable
ALTER TABLE "plo" ADD COLUMN     "khoa" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "de_cuong_chi_tiet" (
    "ma_de_cuong" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "phien_ban" TEXT NOT NULL,
    "ngay_ap_dung" DATE,
    "trang_thai" TEXT NOT NULL DEFAULT 'draft',
    "ghi_chu" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "de_cuong_chi_tiet_pkey" PRIMARY KEY ("ma_de_cuong")
);

-- CreateIndex
CREATE UNIQUE INDEX "de_cuong_chi_tiet_ma_hoc_phan_phien_ban_key" ON "de_cuong_chi_tiet"("ma_hoc_phan", "phien_ban");

-- CreateIndex
CREATE UNIQUE INDEX "cau_hinh_obe_khoa_ma_don_vi_key" ON "cau_hinh_obe"("khoa", "ma_don_vi");

-- AddForeignKey
ALTER TABLE "de_cuong_chi_tiet" ADD CONSTRAINT "de_cuong_chi_tiet_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chuong_trinh_dao_tao_hoc_phan" ADD CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_ma_so_nganh_khoa_fkey" FOREIGN KEY ("ma_so_nganh", "khoa") REFERENCES "chuong_trinh_dao_tao_nien_khoa"("ma_so_nganh", "khoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plo" ADD CONSTRAINT "plo_ma_so_nganh_khoa_fkey" FOREIGN KEY ("ma_so_nganh", "khoa") REFERENCES "chuong_trinh_dao_tao_nien_khoa"("ma_so_nganh", "khoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clo" ADD CONSTRAINT "clo_ma_de_cuong_fkey" FOREIGN KEY ("ma_de_cuong") REFERENCES "de_cuong_chi_tiet"("ma_de_cuong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "co" ADD CONSTRAINT "co_ma_de_cuong_fkey" FOREIGN KEY ("ma_de_cuong") REFERENCES "de_cuong_chi_tiet"("ma_de_cuong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cach_danh_gia" ADD CONSTRAINT "cach_danh_gia_ma_de_cuong_fkey" FOREIGN KEY ("ma_de_cuong") REFERENCES "de_cuong_chi_tiet"("ma_de_cuong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lop_hoc_phan" ADD CONSTRAINT "lop_hoc_phan_ma_de_cuong_fkey" FOREIGN KEY ("ma_de_cuong") REFERENCES "de_cuong_chi_tiet"("ma_de_cuong") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" ADD CONSTRAINT "ban_phan_cong_nhap_de_cuong_chi_tiet_hp_ma_so_nganh_khoa_fkey" FOREIGN KEY ("ma_so_nganh", "khoa") REFERENCES "chuong_trinh_dao_tao_nien_khoa"("ma_so_nganh", "khoa") ON DELETE RESTRICT ON UPDATE CASCADE;
