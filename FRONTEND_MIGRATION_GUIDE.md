# OBE Backend - Tài liệu API tổng hợp cho Frontend

> **Base URL:** `http://localhost:4000/api/v1`
> **Swagger UI:** `http://localhost:4000/docs`
> **CORS:** chỉ cho phép `http://localhost:3000`

---

## Mục lục

1. [Xác thực (Authentication)](#1-xác-thực-authentication)
2. [Quản lý người dùng (Users)](#2-quản-lý-người-dùng-users)
3. [Đơn vị (Don Vi)](#3-đơn-vị-don-vi)
4. [Niên khóa (Nien Khoa)](#4-niên-khóa-nien-khoa)
5. [Chương trình đào tạo (CTĐT)](#5-chương-trình-đào-tạo-ctđt)
6. [CTĐT - Niên khóa](#6-ctđt---niên-khóa)
7. [Học phần (Hoc Phan)](#7-học-phần-hoc-phan)
8. [CTĐT - Học phần](#8-ctđt---học-phần)
9. [PLO - Chuẩn đầu ra chương trình](#9-plo---chuẩn-đầu-ra-chương-trình)
10. [Đề cương chi tiết](#10-đề-cương-chi-tiết)
11. [CLO - Chuẩn đầu ra học phần](#11-clo---chuẩn-đầu-ra-học-phần)
12. [CO - Mục tiêu học phần](#12-co---mục-tiêu-học-phần)
13. [Cách đánh giá (CĐG)](#13-cách-đánh-giá-cđg)
14. [CLO-PLO Mapping](#14-clo-plo-mapping)
15. [CLO-CO Mapping](#15-clo-co-mapping)
16. [CĐG-CO Mapping](#16-cđg-co-mapping)
17. [Ma trận Mapping (tổng hợp)](#17-ma-trận-mapping-tổng-hợp)
18. [Giảng viên](#18-giảng-viên)
19. [Sinh viên](#19-sinh-viên)
20. [Lớp học phần](#20-lớp-học-phần)
21. [Đăng ký học phần](#21-đăng-ký-học-phần)
22. [Điểm số](#22-điểm-số)
23. [Ban phân công nhập đề cương](#23-ban-phân-công-nhập-đề-cương)
24. [Cấu hình OBE](#24-cấu-hình-obe)
25. [OBE Calculation](#25-obe-calculation)
26. [Lecturer - Quản lý điểm](#26-lecturer---quản-lý-điểm)
27. [Lecturer - Dashboard](#27-lecturer---dashboard)
28. [Lecturer - Nhập đề cương](#28-lecturer---nhập-đề-cương)
29. [Admin - Dashboard tổng quan](#29-admin---dashboard-tổng-quan)
30. [Admin - OBE Dashboard](#30-admin---obe-dashboard)
31. [Phụ lục: Enums & Kiểu dữ liệu](#31-phụ-lục-enums--kiểu-dữ-liệu)

---

## Quy ước chung

- Tất cả endpoint đều có prefix `api/v1/`
- Request body gửi dạng `application/json`
- Validation: `whitelist: true`, `forbidNonWhitelisted: true` — field lạ sẽ bị reject
- Các endpoint cần auth sẽ ghi rõ **Auth: Bearer Token**
- Tham số `:param` trong URL là path parameter
- Tham số `?param=` là query parameter
- Response lỗi có dạng: `{ "statusCode": 4xx, "message": "...", "error": "..." }`

---

## 1. Xác thực (Authentication)

### POST `/auth/sign-up` — Đăng ký

**Request Body:**
```json
{
  "email": "user@example.com",
  "hoTen": "Nguyen Van A",
  "password": "123456"
}
```

| Field      | Type   | Bắt buộc | Validation         |
|------------|--------|----------|--------------------|
| `email`    | string | ✅       | Email hợp lệ      |
| `hoTen`    | string | ✅       |                    |
| `password` | string | ✅       | Min 6 ký tự        |

**Response 201:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "ADMIN"
}
```

---

### POST `/auth/sign-in` — Đăng nhập

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "LECTURER",
    "msgv": "GV001"
  }
}
```

> **JWT payload:** `{ sub: userId, role: Role, msgv: string | null }`
>
> Gửi token trong header: `Authorization: Bearer <accessToken>`

---

## 2. Quản lý người dùng (Users)

### POST `/users` — Tạo user

**Request Body:**
```json
{
  "email": "lecturer@example.com",
  "password": "123456",
  "role": "LECTURER",
  "msgv": "GV001"
}
```

| Field      | Type   | Bắt buộc | Ghi chú                              |
|------------|--------|----------|---------------------------------------|
| `email`    | string | ✅       | Email hợp lệ                         |
| `password` | string | ✅       | Min 6 ký tự                           |
| `role`     | enum   | ✅       | `ADMIN` / `QA` / `LECTURER` / `AUDITOR` |
| `msgv`     | string | ❌       | Bắt buộc nếu role = LECTURER          |

### GET `/users` — Danh sách users

| Query  | Type   | Ghi chú               |
|--------|--------|------------------------|
| `role` | string | Lọc theo role          |
| `q`    | string | Tìm kiếm               |

### GET `/users/:id` — Chi tiết user

### PATCH `/users/:id` — Cập nhật user

### DELETE `/users/:id` — Xóa user

---

## 3. Đơn vị (Don Vi)

**Prefix:** `/don-vi`

### POST `/don-vi` — Tạo đơn vị

```json
{
  "maDonVi": "CNTT",
  "tenDonVi": "Khoa Công nghệ thông tin",
  "loaiDonVi": "Khoa",
  "email": "cntt@ctu.edu.vn",
  "soDienThoai": "0292123456",
  "diaChi": "Đường 3/2, Ninh Kiều, Cần Thơ",
  "website": "https://cntt.ctu.edu.vn",
  "isActive": true
}
```

| Field        | Type    | Bắt buộc | Validation   |
|--------------|---------|----------|--------------|
| `maDonVi`    | string  | ✅       | MaxLength    |
| `tenDonVi`   | string  | ✅       | MaxLength    |
| `loaiDonVi`  | string  | ✅       | MaxLength    |
| `email`      | string  | ❌       | Email hợp lệ |
| `soDienThoai`| string  | ❌       |              |
| `diaChi`     | string  | ❌       |              |
| `website`    | string  | ❌       | URL hợp lệ   |
| `isActive`   | boolean | ❌       | default true |

### GET `/don-vi` — Danh sách

### GET `/don-vi/:maDonVi` — Chi tiết

### PATCH `/don-vi/:maDonVi` — Cập nhật (partial)

### DELETE `/don-vi/:maDonVi` — Xóa

---

## 4. Niên khóa (Nien Khoa)

**Prefix:** `/nien-khoa`

### POST `/nien-khoa` — Tạo niên khóa

```json
{
  "khoa": 48,
  "namBatDau": 2022,
  "namKetThuc": 2026,
  "ghiChu": "Khóa 48"
}
```

| Field        | Type   | Bắt buộc | Validation              |
|--------------|--------|----------|--------------------------|
| `khoa`       | int    | ✅       | Min 1                    |
| `namBatDau`  | int    | ✅       | Min 1900                 |
| `namKetThuc` | int    | ❌       | Min 1900, >= namBatDau   |
| `ghiChu`     | string | ❌       |                          |

### GET `/nien-khoa` — Danh sách

### GET `/nien-khoa/:khoa` — Chi tiết (param `khoa` là int)

### PATCH `/nien-khoa/:khoa` — Cập nhật

### DELETE `/nien-khoa/:khoa` — Xóa

---

## 5. Chương trình đào tạo (CTĐT)

**Prefix:** `/chuong-trinh-dao-tao`

### POST `/chuong-trinh-dao-tao` — Tạo CTĐT

```json
{
  "maSoNganh": "7480201",
  "maDonVi": "CNTT",
  "tenTiengViet": "Công nghệ thông tin",
  "trinhDoDaoTao": "Đại học",
  "tenTiengAnh": "Information Technology",
  "truongCapBang": "Trường ĐH Cần Thơ",
  "tenGoiVanBang": "Kỹ sư"
}
```

| Field            | Type   | Bắt buộc |
|------------------|--------|----------|
| `maSoNganh`      | string | ✅       |
| `maDonVi`        | string | ✅       |
| `tenTiengViet`   | string | ✅       |
| `trinhDoDaoTao`  | string | ✅       |
| `tenTiengAnh`    | string | ❌       |
| `truongCapBang`  | string | ❌       |
| `tenGoiVanBang`  | string | ❌       |

### GET `/chuong-trinh-dao-tao` — Danh sách

**Response:** Bao gồm `donVi` và `chuongTrinhNienKhoas` (nested)

### GET `/chuong-trinh-dao-tao/:maSoNganh` — Chi tiết

**Response:** Bao gồm `donVi`, `chuongTrinhNienKhoas` kèm `hocPhans` và `plos`

### PATCH `/chuong-trinh-dao-tao/:maSoNganh` — Cập nhật

### DELETE `/chuong-trinh-dao-tao/:maSoNganh` — Xóa

---

## 6. CTĐT - Niên khóa

**Prefix:** `/chuong-trinh-dao-tao/:maSoNganh/nien-khoa`

> Quản lý phiên bản CTĐT theo từng niên khóa.

### POST `/chuong-trinh-dao-tao/:maSoNganh/nien-khoa` — Tạo

```json
{
  "khoa": 48,
  "soTinChi": 150,
  "hinhThucDaoTao": "Chính quy",
  "thoiGianDaoTao": "4 năm",
  "thangDiemDanhGia": "Thang 10",
  "phienBan": "v1",
  "trangThai": "active",
  "ngayApDung": "2022-09-01",
  "ngayBanHanh": "2022-06-01",
  "moTa": "CTĐT K48",
  "ghiChu": ""
}
```

| Field              | Type       | Bắt buộc |
|--------------------|------------|----------|
| `khoa`             | int        | ✅       |
| `soTinChi`         | int        | ❌       |
| `hinhThucDaoTao`   | string     | ❌       |
| `thoiGianDaoTao`   | string     | ❌       |
| `thangDiemDanhGia` | string     | ❌       |
| `phienBan`         | string     | ❌       |
| `trangThai`        | string     | ❌       |
| `ngayApDung`       | datestring | ❌       |
| `ngayBanHanh`      | datestring | ❌       |
| `moTa`             | string     | ❌       |
| `ghiChu`           | string     | ❌       |

### GET `/chuong-trinh-dao-tao/:maSoNganh/nien-khoa` — Danh sách

### GET `/chuong-trinh-dao-tao/:maSoNganh/nien-khoa/:khoa` — Chi tiết

### PATCH `/chuong-trinh-dao-tao/:maSoNganh/nien-khoa/:khoa` — Cập nhật

### DELETE `/chuong-trinh-dao-tao/:maSoNganh/nien-khoa/:khoa` — Xóa

---

## 7. Học phần (Hoc Phan)

**Prefix:** `/hoc-phan`

### POST `/hoc-phan` — Tạo học phần

```json
{
  "maHocPhan": "CT243",
  "maDonVi": "CNTT",
  "tenHocPhan": "Đảm bảo chất lượng và Kiểm thử PM",
  "soTinChi": 3,
  "loaiHocPhan": "Bắt buộc",
  "moTa": "...",
  "soTietLyThuyet": 30,
  "soTietThucHanh": 30,
  "ngonNguGiangDay": "Tiếng Việt",
  "taiLieuThamKhao": "..."
}
```

| Field               | Type   | Bắt buộc | Validation |
|---------------------|--------|----------|------------|
| `maHocPhan`         | string | ✅       |            |
| `maDonVi`           | string | ✅       |            |
| `tenHocPhan`        | string | ✅       |            |
| `soTinChi`          | int    | ✅       | Min 1      |
| `loaiHocPhan`       | string | ❌       |            |
| `moTa`              | string | ❌       |            |
| `soTietLyThuyet`    | int    | ❌       | Min 0      |
| `soTietThucHanh`    | int    | ❌       | Min 0      |
| `ngonNguGiangDay`   | string | ❌       |            |
| `taiLieuThamKhao`   | string | ❌       |            |

### GET `/hoc-phan` — Danh sách

### GET `/hoc-phan/:maHocPhan` — Chi tiết

**Response:** Bao gồm `donVi` và danh sách `deCuongs[]`
```json
{
  "maHocPhan": "CT243",
  "tenHocPhan": "...",
  "soTinChi": 3,
  "donVi": { "maDonVi": "CNTT", "tenDonVi": "..." },
  "deCuongs": [
    {
      "maDeCuong": "uuid-1",
      "phienBan": "2024-v1",
      "trangThai": "active",
      "ngayApDung": "2024-08-01"
    }
  ]
}
```

### PATCH `/hoc-phan/:maHocPhan` — Cập nhật

### DELETE `/hoc-phan/:maHocPhan` — Xóa

### GET `/hoc-phan/:maHocPhan/plo-options` — Lấy danh sách PLO khả dụng

| Query       | Type   | Ghi chú                   |
|-------------|--------|----------------------------|
| `maSoNganh` | string | Lọc theo ngành (optional)  |
| `khoa`      | string | Lọc theo khóa (optional)   |

**Response:**
```json
[
  {
    "maPLO": "uuid",
    "maSoNganh": "7480201",
    "khoa": 48,
    "code": "PLO1",
    "noiDungChuanDauRa": "..."
  }
]
```

---

## 8. CTĐT - Học phần

**Prefix:** `/chuong-trinh-dao-tao/:maSoNganh/khoa/:khoa/hoc-phan`

> Gắn học phần vào CTĐT của một niên khóa cụ thể.

### POST `.../:maSoNganh/khoa/:khoa/hoc-phan` — Gắn học phần

```json
{
  "maHocPhan": "CT243",
  "hocKyDuKien": 5,
  "namHocDuKien": 3,
  "batBuoc": true,
  "nhomTuChon": null,
  "ghiChu": ""
}
```

| Field          | Type    | Bắt buộc |
|----------------|---------|----------|
| `maHocPhan`    | string  | ✅       |
| `hocKyDuKien`  | int     | ❌       |
| `namHocDuKien` | int     | ❌       |
| `batBuoc`      | boolean | ❌       |
| `nhomTuChon`   | string  | ❌       |
| `ghiChu`       | string  | ❌       |

### GET `.../:maSoNganh/khoa/:khoa/hoc-phan` — Danh sách

### GET `.../:maSoNganh/khoa/:khoa/hoc-phan/:maHocPhan` — Chi tiết

### PATCH `.../:maSoNganh/khoa/:khoa/hoc-phan/:maHocPhan` — Cập nhật

### DELETE `.../:maSoNganh/khoa/:khoa/hoc-phan/:maHocPhan` — Xóa

---

## 9. PLO - Chuẩn đầu ra chương trình

**Prefix:** `/chuong-trinh-dao-tao/:maSoNganh/khoa/:khoa/plo`

> PLO thuộc về CTĐT + niên khóa, không thuộc đề cương.

### POST `.../:maSoNganh/khoa/:khoa/plo` — Tạo PLO

```json
{
  "code": "PLO1",
  "noiDungChuanDauRa": "Có khả năng phân tích và thiết kế hệ thống",
  "nhom": "Kiến thức",
  "mucDo": "Áp dụng",
  "ghiChu": "",
  "isActive": true
}
```

| Field                 | Type    | Bắt buộc |
|-----------------------|---------|----------|
| `noiDungChuanDauRa`   | string  | ✅       |
| `code`                | string  | ❌       |
| `nhom`                | string  | ❌       |
| `mucDo`               | string  | ❌       |
| `ghiChu`              | string  | ❌       |
| `isActive`            | boolean | ❌       |

### GET `.../:maSoNganh/khoa/:khoa/plo` — Danh sách

### GET `.../:maSoNganh/khoa/:khoa/plo/:maPLO` — Chi tiết

### PATCH `.../:maSoNganh/khoa/:khoa/plo/:maPLO` — Cập nhật

### DELETE `.../:maSoNganh/khoa/:khoa/plo/:maPLO` — Xóa

---

## 10. Đề cương chi tiết

**Prefix:** `/de-cuong-chi-tiet`

> Mỗi học phần có thể có nhiều phiên bản đề cương. CLO, CO, CĐG gắn vào đề cương.

### POST `/de-cuong-chi-tiet` — Tạo đề cương

```json
{
  "maHocPhan": "CT243",
  "phienBan": "2024-v1",
  "ngayApDung": "2024-08-01",
  "trangThai": "draft",
  "ghiChu": "Đề cương mới cho khóa 48"
}
```

| Field        | Type       | Bắt buộc | Ghi chú                           |
|--------------|------------|----------|-------------------------------------|
| `maHocPhan`  | string     | ✅       |                                     |
| `phienBan`   | string     | ✅       | Unique cùng maHocPhan               |
| `ngayApDung` | datestring | ❌       | ISO 8601: `"2024-08-01"`            |
| `trangThai`  | string     | ❌       | `draft` / `active` / `archived`     |
| `ghiChu`     | string     | ❌       |                                     |

### GET `/de-cuong-chi-tiet` — Danh sách

| Query       | Type   | Ghi chú                       |
|-------------|--------|--------------------------------|
| `maHocPhan` | string | Lọc theo học phần (optional)   |

### GET `/de-cuong-chi-tiet/active/:maHocPhan` — Đề cương active của học phần

**Response:** Đề cương có `trangThai = "active"` mới nhất, kèm CLO, CO, CĐG

### GET `/de-cuong-chi-tiet/:maDeCuong` — Chi tiết

**Response:** Đề cương kèm đầy đủ CLO[], CO[], CachDanhGia[], hocPhan
```json
{
  "maDeCuong": "uuid",
  "maHocPhan": "CT243",
  "phienBan": "2024-v1",
  "trangThai": "active",
  "ngayApDung": "2024-08-01",
  "ghiChu": "...",
  "hocPhan": { "maHocPhan": "CT243", "tenHocPhan": "..." },
  "clos": [...],
  "cos": [...],
  "cachDanhGias": [...]
}
```

### PATCH `/de-cuong-chi-tiet/:maDeCuong` — Cập nhật

### DELETE `/de-cuong-chi-tiet/:maDeCuong` — Xóa (cascade)

> Cascade delete: xóa toàn bộ CLO, CO, CĐG, mapping, điểm số, kết quả OBE liên quan. Gỡ liên kết LopHocPhan (set maDeCuong = null). Thực hiện trong 1 transaction.

---

## 11. CLO - Chuẩn đầu ra học phần

**Prefix:** `/de-cuong-chi-tiet/:maDeCuong/clo`

### POST `.../clo` — Tạo CLO

```json
{
  "code": "CLO1",
  "noiDungChuanDauRa": "Hiểu được quy trình kiểm thử phần mềm"
}
```

| Field                | Type   | Bắt buộc |
|----------------------|--------|----------|
| `noiDungChuanDauRa`  | string | ✅       |
| `code`               | string | ❌       |

### GET `.../clo` — Danh sách CLO của đề cương

### GET `.../clo/:maCLO` — Chi tiết CLO

### PATCH `.../clo/:maCLO` — Cập nhật

### DELETE `.../clo/:maCLO` — Xóa

---

## 12. CO - Mục tiêu học phần

**Prefix:** `/de-cuong-chi-tiet/:maDeCuong/co`

### POST `.../co` — Tạo CO

```json
{
  "code": "CO1",
  "noiDungChuanDauRa": "Áp dụng được kỹ thuật kiểm thử hộp đen"
}
```

| Field                | Type   | Bắt buộc |
|----------------------|--------|----------|
| `noiDungChuanDauRa`  | string | ✅       |
| `code`               | string | ❌       |

### GET `.../co` — Danh sách CO

### GET `.../co/:maCO` — Chi tiết

### PATCH `.../co/:maCO` — Cập nhật

### DELETE `.../co/:maCO` — Xóa

---

## 13. Cách đánh giá (CĐG)

**Prefix:** `/de-cuong-chi-tiet/:maDeCuong/cach-danh-gia`

### POST `.../cach-danh-gia` — Tạo cách đánh giá

```json
{
  "tenThanhPhan": "Bài tập lớn",
  "loai": "assignment",
  "trongSo": "0.3",
  "cachDanhGia": "Nộp báo cáo + demo"
}
```

| Field           | Type   | Bắt buộc | Validation                      |
|-----------------|--------|----------|---------------------------------|
| `tenThanhPhan`  | string | ✅       |                                 |
| `trongSo`       | string | ✅       | Decimal 0-1, regex `0\.\d{1,4}` hoặc `1` hoặc `0` |
| `loai`          | string | ❌       |                                 |
| `cachDanhGia`   | string | ❌       |                                 |

> **Lưu ý:** `trongSo` gửi dưới dạng **string** (vd: `"0.3000"`), backend lưu `Decimal(5,4)`

### GET `.../cach-danh-gia` — Danh sách

### GET `.../cach-danh-gia/:maCDG` — Chi tiết

### PATCH `.../cach-danh-gia/:maCDG` — Cập nhật

### DELETE `.../cach-danh-gia/:maCDG` — Xóa

---

## 14. CLO-PLO Mapping

**Prefix:** `/de-cuong-chi-tiet/:maDeCuong/clo/:maCLO/plo-mapping`

> Mapping giữa CLO (của đề cương) và PLO (của CTĐT niên khóa). Cần thêm query `maSoNganh` + `khoa` để xác định PLO thuộc chương trình nào.

### POST `.../plo-mapping?maSoNganh=...&khoa=...` — Tạo mapping

```json
{
  "maPLO": "uuid-plo",
  "trongSo": "0.5",
  "ghiChu": ""
}
```

| Field     | Type   | Bắt buộc | Validation |
|-----------|--------|----------|------------|
| `maPLO`   | string | ✅       |            |
| `trongSo` | string | ✅       | 0-1 decimal |
| `ghiChu`  | string | ❌       |            |

| Query       | Type   | Bắt buộc khi tạo |
|-------------|--------|-------------------|
| `maSoNganh` | string | ✅                |
| `khoa`      | string | ✅                |

### GET `.../plo-mapping?maSoNganh=...&khoa=...` — Danh sách

### GET `.../plo-mapping/:maPLO?maSoNganh=...&khoa=...` — Chi tiết

### PATCH `.../plo-mapping/:maPLO` — Cập nhật

### DELETE `.../plo-mapping/:maPLO` — Xóa

---

## 15. CLO-CO Mapping

**Prefix:** `/de-cuong-chi-tiet/:maDeCuong/clo/:maCLO/co-mapping`

### POST `.../co-mapping` — Tạo mapping

```json
{
  "maCO": "uuid-co",
  "trongSo": "0.5",
  "ghiChu": ""
}
```

| Field     | Type   | Bắt buộc |
|-----------|--------|----------|
| `maCO`    | string | ✅       |
| `trongSo` | string | ✅       |
| `ghiChu`  | string | ❌       |

### GET `.../co-mapping` — Danh sách

### GET `.../co-mapping/:maCO` — Chi tiết

### PATCH `.../co-mapping/:maCO` — Cập nhật

### DELETE `.../co-mapping/:maCO` — Xóa

---

## 16. CĐG-CO Mapping

**Prefix:** `/de-cuong-chi-tiet/:maDeCuong/cach-danh-gia/:maCDG/co-mapping`

### POST `.../co-mapping` — Tạo mapping

```json
{
  "maCO": "uuid-co",
  "trongSo": "0.5",
  "ghiChu": ""
}
```

| Field     | Type   | Bắt buộc |
|-----------|--------|----------|
| `maCO`    | string | ✅       |
| `trongSo` | string | ✅       |
| `ghiChu`  | string | ❌       |

### GET `.../co-mapping` — Danh sách

### GET `.../co-mapping/:maCO` — Chi tiết

### PATCH `.../co-mapping/:maCO` — Cập nhật

### DELETE `.../co-mapping/:maCO` — Xóa

---

## 17. Ma trận Mapping (tổng hợp)

> Các endpoint trả về dạng ma trận (matrix) phục vụ hiển thị bảng mapping trên frontend.

### GET `/de-cuong-chi-tiet/:maDeCuong/clo-plo-mapping` — Ma trận CLO-PLO

| Query       | Type   | Ghi chú                       |
|-------------|--------|--------------------------------|
| `maSoNganh` | string | Lọc PLO theo ngành (optional)  |
| `khoa`      | string | Lọc PLO theo khóa (optional)   |

**Response:**
```json
{
  "clos": [
    { "maCLO": "uuid", "code": "CLO1", "noiDungChuanDauRa": "..." }
  ],
  "plos": [
    { "maPLO": "uuid", "code": "PLO1", "noiDungChuanDauRa": "..." }
  ],
  "mappings": [
    { "maCLO": "uuid", "maPLO": "uuid", "trongSo": 0.5 }
  ]
}
```

### GET `/de-cuong-chi-tiet/:maDeCuong/clo-co-mapping` — Ma trận CLO-CO

**Response:**
```json
{
  "clos": [...],
  "cos": [...],
  "mappings": [
    { "maCLO": "uuid", "maCO": "uuid", "trongSo": 0.5 }
  ]
}
```

### GET `/de-cuong-chi-tiet/:maDeCuong/cdg-co-mapping` — Ma trận CĐG-CO

**Response:**
```json
{
  "cachDanhGias": [...],
  "cos": [...],
  "mappings": [
    { "maCDG": "uuid", "maCO": "uuid", "trongSo": 0.5 }
  ]
}
```

---

## 18. Giảng viên

**Prefix:** `/giang-vien`

### POST `/giang-vien` — Tạo giảng viên

```json
{
  "MSGV": "GV001",
  "maDonVi": "CNTT",
  "hoTen": "Nguyễn Văn A",
  "gioiTinh": "Nam",
  "email": "gv001@ctu.edu.vn",
  "soDienThoai": "0909123456",
  "hocVi": "Tiến sĩ",
  "chucDanh": "Giảng viên chính",
  "boMon": "Công nghệ phần mềm",
  "ngaySinh": "1985-06-15",
  "isActive": true
}
```

| Field         | Type       | Bắt buộc | Validation            |
|---------------|------------|----------|------------------------|
| `MSGV`        | string     | ✅       |                        |
| `maDonVi`     | string     | ✅       |                        |
| `hoTen`       | string     | ✅       |                        |
| `gioiTinh`    | string     | ✅       | `"Nam"` hoặc `"Nữ"`   |
| `email`       | string     | ❌       | Email hợp lệ           |
| `soDienThoai` | string     | ❌       |                        |
| `hocVi`       | string     | ❌       |                        |
| `chucDanh`    | string     | ❌       |                        |
| `boMon`       | string     | ❌       |                        |
| `ngaySinh`    | datestring | ❌       | ISO 8601               |
| `isActive`    | boolean    | ❌       |                        |

### GET `/giang-vien` — Danh sách (kèm `donVi`)

### GET `/giang-vien/:MSGV` — Chi tiết

### PATCH `/giang-vien/:MSGV` — Cập nhật

### DELETE `/giang-vien/:MSGV` — Xóa

---

## 19. Sinh viên

**Prefix:** `/sinh-vien`

### POST `/sinh-vien` — Tạo sinh viên

```json
{
  "MSSV": "B2012345",
  "hoTen": "Trần Thị B",
  "maDonVi": "CNTT",
  "khoa": 48,
  "maSoNganh": "7480201",
  "ngaySinh": "2002-03-15",
  "gioiTinh": "Nữ",
  "email": "b2012345@student.ctu.edu.vn",
  "soDienThoai": "0909654321",
  "trangThaiHocTap": "dang_hoc"
}
```

| Field              | Type       | Bắt buộc |
|--------------------|------------|----------|
| `MSSV`             | string     | ✅       |
| `hoTen`            | string     | ✅       |
| `maDonVi`          | string     | ❌       |
| `khoa`             | int        | ❌       |
| `maSoNganh`        | string     | ❌       |
| `ngaySinh`         | datestring | ❌       |
| `gioiTinh`         | string     | ❌       |
| `email`            | string     | ❌       |
| `soDienThoai`      | string     | ❌       |
| `trangThaiHocTap`  | string     | ❌       |

### GET `/sinh-vien` — Danh sách

### GET `/sinh-vien/:MSSV` — Chi tiết (kèm `dangKyHocPhans`)

### PATCH `/sinh-vien/:MSSV` — Cập nhật

### DELETE `/sinh-vien/:MSSV` — Xóa

---

## 20. Lớp học phần

**Prefix:** `/lop-hoc-phan`

### POST `/lop-hoc-phan` — Tạo lớp học phần

```json
{
  "maLopHocPhan": "CT243-01-K48-HK1",
  "MSGV": "GV001",
  "maHocPhan": "CT243",
  "khoa": 48,
  "hocKy": 1,
  "maDeCuong": "uuid-de-cuong",
  "nhom": "01",
  "siSoToiDa": 50,
  "phongHoc": "A101",
  "lichHoc": "T2 tiết 1-3",
  "ngayBatDau": "2024-09-01",
  "ngayKetThuc": "2025-01-15",
  "status": "open"
}
```

| Field           | Type       | Bắt buộc | Validation |
|-----------------|------------|----------|------------|
| `maLopHocPhan`  | string     | ✅       |            |
| `MSGV`          | string     | ✅       |            |
| `maHocPhan`     | string     | ✅       |            |
| `khoa`          | int        | ✅       | Min 1      |
| `hocKy`         | int        | ✅       | Min 1      |
| `maDeCuong`     | string     | ❌       | UUID đề cương |
| `nhom`          | string     | ❌       |            |
| `siSoToiDa`     | int        | ❌       |            |
| `phongHoc`      | string     | ❌       |            |
| `lichHoc`       | string     | ❌       |            |
| `ngayBatDau`    | datestring | ❌       |            |
| `ngayKetThuc`   | datestring | ❌       | >= ngayBatDau |
| `status`        | string     | ❌       |            |

### GET `/lop-hoc-phan` — Danh sách

**Response:** Kèm `giangVien`, `hocPhan`, `nienKhoa`, `deCuong`

### GET `/lop-hoc-phan/:maLopHocPhan` — Chi tiết

### PATCH `/lop-hoc-phan/:maLopHocPhan` — Cập nhật

### DELETE `/lop-hoc-phan/:maLopHocPhan` — Xóa

---

## 21. Đăng ký học phần

**Prefix:** `/lop-hoc-phan/:maLopHocPhan/dang-ky`

### POST `.../dang-ky` — Đăng ký SV vào lớp

```json
{
  "MSSV": "B2012345",
  "ngayDangKy": "2024-09-01",
  "trangThai": "dang_hoc",
  "lanHoc": 1,
  "ghiChu": ""
}
```

| Field        | Type       | Bắt buộc | Ghi chú         |
|--------------|------------|----------|-------------------|
| `MSSV`       | string     | ✅       |                   |
| `ngayDangKy` | datestring | ❌       |                   |
| `trangThai`  | string     | ❌       | Default `dang_hoc` |
| `lanHoc`     | int        | ❌       | Default 1          |
| `ghiChu`     | string     | ❌       |                   |

> **Unique constraint:** `(maLopHocPhan, MSSV, lanHoc)`

### GET `.../dang-ky` — Danh sách đăng ký của lớp

### GET `.../dang-ky/by-id/:maDangKy` — Chi tiết (kèm `diemSos`)

### PATCH `.../dang-ky/by-id/:maDangKy` — Cập nhật

### DELETE `.../dang-ky/by-id/:maDangKy` — Xóa

---

## 22. Điểm số

**Prefix:** `/dang-ky-hoc-phan/:maDangKy/diem-so`

### POST `.../diem-so` — Nhập điểm

```json
{
  "maCDG": "uuid-cdg",
  "diem": "8.50",
  "MSGV": "GV001"
}
```

| Field   | Type   | Bắt buộc | Validation                        |
|---------|--------|----------|-----------------------------------|
| `maCDG` | string | ✅       | UUID cách đánh giá                |
| `diem`  | string | ✅       | Số, tối đa 2 chữ số thập phân     |
| `MSGV`  | string | ❌       |                                   |

> **Tự động tính:** `tiLeHoanThanh = clamp(diem / trongSo_CDG, 0, 1)`
>
> **Side effect:** Tự động trigger `OBE recalculation` cho enrollment.

### GET `.../diem-so` — Danh sách điểm

### GET `.../diem-so/:maCDG` — Chi tiết

### PATCH `.../diem-so/:maCDG` — Cập nhật điểm

### DELETE `.../diem-so/:maCDG` — Xóa điểm (cũng trigger recalculate)

---

## 23. Ban phân công nhập đề cương

**Prefix:** `/ban-phan-cong-nhap-de-cuong`

### POST `/ban-phan-cong-nhap-de-cuong` — Tạo phân công

```json
{
  "maSoNganh": "7480201",
  "khoa": 48,
  "maHocPhan": "CT243",
  "MSGV": "GV001",
  "vaiTro": "Chủ biên",
  "trangThai": "assigned",
  "deadline": "2024-07-01",
  "ghiChu": "",
  "assignedAt": "2024-05-01"
}
```

| Field        | Type       | Bắt buộc |
|--------------|------------|----------|
| `maSoNganh`  | string     | ✅       |
| `khoa`       | int        | ✅       |
| `maHocPhan`  | string     | ✅       |
| `MSGV`       | string     | ✅       |
| `vaiTro`     | string     | ✅       |
| `trangThai`  | string     | ✅       |
| `deadline`   | datestring | ❌       |
| `ghiChu`     | string     | ❌       |
| `assignedAt` | datestring | ❌       |

### GET `/ban-phan-cong-nhap-de-cuong` — Danh sách (kèm `ctdtNienKhoa`, `hocPhan`, `giangVien`)

### GET `/ban-phan-cong-nhap-de-cuong/:maBanPhanCong` — Chi tiết

### PATCH `/ban-phan-cong-nhap-de-cuong/:maBanPhanCong` — Cập nhật

### DELETE `/ban-phan-cong-nhap-de-cuong/:maBanPhanCong` — Xóa

---

## 24. Cấu hình OBE

**Prefix:** `/cau-hinh-obe`

> Cấu hình ngưỡng đạt, KPI cho từng đơn vị + niên khóa.

### POST `/cau-hinh-obe` — Tạo cấu hình

```json
{
  "khoa": 48,
  "maDonVi": "CNTT",
  "nguongDatCaNhan": "0.5000",
  "kpiLopHoc": "0.7000"
}
```

| Field              | Type   | Bắt buộc | Validation                |
|--------------------|--------|----------|----------------------------|
| `khoa`             | int    | ✅       | Min 1                      |
| `maDonVi`          | string | ✅       |                            |
| `nguongDatCaNhan`  | string | ✅       | Decimal 0-1, max 4 decimals |
| `kpiLopHoc`        | string | ✅       | Decimal 0-1, max 4 decimals |

> **Unique constraint:** `(khoa, maDonVi)`

### GET `/cau-hinh-obe` — Danh sách

| Query     | Type   | Ghi chú  |
|-----------|--------|----------|
| `khoa`    | string | optional |
| `maDonVi` | string | optional |

### GET `/cau-hinh-obe/by-khoa/:khoa/don-vi/:maDonVi` — Tìm theo khóa + đơn vị

### GET `/cau-hinh-obe/:id` — Chi tiết

### PATCH `/cau-hinh-obe/:id` — Cập nhật

### DELETE `/cau-hinh-obe/:id` — Xóa

---

## 25. OBE Calculation

**Prefix:** `/obe-calculation`

> Tính toán lại kết quả OBE: CĐG → CO → CLO → PLO

### POST `/obe-calculation/recalculate/enrollment/:maDangKy` — Tính lại OBE cho 1 enrollment

**Path param:** `maDangKy` (UUID)

**Response 201:**
```json
{
  "success": true,
  "maDangKy": "uuid",
  "MSSV": "B2012345",
  "maLopHocPhan": "CT243-01-K48-HK1",
  "maDeCuong": "uuid-de-cuong",
  "retakeStrategy": "MAX",
  "includeCreditsInPlo": true
}
```

> **Lưu ý:** Hầu hết không cần gọi thủ công — `DiemSoService` tự trigger khi nhập/sửa/xóa điểm.

---

## 26. Lecturer - Quản lý điểm

**Prefix:** `/lecturer`

> **Auth: Bearer Token** — Yêu cầu role `LECTURER`. Backend tự lấy `MSGV` từ JWT token.

### GET `/lecturer/my-classes` — Danh sách lớp của tôi

**Response:**
```json
[
  {
    "maLopHocPhan": "CT243-01-K48-HK1",
    "MSGV": "GV001",
    "maHocPhan": "CT243",
    "khoa": 48,
    "hocKy": 1,
    "hocPhan": { "maHocPhan": "CT243", "tenHocPhan": "..." }
  }
]
```

### GET `/lecturer/my-classes/:maLopHocPhan/enrollments` — DS sinh viên trong lớp

**Response:**
```json
[
  {
    "maDangKy": "uuid",
    "maLopHocPhan": "...",
    "MSSV": "B2012345",
    "lanHoc": 1,
    "trangThai": "dang_hoc",
    "sinhVien": { "MSSV": "B2012345", "hoTen": "Trần Thị B", "email": "..." }
  }
]
```

### GET `/lecturer/my-classes/:maLopHocPhan/cach-danh-gia` — DS cách đánh giá của lớp

> Lấy CĐG từ đề cương gắn với lớp. Trả `[]` nếu lớp chưa gắn đề cương.

### GET `/lecturer/enrollments/:maDangKy/scores` — Xem điểm của 1 SV

### POST `/lecturer/enrollments/:maDangKy/scores` — Nhập điểm

```json
{
  "maCDG": "uuid-cdg",
  "diem": "8.50"
}
```

| Field   | Type   | Bắt buộc |
|---------|--------|----------|
| `maCDG` | string | ✅       |
| `diem`  | string | ✅       |

### PATCH `/lecturer/enrollments/:maDangKy/scores/:maCDG` — Sửa điểm

```json
{
  "diem": "9.00"
}
```

### DELETE `/lecturer/enrollments/:maDangKy/scores/:maCDG` — Xóa điểm

---

## 27. Lecturer - Dashboard

**Prefix:** `/lecturer/dashboard`

> **Auth: Bearer Token** — Yêu cầu role `LECTURER`.

### GET `/lecturer/dashboard/overview` — Tổng quan lớp của giảng viên

| Query   | Type | Ghi chú             |
|---------|------|----------------------|
| `khoa`  | int  | Lọc theo khóa        |
| `hocKy` | int  | Lọc theo học kỳ      |

**Response:**
```json
{
  "totalClasses": 5,
  "totalStudents": 200,
  "totalScoresEntered": 450,
  "totalExpectedScores": 600,
  "overallProgress": 0.75,
  "classes": [
    {
      "maLopHocPhan": "CT243-01-K48-HK1",
      "maHocPhan": "CT243",
      "tenHocPhan": "...",
      "soTinChi": 3,
      "khoa": 48,
      "hocKy": 1,
      "status": "open",
      "deCuong": { "phienBan": "2024-v1", "trangThai": "active" },
      "enrolledCount": 45,
      "scoresEntered": 90,
      "totalExpectedScores": 135,
      "scoreProgress": 0.6667
    }
  ]
}
```

### GET `/lecturer/dashboard/classes/:maLopHocPhan/score-distribution` — Phân bố điểm

**Response:**
```json
{
  "maLopHocPhan": "...",
  "distributions": [
    {
      "maCDG": "uuid",
      "tenThanhPhan": "Bài tập lớn",
      "trongSo": 0.3,
      "count": 45,
      "min": 0.3,
      "max": 1.0,
      "avg": 0.72,
      "median": 0.75,
      "stdDev": 0.15
    }
  ]
}
```

### GET `/lecturer/dashboard/classes/:maLopHocPhan/clo-summary` — Tóm tắt CLO

| Query      | Type   | Ghi chú                 |
|------------|--------|--------------------------|
| `nguongDat`| number | Ngưỡng đạt (default 0.5) |

**Response:**
```json
{
  "maLopHocPhan": "...",
  "threshold": 0.5,
  "clos": [
    {
      "maCLO": "uuid",
      "code": "CLO1",
      "noiDung": "...",
      "studentCount": 45,
      "avgTiLeDat": 0.72,
      "passCount": 38,
      "passRate": 0.8444
    }
  ]
}
```

### GET `/lecturer/dashboard/classes/:maLopHocPhan/co-summary` — Tóm tắt CO

| Query      | Type   | Ghi chú                 |
|------------|--------|--------------------------|
| `nguongDat`| number | Ngưỡng đạt (default 0.5) |

**Response:** Cấu trúc tương tự CLO summary, thay `maCLO` bằng `maCO`

### GET `/lecturer/dashboard/classes/:maLopHocPhan/student-obe-details` — Chi tiết OBE từng SV

**Response:**
```json
{
  "maLopHocPhan": "...",
  "maHocPhan": "CT243",
  "tenHocPhan": "...",
  "students": [
    {
      "MSSV": "B2012345",
      "hoTen": "Trần Thị B",
      "maDangKy": "uuid",
      "coResults": [
        { "maCO": "uuid", "tiLeDat": 0.85 }
      ],
      "cloResults": [
        { "maCLO": "uuid", "tiLeDat": 0.78 }
      ],
      "avgCO": 0.82,
      "avgCLO": 0.75
    }
  ]
}
```

### GET `/lecturer/dashboard/classes/:maLopHocPhan/at-risk-students` — SV có nguy cơ

| Query      | Type   | Ghi chú                 |
|------------|--------|--------------------------|
| `nguongDat`| number | Ngưỡng đạt (default 0.5) |

**Response:**
```json
{
  "maLopHocPhan": "...",
  "threshold": 0.5,
  "totalEnrolled": 45,
  "atRiskCount": 3,
  "students": [
    {
      "MSSV": "B2012345",
      "hoTen": "...",
      "email": "...",
      "avgCO": 0.35,
      "failedCOCount": 2,
      "failedCLOCount": 1,
      "failedCOs": ["uuid-co1", "uuid-co2"],
      "failedCLOs": ["uuid-clo1"]
    }
  ]
}
```

### GET `/lecturer/dashboard/classes/:maLopHocPhan/score-matrix` — Bảng điểm tổng hợp

**Response:**
```json
{
  "maLopHocPhan": "...",
  "columns": [
    { "maCDG": "uuid", "tenThanhPhan": "Giữa kỳ", "trongSo": 0.3 },
    { "maCDG": "uuid", "tenThanhPhan": "Cuối kỳ", "trongSo": 0.7 }
  ],
  "rows": [
    {
      "MSSV": "B2012345",
      "hoTen": "Trần Thị B",
      "maDangKy": "uuid",
      "scores": [
        { "maCDG": "uuid", "diem": 7.5, "tiLeHoanThanh": 0.75 },
        { "maCDG": "uuid", "diem": 8.0, "tiLeHoanThanh": 0.80 }
      ],
      "tongDiem": 15.5,
      "completedCount": 2,
      "totalCount": 2
    }
  ]
}
```

---

## 28. Lecturer - Nhập đề cương

**Prefix:** `/lecturer/de-cuong`

> **Auth: Bearer Token** — Yêu cầu role `LECTURER`. Backend tự lấy `MSGV` từ JWT.
>
> Module này cho phép giảng viên được phân công nhập nội dung đề cương chi tiết: tạo đề cương, soạn CLO, CO, Cách đánh giá, và cập nhật trạng thái phân công.

### Luồng sử dụng

```
Trang "Nhập đề cương":
  1. GV gọi GET /my-assignments → xem danh sách phân công của mình
  2. Chọn 1 phân công → GET /my-assignments/:id → xem chi tiết + đề cương liên quan
  3. Nếu chưa có đề cương → POST /my-assignments/:id/syllabus → tạo mới
     (tự động chuyển trạng thái phân công → "in_progress")
  4. Soạn nội dung:
     - POST/PATCH/DELETE /syllabus/:maDeCuong/clo
     - POST/PATCH/DELETE /syllabus/:maDeCuong/co
     - POST/PATCH/DELETE /syllabus/:maDeCuong/cach-danh-gia
  5. Hoàn thành → PATCH /my-assignments/:id/status { trangThai: "completed" }

Trang "Xem đề cương đã nhập":
  1. GV gọi GET /my-syllabi → danh sách tất cả đề cương đã tạo
  2. Xem chi tiết → GET /syllabus/:maDeCuong
  3. Sửa metadata → PATCH /syllabus/:maDeCuong
  4. Xóa đề cương → DELETE /syllabus/:maDeCuong
```

---

### 28.1 Quản lý phân công

#### GET `/lecturer/de-cuong/my-assignments` — DS phân công của tôi

**Response:**
```json
[
  {
    "maBanPhanCong": "uuid",
    "maSoNganh": "7480201",
    "khoa": 48,
    "maHocPhan": "CT243",
    "MSGV": "GV001",
    "vaiTro": "Chủ biên",
    "trangThai": "assigned",
    "deadline": "2024-07-01T00:00:00.000Z",
    "assignedAt": "2024-05-01T00:00:00.000Z",
    "ghiChu": "",
    "ctdtNienKhoa": {
      "maSoNganh": "7480201",
      "khoa": 48,
      "chuongTrinh": { "maSoNganh": "7480201", "tenTiengViet": "Công nghệ thông tin" },
      "nienKhoa": { "khoa": 48, "namBatDau": 2022, "namKetThuc": 2026 }
    },
    "hocPhan": { "maHocPhan": "CT243", "tenHocPhan": "Kiểm thử phần mềm" },
    "giangVien": { "MSGV": "GV001", "hoTen": "Nguyễn Văn A" }
  }
]
```

#### GET `/lecturer/de-cuong/my-assignments/:maBanPhanCong` — Chi tiết phân công + đề cương

**Response:**
```json
{
  "assignment": { "...giống trên..." },
  "deCuongs": [
    {
      "maDeCuong": "uuid",
      "maHocPhan": "CT243",
      "phienBan": "2024-v1",
      "trangThai": "draft",
      "hocPhan": { "maHocPhan": "CT243", "tenHocPhan": "..." },
      "clos": [...],
      "cos": [...],
      "cachDanhGias": [...]
    }
  ]
}
```

> `deCuongs` trả tất cả đề cương của học phần đó, để GV biết đã có bản nào hay chưa.

#### PATCH `/lecturer/de-cuong/my-assignments/:maBanPhanCong/status` — Cập nhật trạng thái

**Request Body:**
```json
{
  "trangThai": "in_progress"
}
```

| Field       | Type   | Bắt buộc | Giá trị cho phép                      |
|-------------|--------|----------|----------------------------------------|
| `trangThai` | string | ✅       | `assigned` / `in_progress` / `completed` |

---

### 28.2 Xem đề cương đã nhập (trang "Xem đề cương đã nhập")

#### GET `/lecturer/de-cuong/my-syllabi` — DS tất cả đề cương GV đã được phân công

> Trang frontend "Xem đề cương đã nhập" gọi endpoint này. Trả về tất cả đề cương thuộc các học phần mà GV được phân công, kèm thông tin phân công tương ứng.

**Response:**
```json
[
  {
    "maDeCuong": "uuid",
    "maHocPhan": "CT243",
    "tenHocPhan": "Kiểm thử phần mềm",
    "soTinChi": 3,
    "phienBan": "2024-v1",
    "trangThai": "draft",
    "ngayApDung": "2024-08-01T00:00:00.000Z",
    "ghiChu": "...",
    "createdAt": "2024-05-01T...",
    "counts": { "clos": 5, "cos": 3, "cachDanhGias": 4 },
    "assignment": {
      "maBanPhanCong": "uuid",
      "maSoNganh": "7480201",
      "khoa": 48,
      "vaiTro": "Chủ biên",
      "trangThaiPhanCong": "in_progress"
    }
  }
]
```

> **Mapping với các cột trên UI:**
> - Học phần → `tenHocPhan`
> - CTĐT → `assignment.maSoNganh`
> - Phiên bản → `phienBan`
> - TT đề cương → `trangThai`
> - TT phân công → `assignment.trangThaiPhanCong`
> - Vai trò → `assignment.vaiTro`

---

### 28.3 Tạo đề cương từ phân công

#### POST `/lecturer/de-cuong/my-assignments/:maBanPhanCong/syllabus` — Tạo đề cương

> Tự động lấy `maHocPhan` từ phân công. Tự động chuyển trạng thái phân công → `in_progress`.

**Request Body:**
```json
{
  "phienBan": "2024-v1",
  "ngayApDung": "2024-08-01",
  "trangThai": "draft",
  "ghiChu": "Đề cương mới cho khóa 48"
}
```

| Field        | Type       | Bắt buộc | Ghi chú                       |
|--------------|------------|----------|-------------------------------|
| `phienBan`   | string     | ✅       | Unique cùng maHocPhan         |
| `ngayApDung` | datestring | ❌       | ISO 8601                      |
| `trangThai`  | string     | ❌       | Default `draft`               |
| `ghiChu`     | string     | ❌       |                               |

---

### 28.4 Xem / Sửa / Xóa đề cương

#### GET `/lecturer/de-cuong/syllabus/:maDeCuong` — Chi tiết đề cương

> Chỉ trả về nếu GV có phân công cho học phần tương ứng.

**Response:** Đề cương kèm đầy đủ CLO[], CO[], CachDanhGia[], hocPhan

#### PATCH `/lecturer/de-cuong/syllabus/:maDeCuong` — Sửa đề cương

**Request Body (partial):**
```json
{
  "phienBan": "2024-v2",
  "trangThai": "active",
  "ngayApDung": "2024-09-01",
  "ghiChu": "Cập nhật lần 2"
}
```

| Field        | Type       | Bắt buộc |
|--------------|------------|----------|
| `phienBan`   | string     | ❌       |
| `ngayApDung` | datestring | ❌       |
| `trangThai`  | string     | ❌       |
| `ghiChu`     | string     | ❌       |

#### DELETE `/lecturer/de-cuong/syllabus/:maDeCuong` — Xóa đề cương (cascade)

> **Cascade delete** — xóa toàn bộ dữ liệu liên quan trong 1 transaction:
>
> | Thứ tự | Xóa gì | Ghi chú |
> |--------|--------|---------|
> | 1 | KetQuaCLO, KetQuaCO | Kết quả OBE đã tính |
> | 2 | CloPloMapping, CloCoMapping | Mapping CLO |
> | 3 | CdgCoMapping | Mapping CĐG |
> | 4 | DiemSo | Điểm số liên quan CĐG |
> | 5 | CLO, CO, CachDanhGia | Nội dung đề cương |
> | 6 | LopHocPhan.maDeCuong → null | Gỡ liên kết lớp HP (không xóa lớp) |
> | 7 | DeCuongChiTiet | Chính đề cương |
>
> Frontend nên hiện confirm dialog: *"Xóa đề cương này? Tất cả CLO, CO, CĐG và điểm số liên quan sẽ bị xóa theo."*

---

### 28.5 CRUD CLO

#### GET `/lecturer/de-cuong/syllabus/:maDeCuong/clo` — DS CLO

#### POST `/lecturer/de-cuong/syllabus/:maDeCuong/clo` — Tạo CLO

```json
{
  "code": "CLO1",
  "noiDungChuanDauRa": "Hiểu được quy trình kiểm thử phần mềm"
}
```

| Field                | Type   | Bắt buộc |
|----------------------|--------|----------|
| `noiDungChuanDauRa`  | string | ✅       |
| `code`               | string | ❌       |

#### PATCH `/lecturer/de-cuong/syllabus/:maDeCuong/clo/:maCLO` — Sửa CLO

#### DELETE `/lecturer/de-cuong/syllabus/:maDeCuong/clo/:maCLO` — Xóa CLO

---

### 28.6 CRUD CO

#### GET `/lecturer/de-cuong/syllabus/:maDeCuong/co` — DS CO

#### POST `/lecturer/de-cuong/syllabus/:maDeCuong/co` — Tạo CO

```json
{
  "code": "CO1",
  "noiDungChuanDauRa": "Áp dụng được kỹ thuật kiểm thử hộp đen"
}
```

| Field                | Type   | Bắt buộc |
|----------------------|--------|----------|
| `noiDungChuanDauRa`  | string | ✅       |
| `code`               | string | ❌       |

#### PATCH `/lecturer/de-cuong/syllabus/:maDeCuong/co/:maCO` — Sửa CO

#### DELETE `/lecturer/de-cuong/syllabus/:maDeCuong/co/:maCO` — Xóa CO

---

### 28.7 CRUD Cách đánh giá

#### GET `/lecturer/de-cuong/syllabus/:maDeCuong/cach-danh-gia` — DS CĐG

#### POST `/lecturer/de-cuong/syllabus/:maDeCuong/cach-danh-gia` — Tạo CĐG

```json
{
  "tenThanhPhan": "Bài tập lớn",
  "loai": "assignment",
  "trongSo": "0.3",
  "cachDanhGia": "Nộp báo cáo + demo"
}
```

| Field           | Type   | Bắt buộc | Validation                  |
|-----------------|--------|----------|-----------------------------|
| `tenThanhPhan`  | string | ✅       |                             |
| `trongSo`       | string | ✅       | Decimal 0-1                 |
| `loai`          | string | ❌       |                             |
| `cachDanhGia`   | string | ❌       |                             |

#### PATCH `/lecturer/de-cuong/syllabus/:maDeCuong/cach-danh-gia/:maCDG` — Sửa CĐG

#### DELETE `/lecturer/de-cuong/syllabus/:maDeCuong/cach-danh-gia/:maCDG` — Xóa CĐG

---

### Bảo mật

- Tất cả endpoint yêu cầu JWT với role `LECTURER`
- GV chỉ xem/sửa phân công của chính mình (kiểm tra `MSGV` từ token)
- GV chỉ CRUD CLO/CO/CĐG cho đề cương thuộc HP mà mình được phân công
- Trả `403 Forbidden` nếu GV cố truy cập đề cương không thuộc phân công của mình

---

## 29. Admin - Dashboard tổng quan

**Prefix:** `/dashboard-admin`

### GET `/dashboard-admin` — Dashboard tổng quan hệ thống

**Response:**
```json
{
  "overview": {
    "totalPrograms": 5,
    "totalCourses": 120,
    "totalLecturers": 50,
    "totalStudents": 2000,
    "totalClasses": 80,
    "totalAssignments": 30,
    "openClasses": 45,
    "pendingAssignments": 10
  },
  "charts": {
    "coursesByProgram": [
      { "maSoNganh": "7480201", "tenTiengViet": "CNTT", "totalHocPhan": 45 }
    ],
    "studentsByKhoa": [
      { "khoa": 48, "totalStudents": 500 },
      { "khoa": 49, "totalStudents": 600 }
    ],
    "classesByHocKy": [
      { "hocKy": 1, "totalClasses": 30 },
      { "hocKy": 2, "totalClasses": 50 }
    ],
    "assignmentsByStatus": [
      { "trangThai": "assigned", "total": 5 },
      { "trangThai": "in_progress", "total": 10 },
      { "trangThai": "completed", "total": 15 }
    ]
  }
}
```

---

## 30. Admin - OBE Dashboard

**Prefix:** `/admin-obe-dashboard`

### GET `/admin-obe-dashboard/overview` — Dashboard OBE theo đơn vị

| Query     | Type   | Bắt buộc | Ghi chú             |
|-----------|--------|----------|----------------------|
| `maDonVi` | string | ✅       | Mã đơn vị            |
| `khoa`    | int    | ❌       | Lọc theo khóa        |
| `hocKy`   | int    | ❌       | Lọc theo học kỳ      |

**Response:**
```json
{
  "config": {
    "maDonVi": "CNTT",
    "tenDonVi": "Khoa CNTT",
    "khoa": 48,
    "namBatDau": 2022,
    "namKetThuc": 2026,
    "nguongDatCaNhan": 0.5,
    "kpiLopHoc": 0.7
  },
  "ploRadar": [
    {
      "maPLO": "uuid",
      "label": "PLO1",
      "noiDung": "Có khả năng phân tích...",
      "avgTiLeDat": 0.72,
      "avgDiemHe10": 7.2,
      "passRate": 0.85
    }
  ],
  "bottleneckCourses": [
    {
      "maHocPhan": "CT243",
      "tenHocPhan": "...",
      "avgCloPassRate": 0.45,
      "minCloPassRate": 0.30,
      "affectedClasses": 3
    }
  ],
  "atRiskStudents": [
    {
      "MSSV": "B2012345",
      "hoTen": "...",
      "khoa": 48,
      "namHocHienTai": 3,
      "avgPlo": 0.42,
      "avgDiemHe10": 4.2,
      "ploBelowThresholdCount": 3
    }
  ]
}
```

> **Logic:** `ploRadar` tổng hợp tất cả KetQuaPLO; `bottleneckCourses` top 10 HP có CLO passrate thấp nhất; `atRiskStudents` SV năm >= 3 có avgPLO < ngưỡng (top 20).

---

## 31. Phụ lục: Enums & Kiểu dữ liệu

### Roles

| Giá trị    | Mô tả                   |
|------------|--------------------------|
| `ADMIN`    | Quản trị viên            |
| `QA`       | Đảm bảo chất lượng       |
| `LECTURER` | Giảng viên               |
| `AUDITOR`  | Kiểm toán viên           |

### Gender

| Giá trị | Mô tả |
|---------|-------|
| `Nam`   | Nam   |
| `Nữ`    | Nữ    |

### Trạng thái đề cương (`trangThai` của DeCuongChiTiet)

| Giá trị     | Mô tả                    |
|-------------|---------------------------|
| `draft`     | Bản nháp                  |
| `active`    | Đang sử dụng              |
| `archived`  | Đã lưu trữ                |

### Trạng thái đăng ký học phần

| Giá trị     | Mô tả                    |
|-------------|---------------------------|
| `dang_hoc`  | Đang học (default)         |

### Trạng thái ban phân công

| Giá trị       | Mô tả        |
|---------------|---------------|
| `assigned`    | Đã phân công  |
| `in_progress` | Đang thực hiện |
| `completed`   | Hoàn thành    |

### Kiểu dữ liệu đặc biệt

| Kiểu         | Cách gửi     | Ví dụ             | Ghi chú                                 |
|---------------|--------------|--------------------|------------------------------------------|
| `datestring`  | ISO 8601     | `"2024-08-01"`     | Ngày tháng                               |
| `decimal 0-1` | String       | `"0.5000"`         | Trọng số, ngưỡng đạt, KPI              |
| `diem`        | String       | `"8.50"`           | Điểm số, max 2 decimal                  |
| `uuid`        | String       | `"550e8400-e29b..."` | ID tự sinh (maDeCuong, maCLO, maCO...) |

---

## Sơ đồ quan hệ chính

```
DonVi ──< ChuongTrinhDaoTao ──< ChuongTrinhDaoTaoNienKhoa ──< PLO
              │                         │
              │                         ├──< ChuongTrinhDaoTaoHocPhan
              │                         │
DonVi ──< HocPhan ──< DeCuongChiTiet ──┤──< CLO ──< CloPloMapping >── PLO
              │              │          │──< CO
              │              │          │──< CachDanhGia
              │              │
              │              │     CloCoMapping (CLO × CO)
              │              │     CdgCoMapping (CĐG × CO)
              │              │
DonVi ──< GiangVien ──< LopHocPhan ──< DangKyHocPhan ──< DiemSo
                              │              │
                              │         SinhVien
                              │
                         DeCuongChiTiet (tham chiếu)

KetQuaCO   (SV × CO × Lớp)   ← tính từ DiemSo qua CĐG→CO
KetQuaCLO  (SV × CLO × Lớp)  ← tổng hợp từ KetQuaCO qua CO→CLO
KetQuaPLO  (SV × PLO)        ← tổng hợp từ KetQuaCLO qua CLO→PLO (cross-course)
```

---

## Luồng tính OBE

```
1. GV nhập điểm (DiemSo) cho SV tại 1 CĐG
                ↓
2. tiLeHoanThanh = clamp(diem / trongSo_CDG, 0, 1)
                ↓
3. Auto trigger recalculate:
   a. CĐG → CO: weighted sum qua CdgCoMapping
   b. CO → CLO: weighted sum qua CloCoMapping
   c. CLO → PLO: cross-course, retake strategy MAX, optional credit-weighted
                ↓
4. Kết quả lưu vào KetQuaCO, KetQuaCLO, KetQuaPLO
                ↓
5. Dashboard đọc kết quả → hiển thị radar, bottleneck, at-risk
```

---

## Lưu ý quan trọng cho Frontend

1. **Versioning đề cương:** CLO/CO/CĐG giờ thuộc `DeCuongChiTiet`, không phải `HocPhan` trực tiếp. Khi chọn HP → cần chọn tiếp đề cương.

2. **Lớp học phần + Đề cương:** LopHocPhan có field `maDeCuong` (optional). Nếu null → API lecturer sẽ trả rỗng cho CĐG, và OBE calculation trả lỗi 404.

3. **Trọng số dạng string:** Các field `trongSo`, `nguongDatCaNhan`, `kpiLopHoc`, `diem` gửi dạng **string** (không phải number).

4. **Auto recalculate:** Không cần gọi `/obe-calculation/recalculate` thủ công sau khi nhập điểm — backend tự trigger.

5. **Auth cho Lecturer:** Các route `/lecturer/*` và `/lecturer/dashboard/*` yêu cầu JWT với role LECTURER. Backend tự xác định GV từ `msgv` trong token.

6. **Swagger UI:** Truy cập `http://localhost:4000/docs` để xem interactive API documentation.
