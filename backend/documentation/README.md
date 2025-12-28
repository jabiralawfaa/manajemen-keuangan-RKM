# Panduan Testing Endpoint GET untuk RKM Admin

## Struktur Folder Testing

```
backend/
└── tests/
    ├── test-get-endpoints.js          # Testing dasar endpoint GET
    ├── test-get-endpoints-advanced.js # Testing lanjutan endpoint GET
    └── README.md                     # Dokumentasi ini
```

## Endpoint GET yang Diuji

### 1. Modul Manajemen Anggota (RF-MA-002)
- `GET /api/members` - Lihat daftar anggota
  - Dukungan pagination (`page`, `limit`)
  - Dukungan pencarian (`search`)
  - Dukungan filter status (`status`)
- `GET /api/members/:id` - Lihat detail anggota

### 2. Modul Keuangan - Pemasukan (RF-KP-002)
- `GET /api/payments` - Lihat daftar pembayaran
  - Dukungan filter bulan (`month`)
  - Dukungan filter berdasarkan anggota (`memberId`)
- `GET /api/payments/:id` - Lihat detail pembayaran

### 3. Modul Keuangan - Pengeluaran (RF-KG-002)
- `GET /api/expenses` - Lihat daftar pengeluaran
  - Dukungan filter kategori (`category`)
  - Dukungan filter tanggal (`startDate`, `endDate`)
- `GET /api/expenses/:id` - Lihat detail pengeluaran

### 4. Modul Otentikasi
- `GET /api/auth/profile` - Lihat profil user yang sedang login

## Persiapan Testing

### 1. Pastikan Server Berjalan
```bash
cd /run/media/jabiralawfaa/TKJ/PROJECT/BIG-PROJECT/manajemen-RKM/backend
npm start
```

### 2. Pastikan Database Terhubung
- Database PostgreSQL harus aktif
- Tabel-tabel harus sudah dibuat
- Data awal harus sudah ditambahkan

## Cara Menjalankan Testing

### 1. Testing Dasar
```bash
cd /run/media/jabiralawfaa/TKJ/PROJECT/BIG-PROJECT/manajemen-RKM/backend
node tests/test-get-endpoints.js
```

### 2. Testing Lanjutan
```bash
cd /run/media/jabiralawfaa/TKJ/PROJECT/BIG-PROJECT/manajemen-RKM/backend
node tests/test-get-endpoints-advanced.js
```

## Kebutuhan dari SRS

### RF-MA-002: Lihat Daftar Anggota
- [x] Tabel dengan pagination
- [x] Search functionality
- [x] Filter berdasarkan status
- [x] Tampilkan detail anggota

### RF-KP-002: Laporan Pemasukan
- [x] Rekap per bulan
- [x] Filter berdasarkan periode
- [x] Detail transaksi per anggota
- [ ] Grafik visualisasi (akan diimplementasikan di frontend)

### RF-KG-002: Laporan Pengeluaran
- [x] Rekap per kategori
- [x] Rekap per bulan
- [ ] Grafik perbandingan pemasukan vs pengeluaran (akan diimplementasikan di frontend)
- [ ] Neraca keuangan per bulan (akan diimplementasikan di frontend)

## Fitur Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)

## Status Testing
- Semua endpoint GET utama telah diuji
- Fungsi pagination dan filter berfungsi
- Otentikasi berfungsi dengan benar
- Respon data sesuai dengan skema database

## Catatan
- Testing dilakukan secara manual karena sistem ini belum menggunakan framework testing otomatis
- Untuk testing otomatis, sistem bisa diintegrasikan dengan Jest atau Mocha
- Endpoint grafik dan laporan akan diimplementasikan di frontend menggunakan Chart.js