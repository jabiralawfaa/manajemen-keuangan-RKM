# Dokumentasi Endpoint DELETE untuk RKM Admin

## Ringkasan

Dokumen ini menjelaskan semua endpoint DELETE yang telah diimplementasikan berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification) RKM Admin.

## Endpoint-Endpoint DELETE

### 1. Modul Manajemen Anggota (RF-MA-001)
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

### 2. Modul Keuangan - Pemasukan (RF-KP-001)
- **Endpoint**: `DELETE /api/delete/payments/:id`
- **Deskripsi**: Hapus data pembayaran iuran
- **Akses**: Private (ketua)
- **Parameter Path**:
  - `id`: ID pembayaran yang akan dihapus
- **Validasi**:
  - User harus memiliki role ketua
  - Pembayaran harus ada
  - Tidak bisa diakses oleh sekretaris atau bendahara
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

### 3. Modul Keuangan - Pengeluaran (RF-KG-001)
- **Endpoint**: `DELETE /api/delete/expenses/:id`
- **Deskripsi**: Hapus data pengeluaran
- **Akses**: Private (ketua)
- **Parameter Path**:
  - `id`: ID pengeluaran yang akan dihapus
- **Validasi**:
  - User harus memiliki role ketua
  - Pengeluaran harus ada
  - Tidak bisa diakses oleh sekretaris atau bendahara
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

## Pembatasan Akses Berdasarkan Role

### Sekretaris
- ❌ Tidak bisa menghapus data anggota
- ❌ Tidak bisa menghapus pembayaran
- ❌ Tidak bisa menghapus pengeluaran

### Bendahara
- ❌ Tidak bisa menghapus data anggota
- ❌ Tidak bisa menghapus pembayaran
- ❌ Tidak bisa menghapus pengeluaran

### Ketua
- ✅ Bisa menghapus data anggota
- ✅ Bisa menghapus pembayaran
- ✅ Bisa menghapus pengeluaran

## Kebutuhan Fungsional dari SRS

### RF-MA-001: Input Data Anggota
- ✅ Hapus data anggota (melalui endpoint DELETE)

### RF-KP-001: Input Pembayaran Iuran
- ✅ Hapus data pembayaran (melalui endpoint DELETE)

### RF-KG-001: Input Pengeluaran
- ✅ Hapus data pengeluaran (melalui endpoint DELETE)

## Validasi dan Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (hanya ketua yang bisa menghapus data)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Cascade delete akan dihandle oleh sistem database jika diperlukan

## Testing
Jalankan testing untuk endpoint DELETE:
```bash
npm run test-delete
```

## Catatan
- Endpoint DELETE telah diuji dan berfungsi dengan baik
- Pembatasan role ketat telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint
- Sistem siap digunakan dan telah diuji dengan data nyata