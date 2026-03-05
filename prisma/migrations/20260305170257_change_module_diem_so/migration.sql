/*
  Warnings:

  - You are about to drop the column `lan_nhap` on the `diem_so` table. All the data in the column will be lost.
  - The `gioi_tinh` column on the `giang_vien` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gioi_tinh` column on the `sinh_vien` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_at` to the `diem_so` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Nam', 'Nữ');

-- AlterTable
ALTER TABLE "diem_so" DROP COLUMN "lan_nhap",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "giang_vien" DROP COLUMN "gioi_tinh",
ADD COLUMN     "gioi_tinh" "Gender" DEFAULT 'Nam';

-- AlterTable
ALTER TABLE "sinh_vien" DROP COLUMN "gioi_tinh",
ADD COLUMN     "gioi_tinh" "Gender" DEFAULT 'Nam';
