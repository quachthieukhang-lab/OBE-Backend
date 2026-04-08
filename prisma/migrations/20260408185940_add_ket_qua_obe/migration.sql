-- CreateTable
CREATE TABLE "ket_qua_co" (
    "id" TEXT NOT NULL,
    "mssv" TEXT NOT NULL,
    "ma_co" TEXT NOT NULL,
    "ma_lop_hoc_phan" TEXT NOT NULL,
    "ti_le_dat" DECIMAL(5,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ket_qua_co_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ket_qua_clo" (
    "id" TEXT NOT NULL,
    "mssv" TEXT NOT NULL,
    "ma_clo" TEXT NOT NULL,
    "ma_lop_hoc_phan" TEXT NOT NULL,
    "ti_le_dat" DECIMAL(5,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ket_qua_clo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ket_qua_plo" (
    "id" TEXT NOT NULL,
    "mssv" TEXT NOT NULL,
    "ma_plo" TEXT NOT NULL,
    "ti_le_dat" DECIMAL(5,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ket_qua_plo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ket_qua_co_mssv_ma_co_ma_lop_hoc_phan_key" ON "ket_qua_co"("mssv", "ma_co", "ma_lop_hoc_phan");

-- CreateIndex
CREATE UNIQUE INDEX "ket_qua_clo_mssv_ma_clo_ma_lop_hoc_phan_key" ON "ket_qua_clo"("mssv", "ma_clo", "ma_lop_hoc_phan");

-- CreateIndex
CREATE UNIQUE INDEX "ket_qua_plo_mssv_ma_plo_key" ON "ket_qua_plo"("mssv", "ma_plo");

-- AddForeignKey
ALTER TABLE "ket_qua_co" ADD CONSTRAINT "ket_qua_co_mssv_fkey" FOREIGN KEY ("mssv") REFERENCES "sinh_vien"("mssv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_co" ADD CONSTRAINT "ket_qua_co_ma_co_fkey" FOREIGN KEY ("ma_co") REFERENCES "co"("ma_co") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_co" ADD CONSTRAINT "ket_qua_co_ma_lop_hoc_phan_fkey" FOREIGN KEY ("ma_lop_hoc_phan") REFERENCES "lop_hoc_phan"("ma_lop_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_clo" ADD CONSTRAINT "ket_qua_clo_mssv_fkey" FOREIGN KEY ("mssv") REFERENCES "sinh_vien"("mssv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_clo" ADD CONSTRAINT "ket_qua_clo_ma_clo_fkey" FOREIGN KEY ("ma_clo") REFERENCES "clo"("ma_clo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_clo" ADD CONSTRAINT "ket_qua_clo_ma_lop_hoc_phan_fkey" FOREIGN KEY ("ma_lop_hoc_phan") REFERENCES "lop_hoc_phan"("ma_lop_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_plo" ADD CONSTRAINT "ket_qua_plo_mssv_fkey" FOREIGN KEY ("mssv") REFERENCES "sinh_vien"("mssv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ket_qua_plo" ADD CONSTRAINT "ket_qua_plo_ma_plo_fkey" FOREIGN KEY ("ma_plo") REFERENCES "plo"("ma_plo") ON DELETE RESTRICT ON UPDATE CASCADE;
