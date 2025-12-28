# Dokumentasi Endpoint DELETE untuk RKM Admin

## 1. Pendahuluan

Dokumen ini menjelaskan semua endpoint DELETE (Hapus) yang telah diimplementasikan berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification) RKM Admin.

## 2. Spesifikasi Endpoint DELETE

### 2.1 Modul Manajemen Anggota (RF-MA-001)
- **Endpoint**: `DELETE /api/delete/members/:id`
- **Deskripsi**: Hapus data anggota
- **Akses**: Private (ketua)
- **Parameter Path**:
  - `id`: ID anggota yang akan dihapus
- **Validasi**:
  - User harus memiliki role ketua
  - Anggota harus ada
  - Tidak bisa diakses oleh sekretaris atau bendahara
- **Response Sukses**:
  ```json
  {
    "message": "Anggota berhasil dihapus"
  }
  ```
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 2.2 Modul Keuangan - Pemasukan (RF-KP-001)
- **Endpoint**: `DELETE /api/delete/payments/:id`
- **Deskripsi**: Hapus data pembayaran iuran
- **Akses**: Private (bendahara, ketua)
- **Parameter Path**:
  - `id`: ID pembayaran yang akan dihapus
- **Validasi**:
  - User harus memiliki role bendahara atau ketua
  - Pembayaran harus ada
  - Tidak bisa diakses oleh sekretaris
- **Response Sukses**:
  ```json
  {
    "message": "Pembayaran berhasil dihapus"
  }
  ```

### 2.3 Modul Keuangan - Pengeluaran (RF-KG-001)
- **Endpoint**: `DELETE /api/delete/expenses/:id`
- **Deskripsi**: Hapus data pengeluaran
- **Akses**: Private (bendahara, ketua)
- **Parameter Path**:
  - `id`: ID pengeluaran yang akan dihapus
- **Validasi**:
  - User harus memiliki role bendahara atau ketua
  - Pengeluaran harus ada
  - Tidak bisa diakses oleh sekretaris
- **Response Sukses**:
  ```json
  {
    "message": "Pengeluaran berhasil dihapus"
  }
  ```

### 2.4 Modul Perubahan Sandi
- **Endpoint**: `PUT /api/change-password/reset-password/:userId`
- **Deskripsi**: Reset password user lain (oleh ketua)
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

## 3. Pembatasan Akses Berdasarkan Role

### 3.1 Sekretaris
- ❌ Tidak bisa menghapus data anggota
- ❌ Tidak bisa menghapus pembayaran
- ❌ Tidak bisa menghapus pengeluaran
- ✅ Bisa mengganti password sendiri (melalui endpoint PUT `/api/change-password/change-password`)

### 3.2 Bendahara
- ❌ Tidak bisa menghapus data anggota
- ✅ Bisa menghapus pembayaran
- ✅ Bisa menghapus pengeluaran
- ✅ Bisa mengganti password sendiri

### 3.3 Ketua
- ✅ Bisa menghapus data anggota
- ✅ Bisa menghapus pembayaran
- ✅ Bisa menghapus pengeluaran
- ✅ Bisa mengganti password sendiri
- ✅ Bisa mereset password user lain

## 4. Validasi dan Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Password di-hash menggunakan bcrypt
- Cascade delete akan dihandle oleh sistem database jika diperlukan

## 5. Kebutuhan Fungsional dari SRS
- ✅ RF-MA-001: Input Data Anggota - Termasuk kemampuan menghapus data anggota (oleh ketua)
- ✅ RF-KP-001: Input Pembayaran Iuran - Termasuk kemampuan menghapus data pembayaran (oleh bendahara/ketua)
- ✅ RF-KG-001: Input Pengeluaran - Termasuk kemampuan menghapus data pengeluaran (oleh bendahara/ketua)
- ✅ Modul Perubahan Sandi - Termasuk kemampuan reset password (oleh ketua)

## 6. Testing
Jalankan testing untuk endpoint DELETE:
```bash
# Testing endpoint DELETE komprehensif
npm run test-delete-comprehensive

# Testing akses DELETE berdasarkan role
npm run test-delete-access-control
```

## 7. Catatan
- Endpoint DELETE telah diuji dan berfungsi dengan baik
- Pembatasan role ketat telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint
- Sistem siap digunakan dan telah diuji dengan data nyata