# Endpoint PUT untuk RKM Admin

## Ringkasan

Dokumen ini menjelaskan semua endpoint PUT (Update) yang telah diimplementasikan berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification) RKM Admin.

## Endpoint-Endpoint PUT

### 1. Modul Manajemen Anggota

#### `PUT /api/members/:id`
- **Deskripsi**: Update data anggota
- **Akses**: Private (sekretaris, ketua)
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

### 2. Modul Keuangan - Pemasukan

#### `PUT /api/payments/:id`
- **Deskripsi**: Update data pembayaran iuran
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
  - User harus memiliki role bendahara atau ketua
  - Data yang diupdate harus valid
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

### 3. Modul Keuangan - Pengeluaran

#### `PUT /api/expenses/:id`
- **Deskripsi**: Update data pengeluaran
- **Akses**: Private (bendahara, ketua)
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

## Pembatasan Akses Berdasarkan Role

### Sekretaris
- ✅ Bisa mengupdate data anggota (`PUT /api/members/:id`)
- ❌ Tidak bisa mengupdate pembayaran atau pengeluaran
- ✅ Bisa mengganti password sendiri

### Bendahara
- ✅ Bisa mengupdate data pembayaran (`PUT /api/payments/:id`)
- ✅ Bisa mengupdate data pengeluaran (`PUT /api/expenses/:id`)
- ❌ Tidak bisa mengupdate data anggota
- ✅ Bisa mengganti password sendiri

### Ketua
- ✅ Bisa mengupdate semua data (anggota, pembayaran, pengeluaran)
- ✅ Bisa mereset password user lain
- ✅ Bisa mengganti password sendiri

## Validasi dan Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Password di-hash menggunakan bcrypt

## Testing
Jalankan testing untuk endpoint PUT:
```bash
npm run test-put
```

## Catatan
- Endpoint PUT telah diuji dan berfungsi dengan baik
- Pembatasan role telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint