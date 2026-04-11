-- CreateTable
CREATE TABLE "cau_hinh_obe" (
    "id" TEXT NOT NULL,
    "nam_hoc" TEXT NOT NULL,
    "nguong_dat_ca_nhan" DECIMAL(5,4) NOT NULL,
    "kpi_lop_hoc" DECIMAL(5,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cau_hinh_obe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cau_hinh_obe_nam_hoc_key" ON "cau_hinh_obe"("nam_hoc");
