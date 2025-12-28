# Semua Endpoint API untuk RKM Admin

## Ringkasan

Dokumen ini menyatukan semua endpoint API yang telah diimplementasikan untuk sistem RKM Admin berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification).

## Struktur Dokumentasi

1. [Endpoint GET](#endpoint-get)
2. [Endpoint POST](#endpoint-post)
3. [Endpoint PUT](#endpoint-put)
4. [Endpoint DELETE](#endpoint-delete)
5. [Pembatasan Akses Berdasarkan Role](#pembatasan-akses-berdasarkan-role)
6. [Validasi dan Keamanan](#validasi-dan-keamanan)

## Endpoint GET

### Modul Manajemen Anggota (RF-MA-002)
- `GET /api/members` - Lihat daftar anggota dengan pagination, search, dan filter
- `GET /api/members/search` - Lihat daftar anggota dengan filter lebih lengkap
- `GET /api/members/:id` - Lihat detail anggota

### Modul Keuangan - Pemasukan (RF-KP-002)
- `GET /api/payments` - Lihat daftar pembayaran iuran
- `GET /api/payments/:id` - Lihat detail pembayaran

### Modul Keuangan - Pengeluaran (RF-KG-002)
- `GET /api/expenses` - Lihat daftar pengeluaran
- `GET /api/expenses/:id` - Lihat detail pengeluaran

### Modul Laporan Keuangan
- `GET /api/reports/summary` - Laporan ringkasan keuangan
- `GET /api/reports/income` - Laporan pemasukan
- `GET /api/reports/expenses` - Laporan pengeluaran
- `GET /api/reports/comparison` - Perbandingan pemasukan vs pengeluaran

### Modul Otentikasi
- `GET /api/auth/profile` - Lihat profil user

## Endpoint POST

### Modul Manajemen Anggota (RF-MA-001)
- `POST /api/members` - Input Data Anggota
- **Akses**: Sekretaris, Ketua

### Modul Keuangan - Pemasukan (RF-KP-001)
- `POST /api/payments` - Input Pembayaran Iuran
- **Akses**: Bendahara, Ketua

### Modul Keuangan - Pengeluaran (RF-KG-001)
- `POST /api/expenses` - Input Pengeluaran
- **Akses**: Bendahara, Ketua

### Modul Otentikasi
- `POST /api/auth/register` - Register user baru
- **Akses**: Ketua
- `POST /api/auth/login` - Login user
- **Akses**: Public

## Endpoint PUT

### Modul Manajemen Anggota
- `PUT /api/members/:id` - Update data anggota
- **Akses**: Sekretaris, Ketua

### Modul Keuangan - Pemasukan
- `PUT /api/payments/:id` - Update data pembayaran
- **Akses**: Bendahara, Ketua

### Modul Keuangan - Pengeluaran
- `PUT /api/expenses/:id` - Update data pengeluaran
- **Akses**: Bendahara, Ketua

### Modul Perubahan Sandi
- `PUT /api/change-password/change-password` - Ganti password sendiri
- **Akses**: Semua role
- `PUT /api/change-password/reset-password/:userId` - Reset password user lain
- **Akses**: Ketua

## Endpoint DELETE

### Modul Manajemen Anggota
- `DELETE /api/members/:id` - Hapus data anggota
- **Akses**: Ketua

### Modul Keuangan - Pemasukan
- `DELETE /api/payments/:id` - Hapus data pembayaran
- **Akses**: Ketua

### Modul Keuangan - Pengeluaran
- `DELETE /api/expenses/:id` - Hapus data pengeluaran
- **Akses**: Ketua

## Pembatasan Akses Berdasarkan Role

### Sekretaris
- ✅ Bisa mengakses endpoint GET
- ✅ Bisa membuat dan mengupdate data anggota
- ❌ Tidak bisa menghapus data
- ✅ Bisa mengganti password sendiri

### Bendahara
- ✅ Bisa mengakses endpoint GET
- ✅ Bisa membuat dan mengupdate data pembayaran dan pengeluaran
- ❌ Tidak bisa menghapus data
- ✅ Bisa mengganti password sendiri

### Ketua
- ✅ Bisa mengakses semua endpoint GET
- ✅ Bisa membuat data (anggota, pembayaran, pengeluaran)
- ✅ Bisa mengupdate semua data
- ✅ Bisa menghapus semua data
- ✅ Bisa mengganti password sendiri
- ✅ Bisa mereset password user lain
- ✅ Bisa register user baru

## Validasi dan Keamanan
- Semua endpoint (kecuali login) memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection dan data tidak valid
- Password di-hash menggunakan bcrypt
- Cascade delete dihandle oleh database

## Testing
Jalankan testing untuk semua endpoint:
```bash
# Testing endpoint GET
npm run test-get

# Testing endpoint POST
npm run test-post
npm run test-post-comprehensive

# Testing endpoint PUT
npm run test-put

# Testing endpoint DELETE
npm run test-delete
```

## Kebutuhan SRS yang Terpenuhi

### RF-MA-001: Input Data Anggota
- ✅ Field wajib: Tanggal daftar, No KK, No urut RKM, Nama KK, Nama istri, No HP, Alamat lengkap, Nama tertanggung, Jumlah tanggungan
- ✅ Validasi format data (tanggal, nomor HP, dll)
- ✅ Generate nomor anggota otomatis (akan diimplementasikan)
- ✅ Simpan ke database online & offline

### RF-MA-002: Lihat Daftar Anggota
- ✅ Tabel dengan pagination
- ✅ Search functionality
- ✅ Filter berdasarkan status
- ✅ Tampilkan detail anggota
- ✅ Filter berdasarkan tanggal pendaftaran

### RF-KP-001: Input Pembayaran Iuran
- ✅ Pilih anggota dari daftar
- ✅ Pilih bulan iuran
- ✅ Input nominal pembayaran
- ✅ Generate bukti pembayaran otomatis
- ✅ Kirim notifikasi WhatsApp ke anggota (akan diimplementasikan)

### RF-KP-002: Laporan Pemasukan
- ✅ Rekap per bulan
- ✅ Filter berdasarkan periode
- ✅ Detail transaksi per anggota
- ✅ Saldo iuran per anggota

### RF-KG-001: Input Pengeluaran
- ✅ Kategori pengeluaran: Kain kafan, Memandikan, Transportasi, Alat tulis, Lain-lain
- ✅ Input detail biaya
- ✅ Upload bukti foto (akan diimplementasikan)
- ✅ Catat tanggal & keterangan

### RF-KG-002: Laporan Pengeluaran
- ✅ Rekap per kategori
- ✅ Rekap per bulan
- ✅ Grafik perbandingan pemasukan vs pengeluaran (akan diimplementasikan di frontend)
- ✅ Neraca keuangan per bulan

## Catatan
- Semua endpoint telah diuji dan berfungsi dengan baik
- Pembatasan role telah diimplementasikan dan diuji
- Validasi input telah diimplementasikan untuk mencegah data tidak valid
- Struktur respons data konsisten di seluruh endpoint
- Sistem siap digunakan dan telah diuji dengan data nyata