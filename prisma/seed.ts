import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── 1. Đơn vị ──
  const donVi = await prisma.donVi.create({
    data: {
      maDonVi: "CNTT",
      tenDonVi: "Khoa Công nghệ Thông tin & Truyền thông",
      loaiDonVi: "Khoa",
      email: "cntt@ctu.edu.vn",
      website: "https://cit.ctu.edu.vn",
    },
  });
  console.log("  + DonVi:", donVi.maDonVi);

  // ── 2. Niên khóa ──
  const nienKhoa46 = await prisma.nienKhoa.create({
    data: { khoa: 46, namBatDau: 2022, namKetThuc: 2026 },
  });
  const nienKhoa48 = await prisma.nienKhoa.create({
    data: { khoa: 48, namBatDau: 2024, namKetThuc: 2028 },
  });
  console.log("  + NienKhoa: K46, K48");

  // ── 3. Chương trình đào tạo ──
  const ctdt = await prisma.chuongTrinhDaoTao.create({
    data: {
      maSoNganh: "7480201",
      maDonVi: "CNTT",
      tenTiengViet: "Công nghệ thông tin",
      tenTiengAnh: "Information Technology",
      trinhDoDaoTao: "Đại học",
      truongCapBang: "Trường Đại học Cần Thơ",
    },
  });
  console.log("  + CTDT:", ctdt.maSoNganh);

  // ── 4. CTDT - Niên khóa ──
  await prisma.chuongTrinhDaoTaoNienKhoa.createMany({
    data: [
      {
        maSoNganh: "7480201",
        khoa: 46,
        soTinChi: 138,
        hinhThucDaoTao: "Chính quy",
        trangThai: "active",
        phienBan: "2022-v1",
      },
      {
        maSoNganh: "7480201",
        khoa: 48,
        soTinChi: 140,
        hinhThucDaoTao: "Chính quy",
        trangThai: "active",
        phienBan: "2024-v1",
      },
    ],
  });
  console.log("  + CTDT-NienKhoa: K46, K48");

  // ── 5. Học phần ──
  await prisma.hocPhan.createMany({
    data: [
      { maHocPhan: "CT101", maDonVi: "CNTT", tenHocPhan: "Lập trình căn bản A", soTinChi: 3, soTietLyThuyet: 30, soTietThucHanh: 30 },
      { maHocPhan: "CT174", maDonVi: "CNTT", tenHocPhan: "Phân tích thiết kế hệ thống thông tin", soTinChi: 3, soTietLyThuyet: 30, soTietThucHanh: 30 },
      { maHocPhan: "CT243", maDonVi: "CNTT", tenHocPhan: "Đảm bảo chất lượng và Kiểm thử phần mềm", soTinChi: 3, soTietLyThuyet: 30, soTietThucHanh: 30 },
      { maHocPhan: "CT275", maDonVi: "CNTT", tenHocPhan: "Công nghệ phần mềm", soTinChi: 3, soTietLyThuyet: 30, soTietThucHanh: 30 },
    ],
  });
  console.log("  + HocPhan: CT101, CT174, CT243, CT275");

  // ── 6. CTDT - Học phần (gán HP vào khung chương trình) ──
  const ctdtHpData: Prisma.ChuongTrinhDaoTaoHocPhanCreateManyInput[] = [
    { maSoNganh: "7480201", khoa: 46, maHocPhan: "CT101", hocKyDuKien: 1, batBuoc: true },
    { maSoNganh: "7480201", khoa: 46, maHocPhan: "CT174", hocKyDuKien: 4, batBuoc: true },
    { maSoNganh: "7480201", khoa: 46, maHocPhan: "CT243", hocKyDuKien: 6, batBuoc: true },
    { maSoNganh: "7480201", khoa: 46, maHocPhan: "CT275", hocKyDuKien: 5, batBuoc: true },
    { maSoNganh: "7480201", khoa: 48, maHocPhan: "CT101", hocKyDuKien: 1, batBuoc: true },
    { maSoNganh: "7480201", khoa: 48, maHocPhan: "CT174", hocKyDuKien: 4, batBuoc: true },
    { maSoNganh: "7480201", khoa: 48, maHocPhan: "CT243", hocKyDuKien: 6, batBuoc: true },
    { maSoNganh: "7480201", khoa: 48, maHocPhan: "CT275", hocKyDuKien: 5, batBuoc: true },
  ];
  await prisma.chuongTrinhDaoTaoHocPhan.createMany({ data: ctdtHpData });
  console.log("  + CTDT-HocPhan: 8 records");

  // ── 7. PLO ──
  const ploK46 = await prisma.pLO.createManyAndReturn({
    data: [
      { maSoNganh: "7480201", khoa: 46, code: "PLO1", noiDungChuanDauRa: "Áp dụng kiến thức toán học, khoa học và kỹ thuật", nhom: "Kiến thức" },
      { maSoNganh: "7480201", khoa: 46, code: "PLO2", noiDungChuanDauRa: "Phân tích vấn đề và thiết kế giải pháp CNTT", nhom: "Kỹ năng" },
      { maSoNganh: "7480201", khoa: 46, code: "PLO3", noiDungChuanDauRa: "Lập trình, kiểm thử và bảo trì phần mềm", nhom: "Kỹ năng" },
      { maSoNganh: "7480201", khoa: 46, code: "PLO4", noiDungChuanDauRa: "Làm việc nhóm và giao tiếp hiệu quả", nhom: "Thái độ" },
    ],
  });
  console.log("  + PLO K46:", ploK46.length, "records");

  // ── 8. Đề cương chi tiết (versioning) ──
  const dcCT243_k46 = await prisma.deCuongChiTiet.create({
    data: { maHocPhan: "CT243", phienBan: "2022-v1", trangThai: "active", ghiChu: "Đề cương cho khóa 46" },
  });
  const dcCT243_k48 = await prisma.deCuongChiTiet.create({
    data: { maHocPhan: "CT243", phienBan: "2024-v1", trangThai: "active", ghiChu: "Đề cương cập nhật cho khóa 48" },
  });
  const dcCT275 = await prisma.deCuongChiTiet.create({
    data: { maHocPhan: "CT275", phienBan: "2022-v1", trangThai: "active" },
  });
  const dcCT101 = await prisma.deCuongChiTiet.create({
    data: { maHocPhan: "CT101", phienBan: "2022-v1", trangThai: "active" },
  });
  console.log("  + DeCuongChiTiet: 4 records (CT243 has 2 versions!)");

  // ── 9. CLO cho CT243 K46 ──
  const closK46 = await prisma.cLO.createManyAndReturn({
    data: [
      { maDeCuong: dcCT243_k46.maDeCuong, code: "CLO1", noiDungChuanDauRa: "Hiểu các khái niệm về đảm bảo chất lượng phần mềm" },
      { maDeCuong: dcCT243_k46.maDeCuong, code: "CLO2", noiDungChuanDauRa: "Áp dụng kỹ thuật kiểm thử hộp trắng và hộp đen" },
      { maDeCuong: dcCT243_k46.maDeCuong, code: "CLO3", noiDungChuanDauRa: "Thiết kế và thực thi test case cho hệ thống phần mềm" },
    ],
  });

  // ── 10. CLO cho CT243 K48 (đề cương mới - thêm CLO4) ──
  const closK48 = await prisma.cLO.createManyAndReturn({
    data: [
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CLO1", noiDungChuanDauRa: "Hiểu các khái niệm về đảm bảo chất lượng phần mềm" },
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CLO2", noiDungChuanDauRa: "Áp dụng kỹ thuật kiểm thử hộp trắng và hộp đen" },
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CLO3", noiDungChuanDauRa: "Thiết kế và thực thi test case cho hệ thống phần mềm" },
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CLO4", noiDungChuanDauRa: "Sử dụng công cụ kiểm thử tự động (Selenium, Jest)" },
    ],
  });
  console.log("  + CLO: K46=3, K48=4 (K48 thêm CLO4 mới)");

  // ── 11. CO cho CT243 K46 ──
  const cosK46 = await prisma.cO.createManyAndReturn({
    data: [
      { maDeCuong: dcCT243_k46.maDeCuong, code: "CO1", noiDungChuanDauRa: "Trình bày được các nguyên lý ĐBCLPM" },
      { maDeCuong: dcCT243_k46.maDeCuong, code: "CO2", noiDungChuanDauRa: "Thực hiện kiểm thử đơn vị và tích hợp" },
      { maDeCuong: dcCT243_k46.maDeCuong, code: "CO3", noiDungChuanDauRa: "Viết test case theo các kỹ thuật thiết kế" },
    ],
  });

  const cosK48 = await prisma.cO.createManyAndReturn({
    data: [
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CO1", noiDungChuanDauRa: "Trình bày được các nguyên lý ĐBCLPM" },
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CO2", noiDungChuanDauRa: "Thực hiện kiểm thử đơn vị và tích hợp" },
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CO3", noiDungChuanDauRa: "Viết test case theo các kỹ thuật thiết kế" },
      { maDeCuong: dcCT243_k48.maDeCuong, code: "CO4", noiDungChuanDauRa: "Sử dụng framework kiểm thử tự động" },
    ],
  });
  console.log("  + CO: K46=3, K48=4");

  // ── 12. Cách đánh giá cho CT243 K46 (tổng trọng số = 1.0) ──
  const cdgsK46 = await prisma.cachDanhGia.createManyAndReturn({
    data: [
      { maDeCuong: dcCT243_k46.maDeCuong, tenThanhPhan: "Thực hành", cachDanhGia: "Bài thực hành trên lớp", trongSo: new Prisma.Decimal("0.15"), loai: "Quá trình" },
      { maDeCuong: dcCT243_k46.maDeCuong, tenThanhPhan: "Đồ án kiểm thử", cachDanhGia: "Đồ án nhóm", trongSo: new Prisma.Decimal("0.15"), loai: "Quá trình" },
      { maDeCuong: dcCT243_k46.maDeCuong, tenThanhPhan: "Giữa kỳ", cachDanhGia: "Tự luận + trắc nghiệm", trongSo: new Prisma.Decimal("0.20"), loai: "Giữa kỳ" },
      { maDeCuong: dcCT243_k46.maDeCuong, tenThanhPhan: "Cuối kỳ", cachDanhGia: "Tự luận", trongSo: new Prisma.Decimal("0.50"), loai: "Cuối kỳ" },
    ],
  });

  // ── 13. Cách đánh giá cho CT243 K48 (khác K46: bỏ đồ án, thêm bài tập tự động) ──
  const cdgsK48 = await prisma.cachDanhGia.createManyAndReturn({
    data: [
      { maDeCuong: dcCT243_k48.maDeCuong, tenThanhPhan: "Thực hành", cachDanhGia: "Bài thực hành trên lớp", trongSo: new Prisma.Decimal("0.20"), loai: "Quá trình" },
      { maDeCuong: dcCT243_k48.maDeCuong, tenThanhPhan: "Bài tập kiểm thử tự động", cachDanhGia: "CI/CD pipeline", trongSo: new Prisma.Decimal("0.10"), loai: "Quá trình" },
      { maDeCuong: dcCT243_k48.maDeCuong, tenThanhPhan: "Giữa kỳ", cachDanhGia: "Trắc nghiệm online", trongSo: new Prisma.Decimal("0.20"), loai: "Giữa kỳ" },
      { maDeCuong: dcCT243_k48.maDeCuong, tenThanhPhan: "Cuối kỳ", cachDanhGia: "Tự luận + thực hành máy", trongSo: new Prisma.Decimal("0.50"), loai: "Cuối kỳ" },
    ],
  });
  console.log("  + CachDanhGia: K46=4, K48=4 (cấu trúc khác nhau!)");

  // ── 14. Mapping CLO-CO (K46) ──
  await prisma.cloCoMapping.createMany({
    data: [
      { maCLO: closK46[0].maCLO, maCO: cosK46[0].maCO, trongSo: new Prisma.Decimal("1.0") },
      { maCLO: closK46[1].maCLO, maCO: cosK46[1].maCO, trongSo: new Prisma.Decimal("0.6") },
      { maCLO: closK46[1].maCLO, maCO: cosK46[2].maCO, trongSo: new Prisma.Decimal("0.4") },
      { maCLO: closK46[2].maCLO, maCO: cosK46[2].maCO, trongSo: new Prisma.Decimal("1.0") },
    ],
  });
  console.log("  + CloCoMapping K46: 4 records");

  // ── 15. Mapping CDG-CO (K46) ──
  await prisma.cdgCoMapping.createMany({
    data: [
      { maCDG: cdgsK46[0].maCDG, maCO: cosK46[1].maCO, trongSo: new Prisma.Decimal("0.5") },
      { maCDG: cdgsK46[0].maCDG, maCO: cosK46[2].maCO, trongSo: new Prisma.Decimal("0.5") },
      { maCDG: cdgsK46[1].maCDG, maCO: cosK46[2].maCO, trongSo: new Prisma.Decimal("1.0") },
      { maCDG: cdgsK46[2].maCDG, maCO: cosK46[0].maCO, trongSo: new Prisma.Decimal("0.5") },
      { maCDG: cdgsK46[2].maCDG, maCO: cosK46[1].maCO, trongSo: new Prisma.Decimal("0.5") },
      { maCDG: cdgsK46[3].maCDG, maCO: cosK46[0].maCO, trongSo: new Prisma.Decimal("0.4") },
      { maCDG: cdgsK46[3].maCDG, maCO: cosK46[1].maCO, trongSo: new Prisma.Decimal("0.3") },
      { maCDG: cdgsK46[3].maCDG, maCO: cosK46[2].maCO, trongSo: new Prisma.Decimal("0.3") },
    ],
  });
  console.log("  + CdgCoMapping K46: 8 records");

  // ── 16. Mapping CLO-PLO (K46) ──
  await prisma.cloPloMapping.createMany({
    data: [
      { maCLO: closK46[0].maCLO, maPLO: ploK46[0].maPLO, trongSo: new Prisma.Decimal("0.5") },
      { maCLO: closK46[0].maCLO, maPLO: ploK46[2].maPLO, trongSo: new Prisma.Decimal("0.5") },
      { maCLO: closK46[1].maCLO, maPLO: ploK46[1].maPLO, trongSo: new Prisma.Decimal("0.4") },
      { maCLO: closK46[1].maCLO, maPLO: ploK46[2].maPLO, trongSo: new Prisma.Decimal("0.6") },
      { maCLO: closK46[2].maCLO, maPLO: ploK46[2].maPLO, trongSo: new Prisma.Decimal("0.7") },
      { maCLO: closK46[2].maCLO, maPLO: ploK46[3].maPLO, trongSo: new Prisma.Decimal("0.3") },
    ],
  });
  console.log("  + CloPloMapping K46: 6 records");

  // ── 17. Giảng viên ──
  await prisma.giangVien.createMany({
    data: [
      { MSGV: "GV001", maDonVi: "CNTT", hoTen: "Nguyễn Văn An", email: "nvan@ctu.edu.vn", hocVi: "TS", chucDanh: "Giảng viên chính", boMon: "Công nghệ phần mềm" },
      { MSGV: "GV002", maDonVi: "CNTT", hoTen: "Trần Thị Bình", email: "ttbinh@ctu.edu.vn", hocVi: "ThS", chucDanh: "Giảng viên", boMon: "Hệ thống thông tin", gioiTinh: "Nữ" },
    ],
  });
  console.log("  + GiangVien: GV001, GV002");

  // ── 18. User (admin + giảng viên) ──
  const hashedPw = await bcrypt.hash("123456", 10);
  await prisma.user.createMany({
    data: [
      { email: "admin@ctu.edu.vn", password: hashedPw, role: "ADMIN" },
      { email: "nvan@ctu.edu.vn", password: hashedPw, role: "LECTURER", msgv: "GV001" },
      { email: "ttbinh@ctu.edu.vn", password: hashedPw, role: "LECTURER", msgv: "GV002" },
    ],
  });
  console.log("  + User: admin, GV001, GV002 (password: 123456)");

  // ── 19. Sinh viên K46 ──
  await prisma.sinhVien.createMany({
    data: [
      { MSSV: "B2012345", maDonVi: "CNTT", khoa: 46, maSoNganh: "7480201", hoTen: "Lê Minh Tuấn", email: "b2012345@student.ctu.edu.vn", trangThaiHocTap: "Đang học" },
      { MSSV: "B2012346", maDonVi: "CNTT", khoa: 46, maSoNganh: "7480201", hoTen: "Phạm Thị Hoa", gioiTinh: "Nữ", email: "b2012346@student.ctu.edu.vn", trangThaiHocTap: "Đang học" },
      { MSSV: "B2012347", maDonVi: "CNTT", khoa: 46, maSoNganh: "7480201", hoTen: "Trần Văn Dũng", email: "b2012347@student.ctu.edu.vn", trangThaiHocTap: "Đang học" },
    ],
  });
  console.log("  + SinhVien K46: 3 students");

  // ── 20. Lớp học phần CT243 K46 (gắn đề cương K46!) ──
  await prisma.lopHocPhan.create({
    data: {
      maLopHocPhan: "CT243-K46-01",
      MSGV: "GV001",
      maHocPhan: "CT243",
      maDeCuong: dcCT243_k46.maDeCuong,
      khoa: 46,
      hocKy: 6,
      nhom: "01",
      siSoToiDa: 50,
      status: "open",
    },
  });
  console.log("  + LopHocPhan: CT243-K46-01 (uses DeCuong 2022-v1)");

  // ── 21. Đăng ký học phần ──
  const dk1 = await prisma.dangKyHocPhan.create({
    data: { maLopHocPhan: "CT243-K46-01", MSSV: "B2012345", lanHoc: 1, trangThai: "enrolled" },
  });
  const dk2 = await prisma.dangKyHocPhan.create({
    data: { maLopHocPhan: "CT243-K46-01", MSSV: "B2012346", lanHoc: 1, trangThai: "enrolled" },
  });
  const dk3 = await prisma.dangKyHocPhan.create({
    data: { maLopHocPhan: "CT243-K46-01", MSSV: "B2012347", lanHoc: 1, trangThai: "enrolled" },
  });
  console.log("  + DangKyHocPhan: 3 enrollments");

  // ── 22. Điểm số (sinh viên 1: giỏi, SV2: khá, SV3: trung bình) ──
  const scoreData = [
    // SV1 - Lê Minh Tuấn (giỏi)
    { maDangKy: dk1.maDangKy, MSSV: "B2012345", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[0].maCDG, diem: "0.13", tiLeHoanThanh: "0.8667", MSGV: "GV001" },
    { maDangKy: dk1.maDangKy, MSSV: "B2012345", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[1].maCDG, diem: "0.14", tiLeHoanThanh: "0.9333", MSGV: "GV001" },
    { maDangKy: dk1.maDangKy, MSSV: "B2012345", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[2].maCDG, diem: "0.17", tiLeHoanThanh: "0.8500", MSGV: "GV001" },
    { maDangKy: dk1.maDangKy, MSSV: "B2012345", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[3].maCDG, diem: "0.42", tiLeHoanThanh: "0.8400", MSGV: "GV001" },
    // SV2 - Phạm Thị Hoa (khá)
    { maDangKy: dk2.maDangKy, MSSV: "B2012346", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[0].maCDG, diem: "0.10", tiLeHoanThanh: "0.6667", MSGV: "GV001" },
    { maDangKy: dk2.maDangKy, MSSV: "B2012346", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[1].maCDG, diem: "0.11", tiLeHoanThanh: "0.7333", MSGV: "GV001" },
    { maDangKy: dk2.maDangKy, MSSV: "B2012346", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[2].maCDG, diem: "0.14", tiLeHoanThanh: "0.7000", MSGV: "GV001" },
    { maDangKy: dk2.maDangKy, MSSV: "B2012346", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[3].maCDG, diem: "0.35", tiLeHoanThanh: "0.7000", MSGV: "GV001" },
    // SV3 - Trần Văn Dũng (trung bình)
    { maDangKy: dk3.maDangKy, MSSV: "B2012347", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[0].maCDG, diem: "0.08", tiLeHoanThanh: "0.5333", MSGV: "GV001" },
    { maDangKy: dk3.maDangKy, MSSV: "B2012347", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[1].maCDG, diem: "0.07", tiLeHoanThanh: "0.4667", MSGV: "GV001" },
    { maDangKy: dk3.maDangKy, MSSV: "B2012347", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[2].maCDG, diem: "0.10", tiLeHoanThanh: "0.5000", MSGV: "GV001" },
    { maDangKy: dk3.maDangKy, MSSV: "B2012347", maLopHocPhan: "CT243-K46-01", maCDG: cdgsK46[3].maCDG, diem: "0.25", tiLeHoanThanh: "0.5000", MSGV: "GV001" },
  ];

  await prisma.diemSo.createMany({
    data: scoreData.map((s) => ({
      ...s,
      diem: new Prisma.Decimal(s.diem),
      tiLeHoanThanh: new Prisma.Decimal(s.tiLeHoanThanh),
    })),
  });
  console.log("  + DiemSo: 12 scores (3 students x 4 assessments)");

  // ── 23. Cấu hình OBE ──
  await prisma.cauHinhOBE.create({
    data: {
      khoa: 46,
      maDonVi: "CNTT",
      nguongDatCaNhan: new Prisma.Decimal("0.5"),
      kpiLopHoc: new Prisma.Decimal("0.7"),
    },
  });
  console.log("  + CauHinhOBE: nguongDat=0.5, kpiLop=0.7");

  // ── 24. Phân công nhập đề cương ──
  await prisma.banPhanCongNhapDeCuongChiTietHP.create({
    data: {
      maSoNganh: "7480201",
      khoa: 46,
      maHocPhan: "CT243",
      MSGV: "GV001",
      vaiTro: "Chủ biên",
      trangThai: "completed",
      assignedAt: new Date(),
    },
  });
  console.log("  + BanPhanCong: 1 record");

  console.log("\nSeed completed successfully!");
  console.log("\n--- Login credentials ---");
  console.log("  Admin:  admin@ctu.edu.vn / 123456");
  console.log("  GV001:  nvan@ctu.edu.vn / 123456");
  console.log("  GV002:  ttbinh@ctu.edu.vn / 123456");
  console.log("\n--- Key data points ---");
  console.log("  CT243 has 2 DeCuong versions: 2022-v1 (K46) and 2024-v1 (K48)");
  console.log("  K46 has 3 CLO + 3 CO + 4 CĐG");
  console.log("  K48 has 4 CLO + 4 CO + 4 CĐG (different structure!)");
  console.log("  3 students enrolled with scores -> ready for OBE recalculation");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
