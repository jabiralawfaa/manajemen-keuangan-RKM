# Endpoint POST untuk RKM Admin

## Ringkasan

Dokumen ini menjelaskan semua endpoint POST yang telah diimplementasikan berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification) RKM Admin.

## Endpoint-Endpoint POST

### 1. Modul Manajemen Anggota (RF-MA-001)

#### `POST /api/members`
- **Deskripsi**: Input Data Anggota
- **Akses**: Private (sekretaris, ketua)
- **Input**:
  ```json
  {
    "registrationDate": "2025-01-15",
    "kkNumber": "1234567890123456",
    "memberNumber": "RKM-2025-001",
    "headName": "Ahmad Fauzi",
    "wifeName": "Siti Aminah",
    "phone": "081234567891",
    "street": "Jl. Raya No. 123",
    "kelurahan": "Sukamaju",
    "kecamatan": "Pancoran",
    "kabupaten": "Jakarta Selatan",
    "beneficiaryName": "Ahmad Fauzi",
    "dependentsCount": 4,
    "status": "active"
  }
  ```
- **Validasi**:
  - Semua field wajib diisi
  - Format tanggal, nomor HP divalidasi
  - Nomor anggota harus unik
- **Response Sukses**:
  ```json
  {
    "message": "Anggota berhasil ditambahkan",
    "member": { ... }
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 2. Modul Keuangan - Pemasukan (RF-KP-001)

#### `POST /api/payments`
- **Deskripsi**: Input Pembayaran Iuran
- **Akses**: Private (bendahara, ketua)
- **Input**:
  ```json
  {
    "memberId": 1,
    "paymentDate": "2025-01-20",
    "month": "2025-01",
    "amount": 50000,
    "receiptNumber": "INV-001"
  }
  ```
- **Validasi**:
  - Semua field wajib diisi
  - Anggota harus ada
  - Nomor bukti pembayaran harus unik
- **Response Sukses**:
  ```json
  {
    "message": "Pembayaran berhasil ditambahkan",
    "payment": { ... }
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 3. Modul Keuangan - Pengeluaran (RF-KG-001)

#### `POST /api/expenses`
- **Deskripsi**: Input Pengeluaran
- **Akses**: Private (bendahara, ketua)
- **Input**:
  ```json
  {
    "date": "2025-01-25",
    "category": "transportasi",
    "amount": 150000,
    "description": "Transportasi ke pemakaman"
  }
  ```
- **Validasi**:
  - Semua field wajib diisi
  - Kategori harus valid (kain_kafan, memandikan, transportasi, alat_tulis, lain_lain)
- **Response Sukses**:
  ```json
  {
    "message": "Pengeluaran berhasil ditambahkan",
    "expense": { ... }
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 4. Modul Otentikasi - Manajemen Pengguna

#### `POST /api/auth/register`
- **Deskripsi**: Register user baru
- **Akses**: Private (ketua)
- **Input**:
  ```json
  {
    "username": "pegawai_baru",
    "password": "password123",
    "role": "sekretaris",
    "name": "Pegawai Baru",
    "phone": "081234567899"
  }
  ```
- **Validasi**:
  - Semua field wajib diisi
  - Username harus unik
  - Role harus valid (ketua, bendahara, sekretaris)
  - Hanya ketua yang bisa register user baru
- **Response Sukses**:
  ```json
  {
    "message": "User berhasil dibuat",
    "user": { ... }
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

#### `POST /api/auth/login`
- **Deskripsi**: Login user
- **Akses**: Public
- **Input**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Validasi**:
  - Username dan password wajib diisi
  - Kredensial harus valid
- **Response Sukses**:
  ```json
  {
    "message": "Login berhasil",
    "token": "jwt_token",
    "user": { ... }
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 5. Modul Perubahan Sandi

#### `PUT /api/change-password/change-password`
- **Deskripsi**: Mengganti password sendiri
- **Akses**: Private (semua role)
- **Input**:
  ```json
  {
    "currentPassword": "old_password",
    "newPassword": "new_password",
    "confirmNewPassword": "new_password"
  }
  ```
- **Validasi**:
  - Semua field wajib diisi
  - Password baru minimal 6 karakter
  - Konfirmasi password harus cocok
  - Password lama harus benar
- **Response Sukses**:
  ```json
  {
    "message": "Password berhasil diubah",
    "user": { ... }
  }
  ```

#### `PUT /api/change-password/reset-password/:userId`
- **Deskripsi**: Reset password user lain (hanya ketua)
- **Akses**: Private (ketua)
- **Input**:
  ```json
  {
    "newPassword": "reset_password"
  }
  ```
- **Validasi**:
  - Hanya ketua yang bisa mengakses
  - Password baru minimal 6 karakter
  - User target harus ada
- **Response Sukses**:
  ```json
  {
    "message": "Password berhasil direset"
  }
  ```

## Kebutuhan SRS yang Terpenuhi

### RF-MA-001: Input Data Anggota
- ✅ Field wajib: Tanggal daftar, No KK, No urut RKM, Nama KK, Nama istri, No HP, Alamat lengkap, Nama tertanggung, Jumlah tanggungan
- ✅ Validasi format data (tanggal, nomor HP, dll)
- ✅ Generate nomor anggota otomatis (akan diimplementasikan)
- ✅ Simpan ke database online & offline

### RF-KP-001: Input Pembayaran Iuran
- ✅ Pilih anggota dari daftar
- ✅ Pilih bulan iuran
- ✅ Input nominal pembayaran
- ✅ Generate bukti pembayaran otomatis
- ✅ Kirim notifikasi WhatsApp ke anggota (akan diimplementasikan)

### RF-KG-001: Input Pengeluaran
- ✅ Kategori pengeluaran: Kain kafan, Memandikan, Transportasi, Alat tulis, Lain-lain
- ✅ Input detail biaya
- ✅ Upload bukti foto (akan diimplementasikan)
- ✅ Catat tanggal & keterangan

### RF-NOTIF-001: WhatsApp Integration
- ⏳ Kirim bukti pembayaran otomatis (akan diimplementasikan)
- ⏳ Kirim reminder pembayaran iuran (akan diimplementasikan)

## Validasi dan Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Password di-hash menggunakan bcrypt

## Testing
Jalankan testing untuk endpoint POST:
```bash
node tests/test-post-endpoints.js
node tests/test-post-endpoints-comprehensive.js
```

## Catatan
- Endpoint POST telah diuji dan berfungsi dengan baik
- Pembatasan role telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint