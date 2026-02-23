/*
  Warnings:

  - You are about to drop the column `hinh_thuc_dao_tao` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `mo_ta` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_ap_dung` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_ban_hanh` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `phien_ban` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `so_tin_chi` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `thang_diem_danh_gia` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `thoi_gian_dao_tao` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `trang_thai` on the `chuong_trinh_dao_tao` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `chuong_trinh_dao_tao_nien_khoa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chuong_trinh_dao_tao" DROP COLUMN "hinh_thuc_dao_tao",
DROP COLUMN "mo_ta",
DROP COLUMN "ngay_ap_dung",
DROP COLUMN "ngay_ban_hanh",
DROP COLUMN "phien_ban",
DROP COLUMN "so_tin_chi",
DROP COLUMN "thang_diem_danh_gia",
DROP COLUMN "thoi_gian_dao_tao",
DROP COLUMN "trang_thai";

-- AlterTable
ALTER TABLE "chuong_trinh_dao_tao_nien_khoa" DROP COLUMN "status",
ADD COLUMN     "hinh_thuc_dao_tao" TEXT,
ADD COLUMN     "mo_ta" TEXT,
ADD COLUMN     "ngay_ban_hanh" DATE,
ADD COLUMN     "phien_ban" TEXT,
ADD COLUMN     "so_tin_chi" INTEGER,
ADD COLUMN     "thang_diem_danh_gia" TEXT,
ADD COLUMN     "thoi_gian_dao_tao" TEXT,
ADD COLUMN     "trang_thai" TEXT NOT NULL DEFAULT 'active';
