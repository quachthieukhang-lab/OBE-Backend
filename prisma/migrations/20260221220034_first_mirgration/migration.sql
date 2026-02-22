-- CreateTable
CREATE TABLE "don_vi" (
    "ma_don_vi" TEXT NOT NULL,
    "ten_don_vi" TEXT NOT NULL,
    "loai_don_vi" TEXT NOT NULL,
    "email" TEXT,
    "so_dien_thoai" TEXT,
    "dia_chi" TEXT,
    "website" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "don_vi_pkey" PRIMARY KEY ("ma_don_vi")
);

-- CreateTable
CREATE TABLE "nien_khoa" (
    "khoa" INTEGER NOT NULL,
    "nam_bat_dau" INTEGER NOT NULL,
    "nam_ket_thuc" INTEGER,
    "ghi_chu" TEXT,

    CONSTRAINT "nien_khoa_pkey" PRIMARY KEY ("khoa")
);

-- CreateTable
CREATE TABLE "chuong_trinh_dao_tao" (
    "ma_so_nganh" TEXT NOT NULL,
    "ma_don_vi" TEXT NOT NULL,
    "ten_tieng_viet" TEXT NOT NULL,
    "ten_tieng_anh" TEXT,
    "truong_cap_bang" TEXT,
    "ten_goi_van_bang" TEXT,
    "trinh_do_dao_tao" TEXT NOT NULL,
    "so_tin_chi" INTEGER NOT NULL,
    "hinh_thuc_dao_tao" TEXT,
    "thoi_gian_dao_tao" TEXT,
    "thang_diem_danh_gia" TEXT,
    "phien_ban" TEXT,
    "ngay_ban_hanh" DATE,
    "ngay_ap_dung" DATE,
    "mo_ta" TEXT,
    "trang_thai" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chuong_trinh_dao_tao_pkey" PRIMARY KEY ("ma_so_nganh")
);

-- CreateTable
CREATE TABLE "chuong_trinh_dao_tao_nien_khoa" (
    "ma_so_nganh" TEXT NOT NULL,
    "khoa" INTEGER NOT NULL,
    "ngay_ap_dung" DATE,
    "ghi_chu" TEXT,
    "status" TEXT,

    CONSTRAINT "chuong_trinh_dao_tao_nien_khoa_pkey" PRIMARY KEY ("ma_so_nganh","khoa")
);

-- CreateTable
CREATE TABLE "hoc_phan" (
    "ma_hoc_phan" TEXT NOT NULL,
    "ma_don_vi" TEXT NOT NULL,
    "ten_hoc_phan" TEXT NOT NULL,
    "so_tin_chi" INTEGER NOT NULL,
    "loai_hoc_phan" TEXT,
    "mo_ta" TEXT,
    "so_tiet_ly_thuyet" INTEGER,
    "so_tiet_thuc_hanh" INTEGER,
    "ngon_ngu_giang_day" TEXT,
    "tai_lieu_tham_khao" TEXT,

    CONSTRAINT "hoc_phan_pkey" PRIMARY KEY ("ma_hoc_phan")
);

-- CreateTable
CREATE TABLE "chuong_trinh_dao_tao_hoc_phan" (
    "ma_so_nganh" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "hoc_ky_du_kien" INTEGER,
    "nam_hoc_du_kien" INTEGER,
    "bat_buoc" BOOLEAN NOT NULL DEFAULT true,
    "nhom_tu_chon" TEXT,
    "ghi_chu" TEXT,

    CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_pkey" PRIMARY KEY ("ma_so_nganh","ma_hoc_phan")
);

-- CreateTable
CREATE TABLE "plo" (
    "ma_plo" TEXT NOT NULL,
    "ma_so_nganh" TEXT NOT NULL,
    "noi_dung_chuan_dau_ra" TEXT NOT NULL,
    "code" TEXT,
    "nhom" TEXT,
    "muc_do" TEXT,
    "ghi_chu" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "plo_pkey" PRIMARY KEY ("ma_plo")
);

-- CreateTable
CREATE TABLE "clo" (
    "ma_clo" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "noi_dung_chuan_dau_ra" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "clo_pkey" PRIMARY KEY ("ma_clo")
);

-- CreateTable
CREATE TABLE "co" (
    "ma_co" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "noi_dung_chuan_dau_ra" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "co_pkey" PRIMARY KEY ("ma_co")
);

-- CreateTable
CREATE TABLE "cach_danh_gia" (
    "ma_cdg" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "cach_danh_gia" TEXT,
    "trong_so" DECIMAL(5,4) NOT NULL,
    "ten_thanh_phan" TEXT NOT NULL,
    "loai" TEXT,

    CONSTRAINT "cach_danh_gia_pkey" PRIMARY KEY ("ma_cdg")
);

-- CreateTable
CREATE TABLE "clo_plo_mapping" (
    "ma_plo" TEXT NOT NULL,
    "ma_clo" TEXT NOT NULL,
    "trong_so" DECIMAL(5,4) NOT NULL,
    "ghi_chu" TEXT,

    CONSTRAINT "clo_plo_mapping_pkey" PRIMARY KEY ("ma_plo","ma_clo")
);

-- CreateTable
CREATE TABLE "clo_co_mapping" (
    "ma_clo" TEXT NOT NULL,
    "ma_co" TEXT NOT NULL,
    "trong_so" DECIMAL(5,4) NOT NULL,
    "ghi_chu" TEXT,

    CONSTRAINT "clo_co_mapping_pkey" PRIMARY KEY ("ma_clo","ma_co")
);

-- CreateTable
CREATE TABLE "cdg_co_mapping" (
    "ma_cdg" TEXT NOT NULL,
    "ma_co" TEXT NOT NULL,
    "trong_so" DECIMAL(5,4) NOT NULL,
    "ghi_chu" TEXT,

    CONSTRAINT "cdg_co_mapping_pkey" PRIMARY KEY ("ma_cdg","ma_co")
);

-- CreateTable
CREATE TABLE "giang_vien" (
    "msgv" TEXT NOT NULL,
    "ma_don_vi" TEXT NOT NULL,
    "ho_ten" TEXT NOT NULL,
    "email" TEXT,
    "so_dien_thoai" TEXT,
    "hoc_vi" TEXT,
    "chuc_danh" TEXT,
    "bo_mon" TEXT,
    "ngay_sinh" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "giang_vien_pkey" PRIMARY KEY ("msgv")
);

-- CreateTable
CREATE TABLE "lop_hoc_phan" (
    "ma_lop_hoc_phan" TEXT NOT NULL,
    "msgv" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "khoa" INTEGER NOT NULL,
    "hoc_ky" INTEGER NOT NULL,
    "nhom" TEXT,
    "si_so_toi_da" INTEGER,
    "phong_hoc" TEXT,
    "lich_hoc" TEXT,
    "ngay_bat_dau" DATE,
    "ngay_ket_thuc" DATE,
    "status" TEXT,

    CONSTRAINT "lop_hoc_phan_pkey" PRIMARY KEY ("ma_lop_hoc_phan")
);

-- CreateTable
CREATE TABLE "sinh_vien" (
    "mssv" TEXT NOT NULL,
    "ma_don_vi" TEXT,
    "khoa" INTEGER,
    "ma_so_nganh" TEXT,
    "ho_ten" TEXT NOT NULL,
    "ngay_sinh" DATE,
    "gioi_tinh" TEXT,
    "email" TEXT,
    "so_dien_thoai" TEXT,
    "trang_thai_hoc_tap" TEXT,

    CONSTRAINT "sinh_vien_pkey" PRIMARY KEY ("mssv")
);

-- CreateTable
CREATE TABLE "dang_ky_hoc_phan" (
    "ma_dang_ky" TEXT NOT NULL,
    "ma_lop_hoc_phan" TEXT NOT NULL,
    "mssv" TEXT NOT NULL,
    "ngay_dang_ky" DATE,
    "trang_thai" TEXT,
    "lan_hoc" INTEGER,
    "ghi_chu" TEXT,

    CONSTRAINT "dang_ky_hoc_phan_pkey" PRIMARY KEY ("ma_dang_ky")
);

-- CreateTable
CREATE TABLE "diem_so" (
    "id" TEXT NOT NULL,
    "mssv" TEXT NOT NULL,
    "ma_cdg" TEXT NOT NULL,
    "ma_lop_hoc_phan" TEXT NOT NULL,
    "ma_dang_ky" TEXT NOT NULL,
    "diem" DECIMAL(5,2) NOT NULL,
    "lan_nhap" INTEGER DEFAULT 1,
    "msgv" TEXT,

    CONSTRAINT "diem_so_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" (
    "ma_ban_phan_cong" TEXT NOT NULL,
    "ma_so_nganh" TEXT NOT NULL,
    "ma_hoc_phan" TEXT NOT NULL,
    "msgv" TEXT NOT NULL,
    "vai_tro" TEXT NOT NULL,
    "trang_thai" TEXT NOT NULL,
    "deadline" DATE,
    "ghi_chu" TEXT,
    "assigned_at" TIMESTAMP(3),

    CONSTRAINT "ban_phan_cong_nhap_de_cuong_chi_tiet_hp_pkey" PRIMARY KEY ("ma_ban_phan_cong")
);

-- CreateIndex
CREATE UNIQUE INDEX "dang_ky_hoc_phan_ma_lop_hoc_phan_mssv_lan_hoc_key" ON "dang_ky_hoc_phan"("ma_lop_hoc_phan", "mssv", "lan_hoc");

-- CreateIndex
CREATE UNIQUE INDEX "diem_so_ma_dang_ky_ma_cdg_key" ON "diem_so"("ma_dang_ky", "ma_cdg");

-- AddForeignKey
ALTER TABLE "chuong_trinh_dao_tao" ADD CONSTRAINT "chuong_trinh_dao_tao_ma_don_vi_fkey" FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi"("ma_don_vi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chuong_trinh_dao_tao_nien_khoa" ADD CONSTRAINT "chuong_trinh_dao_tao_nien_khoa_ma_so_nganh_fkey" FOREIGN KEY ("ma_so_nganh") REFERENCES "chuong_trinh_dao_tao"("ma_so_nganh") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chuong_trinh_dao_tao_nien_khoa" ADD CONSTRAINT "chuong_trinh_dao_tao_nien_khoa_khoa_fkey" FOREIGN KEY ("khoa") REFERENCES "nien_khoa"("khoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoc_phan" ADD CONSTRAINT "hoc_phan_ma_don_vi_fkey" FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi"("ma_don_vi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chuong_trinh_dao_tao_hoc_phan" ADD CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_ma_so_nganh_fkey" FOREIGN KEY ("ma_so_nganh") REFERENCES "chuong_trinh_dao_tao"("ma_so_nganh") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chuong_trinh_dao_tao_hoc_phan" ADD CONSTRAINT "chuong_trinh_dao_tao_hoc_phan_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plo" ADD CONSTRAINT "plo_ma_so_nganh_fkey" FOREIGN KEY ("ma_so_nganh") REFERENCES "chuong_trinh_dao_tao"("ma_so_nganh") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clo" ADD CONSTRAINT "clo_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "co" ADD CONSTRAINT "co_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cach_danh_gia" ADD CONSTRAINT "cach_danh_gia_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clo_plo_mapping" ADD CONSTRAINT "clo_plo_mapping_ma_plo_fkey" FOREIGN KEY ("ma_plo") REFERENCES "plo"("ma_plo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clo_plo_mapping" ADD CONSTRAINT "clo_plo_mapping_ma_clo_fkey" FOREIGN KEY ("ma_clo") REFERENCES "clo"("ma_clo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clo_co_mapping" ADD CONSTRAINT "clo_co_mapping_ma_clo_fkey" FOREIGN KEY ("ma_clo") REFERENCES "clo"("ma_clo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clo_co_mapping" ADD CONSTRAINT "clo_co_mapping_ma_co_fkey" FOREIGN KEY ("ma_co") REFERENCES "co"("ma_co") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdg_co_mapping" ADD CONSTRAINT "cdg_co_mapping_ma_cdg_fkey" FOREIGN KEY ("ma_cdg") REFERENCES "cach_danh_gia"("ma_cdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cdg_co_mapping" ADD CONSTRAINT "cdg_co_mapping_ma_co_fkey" FOREIGN KEY ("ma_co") REFERENCES "co"("ma_co") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giang_vien" ADD CONSTRAINT "giang_vien_ma_don_vi_fkey" FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi"("ma_don_vi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lop_hoc_phan" ADD CONSTRAINT "lop_hoc_phan_msgv_fkey" FOREIGN KEY ("msgv") REFERENCES "giang_vien"("msgv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lop_hoc_phan" ADD CONSTRAINT "lop_hoc_phan_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lop_hoc_phan" ADD CONSTRAINT "lop_hoc_phan_khoa_fkey" FOREIGN KEY ("khoa") REFERENCES "nien_khoa"("khoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sinh_vien" ADD CONSTRAINT "sinh_vien_ma_don_vi_fkey" FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi"("ma_don_vi") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sinh_vien" ADD CONSTRAINT "sinh_vien_khoa_fkey" FOREIGN KEY ("khoa") REFERENCES "nien_khoa"("khoa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sinh_vien" ADD CONSTRAINT "sinh_vien_ma_so_nganh_fkey" FOREIGN KEY ("ma_so_nganh") REFERENCES "chuong_trinh_dao_tao"("ma_so_nganh") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dang_ky_hoc_phan" ADD CONSTRAINT "dang_ky_hoc_phan_ma_lop_hoc_phan_fkey" FOREIGN KEY ("ma_lop_hoc_phan") REFERENCES "lop_hoc_phan"("ma_lop_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dang_ky_hoc_phan" ADD CONSTRAINT "dang_ky_hoc_phan_mssv_fkey" FOREIGN KEY ("mssv") REFERENCES "sinh_vien"("mssv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diem_so" ADD CONSTRAINT "diem_so_mssv_fkey" FOREIGN KEY ("mssv") REFERENCES "sinh_vien"("mssv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diem_so" ADD CONSTRAINT "diem_so_ma_cdg_fkey" FOREIGN KEY ("ma_cdg") REFERENCES "cach_danh_gia"("ma_cdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diem_so" ADD CONSTRAINT "diem_so_ma_lop_hoc_phan_fkey" FOREIGN KEY ("ma_lop_hoc_phan") REFERENCES "lop_hoc_phan"("ma_lop_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diem_so" ADD CONSTRAINT "diem_so_ma_dang_ky_fkey" FOREIGN KEY ("ma_dang_ky") REFERENCES "dang_ky_hoc_phan"("ma_dang_ky") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diem_so" ADD CONSTRAINT "diem_so_msgv_fkey" FOREIGN KEY ("msgv") REFERENCES "giang_vien"("msgv") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" ADD CONSTRAINT "ban_phan_cong_nhap_de_cuong_chi_tiet_hp_ma_so_nganh_fkey" FOREIGN KEY ("ma_so_nganh") REFERENCES "chuong_trinh_dao_tao"("ma_so_nganh") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" ADD CONSTRAINT "ban_phan_cong_nhap_de_cuong_chi_tiet_hp_ma_hoc_phan_fkey" FOREIGN KEY ("ma_hoc_phan") REFERENCES "hoc_phan"("ma_hoc_phan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban_phan_cong_nhap_de_cuong_chi_tiet_hp" ADD CONSTRAINT "ban_phan_cong_nhap_de_cuong_chi_tiet_hp_msgv_fkey" FOREIGN KEY ("msgv") REFERENCES "giang_vien"("msgv") ON DELETE RESTRICT ON UPDATE CASCADE;
