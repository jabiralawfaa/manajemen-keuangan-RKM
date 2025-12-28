# Dokumentasi Endpoint PUT untuk Sistem RKM Admin

## 1. Pendahuluan

Dokumen ini memberikan dokumentasi lengkap untuk semua endpoint PUT (Update) dalam sistem RKM Admin berdasarkan Software Requirements Specification (SRS) yang telah ditentukan.

## 2. Struktur Endpoint PUT

### 2.1 Modul Manajemen Anggota (RF-MA-001)
- **Endpoint**: `PUT /api/members/:id`
- **Deskripsi**: Update data anggota
- **Akses**: Sekretaris, Ketua
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
- **Validasi**: Semua field wajib diisi dan harus sesuai dengan format yang ditentukan
- **Respons Sukses**:
  ```json
  {
    "message": "Anggota berhasil diperbarui",
    "member": { ... }
  }
  ```

### 2.2 Modul Keuangan - Pemasukan (RF-KP-001)
- **Endpoint**: `PUT /api/payments/:id`
- **Deskripsi**: Update data pembayaran iuran
- **Akses**: Bendahara, Ketua
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
- **Validasi**: Data harus valid dan anggota harus ada
- **Respons Sukses**:
  ```json
  {
    "message": "Pembayaran berhasil diperbarui",
    "payment": { ... }
  }
  ```

### 2.3 Modul Keuangan - Pengeluaran (RF-KG-001)
- **Endpoint**: `PUT /api/expenses/:id`
- **Deskripsi**: Update data pengeluaran
- **Akses**: Bendahara, Ketua
- **Input**:
  ```json
  {
    "date": "2025-01-25",
    "category": "transportasi",
    "amount": 150000,
    "description": "Transportasi ke pemakaman"
  }
  ```
- **Validasi**: Kategori harus valid dan data harus sesuai format
- **Respons Sukses**:
  ```json
  {
    "message": "Pengeluaran berhasil diperbarui",
    "expense": { ... }
  }
  ```

### 2.4 Modul Perubahan Sandi
- **Endpoint**: `PUT /api/change-password/change-password`
- **Deskripsi**: Mengganti password sendiri
- **Akses**: Semua role
- **Input**:
  ```json
  {
    "currentPassword": "old_password",
    "newPassword": "new_password",
    "confirmNewPassword": "new_password"
  }
  ```
- **Validasi**: Password harus sesuai format dan konfirmasi harus cocok
- **Respons Sukses**:
  ```json
  {
    "message": "Password berhasil diubah",
    "user": { ... }
  }
  ```

- **Endpoint**: `PUT /api/change-password/reset-password/:userId`
- **Deskripsi**: Reset password user lain
- **Akses**: Ketua
- **Input**:
  ```json
  {
    "newPassword": "reset_password"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "message": "Password berhasil direset"
  }
  ```

## 3. Pembatasan Akses Berdasarkan Role

### 3.1 Sekretaris
- ✅ Bisa mengupdate data anggota (`PUT /api/members/:id`)
- ❌ Tidak bisa mengupdate pembayaran
- ❌ Tidak bisa mengupdate pengeluaran
- ✅ Bisa mengganti password sendiri

### 3.2 Bendahara
- ❌ Tidak bisa mengupdate data anggota
- ✅ Bisa mengupdate data pembayaran (`PUT /api/payments/:id`)
- ✅ Bisa mengupdate data pengeluaran (`PUT /api/expenses/:id`)
- ✅ Bisa mengganti password sendiri

### 3.3 Ketua
- ✅ Bisa mengupdate semua data (anggota, pembayaran, pengeluaran)
- ✅ Bisa mereset password user lain
- ✅ Bisa mengganti password sendiri

## 4. Kebutuhan Fungsional dari SRS

### 4.1 RF-MA-001: Input Data Anggota
- Field wajib: Tanggal daftar, No KK, No urut RKM, Nama KK, Nama istri, No HP, Alamat lengkap, Nama tertanggung, Jumlah tanggungan
- Validasi format data (tanggal, nomor HP, dll)
- Update data anggota sesuai dengan kebutuhan

### 4.2 RF-KP-001: Input Pembayaran Iuran
- Pilih anggota dari daftar
- Pilih bulan iuran
- Input nominal pembayaran
- Update data pembayaran sesuai dengan kebutuhan

### 4.3 RF-KG-001: Input Pengeluaran
- Kategori pengeluaran: Kain kafan, Memandikan, Transportasi, Alat tulis, Lain-lain
- Input detail biaya
- Update data pengeluaran sesuai dengan kebutuhan

## 5. Validasi dan Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Password di-hash menggunakan bcrypt
- Cascade update akan dihandle oleh sistem jika diperlukan

## 6. Testing
Jalankan testing untuk endpoint PUT:
```bash
# Testing endpoint PUT dasar
npm run test-put

# Testing endpoint PUT komprehensif
npm run test-put-comprehensive

# Testing endpoint PUT berdasarkan modul
npm run test-put-members
npm run test-put-payments
npm run test-put-expenses
npm run test-put-change-password
```

## 7. Kesimpulan
Semua endpoint PUT telah diimplementasikan sesuai dengan kebutuhan fungsional yang disebutkan dalam SRS. Sistem telah dilengkapi dengan pembatasan akses berdasarkan role dan validasi keamanan yang ketat.