# Endpoint PUT (Update) untuk RKM Admin

## Ringkasan

Dokumen ini menjelaskan semua endpoint PUT (Update) yang telah diimplementasikan berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification) RKM Admin.

## Endpoint-Endpoint PUT

### 1. Modul Manajemen Anggota (RF-MA-001)

#### `PUT /api/members/:id`
- **Deskripsi**: Update data anggota
- **Akses**: Private (sekretaris, ketua)
- **Parameter Path**:
  - `id`: ID anggota yang akan diupdate
- **Input**:
  ```json
  {
    "registrationDate": "2025-01-15",
    "kkNumber": "1234567890123456",
    "memberNumber": "RKM-2025-001",
    "headName": "Ahmad Fauzi Update",
    "wifeName": "Siti Aminah Update",
    "phone": "081234567891",
    "street": "Jl. Raya No. 123 Update",
    "kelurahan": "Sukamaju Update",
    "kecamatan": "Pancoran Update",
    "kabupaten": "Jakarta Selatan Update",
    "beneficiaryName": "Ahmad Fauzi Update",
    "dependentsCount": 4,
    "status": "active"
  }
  ```
- **Validasi**:
  - User harus memiliki role sekretaris atau ketua
  - Data yang diupdate harus valid
  - Format tanggal dan nomor HP harus benar
- **Response Sukses**:
  ```json
  {
    "message": "Anggota berhasil diperbarui",
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

#### `PUT /api/payments/:id`
- **Deskripsi**: Update data pembayaran iuran
- **Akses**: Private (bendahara, ketua)
- **Parameter Path**:
  - `id`: ID pembayaran yang akan diupdate
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
  - User harus memiliki role bendahara atau ketua
  - Data yang diupdate harus valid
  - Anggota harus ada
- **Response Sukses**:
  ```json
  {
    "message": "Pembayaran berhasil diperbarui",
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

#### `PUT /api/expenses/:id`
- **Deskripsi**: Update data pengeluaran
- **Akses**: Private (bendahara, ketua)
- **Parameter Path**:
  - `id`: ID pengeluaran yang akan diupdate
- **Input**:
  ```json
  {
    "date": "2025-01-25",
    "category": "transportasi",
    "amount": 150000,
    "description": "Transportasi ke pemakaman update"
  }
  ```
- **Validasi**:
  - User harus memiliki role bendahara atau ketua
  - Data yang diupdate harus valid
  - Kategori harus valid (kain_kafan, memandikan, transportasi, alat_tulis, lain_lain)
- **Response Sukses**:
  ```json
  {
    "message": "Pengeluaran berhasil diperbarui",
    "expense": { ... }
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 4. Modul Perubahan Sandi

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
    "user": {
      "id": 2,
      "username": "bendahara1",
      "role": "bendahara",
      "name": "Ahmad Hidayat",
      "phone": "081234567894"
    }
  }
  ```

#### `PUT /api/change-password/reset-password/:userId`
- **Deskripsi**: Reset password user lain (hanya ketua)
- **Akses**: Private (ketua)
- **Parameter Path**:
  - `userId`: ID user yang akan direset passwordnya
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

## Pembatasan Akses Berdasarkan Role

### Sekretaris
- ✅ Bisa mengupdate data anggota (`PUT /api/members/:id`)
- ❌ Tidak bisa mengupdate pembayaran
- ❌ Tidak bisa mengupdate pengeluaran
- ✅ Bisa mengganti password sendiri

### Bendahara
- ❌ Tidak bisa mengupdate data anggota
- ✅ Bisa mengupdate data pembayaran (`PUT /api/payments/:id`)
- ✅ Bisa mengupdate data pengeluaran (`PUT /api/expenses/:id`)
- ✅ Bisa mengganti password sendiri

### Ketua
- ✅ Bisa mengupdate semua data (anggota, pembayaran, pengeluaran)
- ✅ Bisa mereset password user lain
- ✅ Bisa mengganti password sendiri

## Kebutuhan SRS yang Terpenuhi

### RF-MA-001: Input Data Anggota
- ✅ Field wajib: Tanggal daftar, No KK, No urut RKM, Nama KK, Nama istri, No HP, Alamat lengkap, Nama tertanggung, Jumlah tanggungan
- ✅ Validasi format data (tanggal, nomor HP, dll)
- ✅ Update data anggota

### RF-KP-001: Input Pembayaran Iuran
- ✅ Pilih anggota dari daftar
- ✅ Pilih bulan iuran
- ✅ Input nominal pembayaran
- ✅ Update data pembayaran

### RF-KG-001: Input Pengeluaran
- ✅ Kategori pengeluaran: Kain kafan, Memandikan, Transportasi, Alat tulis, Lain-lain
- ✅ Input detail biaya
- ✅ Update data pengeluaran

## Validasi dan Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Password di-hash menggunakan bcrypt
- Cascade update akan dihandle oleh sistem jika diperlukan

## Testing
Jalankan testing untuk endpoint PUT:
```bash
# Testing endpoint PUT dasar
npm run test-put

# Testing endpoint PUT komprehensif
npm run test-put-comprehensive
```

## Catatan
- Endpoint PUT telah diuji dan berfungsi dengan baik
- Pembatasan role telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint
- Sistem siap digunakan dan telah diuji dengan data nyata