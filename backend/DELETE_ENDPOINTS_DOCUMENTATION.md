# Endpoint DELETE untuk Sistem RKM Admin

## 1. Pendahuluan

Endpoint DELETE digunakan untuk menghapus data dari sistem RKM Admin sesuai dengan kebutuhan fungsional yang disebutkan dalam SRS. Sistem ini dirancang dengan pembatasan akses berdasarkan role untuk menjaga integritas data.

## 2. Endpoint DELETE

### 2.1 Modul Manajemen Anggota (RF-MA-003)
- **Endpoint**: `DELETE /api/members/:id`
- **Deskripsi**: Hapus data anggota
- **Akses**: Ketua
- **Parameter Path**:
  - `id`: ID anggota yang akan dihapus
- **Input**: Tidak ada
- **Validasi**:
  - User harus memiliki role ketua
  - Anggota harus ada di database
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

### 2.2 Modul Keuangan - Pemasukan (RF-KP-003)
- **Endpoint**: `DELETE /api/payments/:id`
- **Deskripsi**: Hapus data pembayaran iuran
- **Akses**: Bendahara, Ketua
- **Parameter Path**:
  - `id`: ID pembayaran yang akan dihapus
- **Input**: Tidak ada
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
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

### 2.3 Modul Keuangan - Pengeluaran (RF-KG-003)
- **Endpoint**: `DELETE /api/expenses/:id`
- **Deskripsi**: Hapus data pengeluaran
- **Akses**: Bendahara, Ketua
- **Parameter Path**:
  - `id`: ID pengeluaran yang akan dihapus
- **Input**: Tidak ada
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
- **Response Error**:
  ```json
  {
    "message": "Error message"
  }
  ```

## 3. Pembatasan Akses Berdasarkan Role

### 3.1 Sekretaris
- ❌ Tidak bisa menghapus data anggota
- ❌ Tidak bisa menghapus pembayaran
- ❌ Tidak bisa menghapus pengeluaran
- ❌ Tidak bisa mereset password user lain
- ✅ Bisa mengganti password sendiri

### 3.2 Bendahara
- ❌ Tidak bisa menghapus data anggota
- ✅ Bisa menghapus pembayaran
- ✅ Bisa menghapus pengeluaran
- ❌ Tidak bisa mereset password user lain
- ✅ Bisa mengganti password sendiri

### 3.3 Ketua
- ✅ Bisa menghapus data anggota
- ✅ Bisa menghapus pembayaran
- ✅ Bisa menghapus pengeluaran
- ✅ Bisa mereset password user lain
- ✅ Bisa mengganti password sendiri

## 4. Validasi dan Keamanan
- Semua endpoint DELETE memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Cascade delete akan dihandle oleh sistem database jika diperlukan
- Password di-hash menggunakan bcrypt

## 5. Testing Endpoint DELETE
Jalankan testing untuk endpoint DELETE:
```bash
# Testing endpoint DELETE dasar
npm run test-delete

# Testing endpoint DELETE komprehensif
npm run test-delete-comprehensive

# Testing pembatasan akses DELETE
npm run test-delete-access-control
```

## 6. Contoh Penggunaan

### Menghapus Anggota (oleh Ketua)
```bash
curl -X DELETE http://localhost:5000/api/members/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Menghapus Pembayaran (oleh Bendahara/Ketua)
```bash
curl -X DELETE http://localhost:5000/api/payments/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Menghapus Pengeluaran (oleh Bendahara/Ketua)
```bash
curl -X DELETE http://localhost:5000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 7. Kebutuhan SRS yang Terpenuhi
- ✅ RF-MA-003: Hapus Data Anggota (oleh ketua)
- ✅ RF-KP-003: Hapus Pembayaran Iuran (oleh bendahara/ketua)
- ✅ RF-KG-003: Hapus Pengeluaran (oleh bendahara/ketua)
- ✅ Pembatasan akses berdasarkan role
- ✅ Validasi keamanan

## 8. Catatan
- Semua endpoint DELETE telah diuji dan berfungsi dengan baik
- Pembatasan role telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint
- Sistem siap digunakan dan telah diuji dengan data nyata