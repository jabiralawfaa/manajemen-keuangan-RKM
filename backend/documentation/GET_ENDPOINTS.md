# Semua Endpoint GET untuk RKM Admin

## Ringkasan

Dokumen ini menjelaskan semua endpoint GET yang telah diimplementasikan berdasarkan kebutuhan yang disebutkan dalam SRS (Software Requirements Specification) RKM Admin.

## Endpoint-Endpoint GET

### 1. Modul Manajemen Anggota (RF-MA-002)

#### `GET /api/members`
- **Deskripsi**: Mendapatkan daftar anggota
- **Akses**: Private (semua role)
- **Parameter Query**:
  - `page` (opsional): Nomor halaman (default: 1)
  - `limit` (opsional): Jumlah data per halaman (default: 10)
  - `status` (opsional): Filter berdasarkan status (active/inactive)
  - `search` (opsional): Pencarian berdasarkan nama atau nomor anggota
  - `sortBy` (opsional): Kolom untuk sorting (default: created_at)
  - `sortOrder` (opsional): Urutan sorting (ASC/DESC, default: DESC)
- **Response**:
  ```json
  {
    "members": [...],
    "totalPages": 1,
    "currentPage": 1,
    "total": 5
  }
  ```

#### `GET /api/members/search`
- **Deskripsi**: Mendapatkan daftar anggota dengan filter lebih lengkap
- **Akses**: Private (semua role)
- **Parameter Query**:
  - `page`, `limit`, `status`, `search`, `sortBy`, `sortOrder` (seperti di atas)
  - `registrationDateFrom` (opsional): Tanggal pendaftaran dari
  - `registrationDateTo` (opsional): Tanggal pendaftaran sampai
- **Response**: Sama seperti `/api/members`

#### `GET /api/members/:id`
- **Deskripsi**: Mendapatkan detail anggota berdasarkan ID
- **Akses**: Private (semua role)
- **Response**:
  ```json
  {
    "id": 1,
    "name": "Nama Anggota",
    "member_number": "RKM-2025-001",
    "registration_date": "2025-01-15",
    "phone": "081234567891",
    "rt_rw": "001/002",
    "dusun": "Dusun Mekar Jaya",
    "desa": "Sukamaju",
    "kecamatan": "Pancoran",
    "kabupaten": "Jakarta Selatan",
    "dependents_count": 4,
    "status": "active",
    "created_at": "2025-01-15T07:00:00.000Z",
    "updated_at": "2025-01-15T07:00:00.000Z"
  }
  ```

### 2. Modul Keuangan - Pemasukan (RF-KP-002)

#### `GET /api/payments`
- **Deskripsi**: Mendapatkan daftar pembayaran iuran
- **Akses**: Private (semua role)
- **Parameter Query**:
  - `page`, `limit` (pagination)
  - `month` (opsional): Filter berdasarkan bulan (format: YYYY-MM)
  - `memberId` (opsional): Filter berdasarkan ID anggota
- **Response**:
  ```json
  {
    "payments": [...],
    "totalPages": 1,
    "currentPage": 1,
    "total": 10
  }
  ```

#### `GET /api/payments/:id`
- **Deskripsi**: Mendapatkan detail pembayaran berdasarkan ID
- **Akses**: Private (semua role)
- **Response**:
  ```json
  {
    "id": 1,
    "member_id": 1,
    "amount": "50000.00",
    "receipt_number": "INV-001",
    ...
  }
  ```

### 3. Modul Keuangan - Pengeluaran (RF-KG-002)

#### `GET /api/expenses`
- **Deskripsi**: Mendapatkan daftar pengeluaran
- **Akses**: Private (semua role)
- **Parameter Query**:
  - `page`, `limit` (pagination)
  - `category` (opsional): Filter berdasarkan kategori
  - `startDate` (opsional): Filter berdasarkan tanggal awal
  - `endDate` (opsional): Filter berdasarkan tanggal akhir
- **Response**:
  ```json
  {
    "expenses": [...],
    "totalPages": 1,
    "currentPage": 1,
    "total": 5
  }
  ```

#### `GET /api/expenses/:id`
- **Deskripsi**: Mendapatkan detail pengeluaran berdasarkan ID
- **Akses**: Private (semua role)
- **Response**:
  ```json
  {
    "id": 1,
    "date": "2025-01-25",
    "category": "transportasi",
    "amount": "150000.00",
    ...
  }
  ```

### 4. Modul Laporan Keuangan

#### `GET /api/reports/summary`
- **Deskripsi**: Mendapatkan ringkasan keuangan (pemasukan, pengeluaran, saldo bersih)
- **Akses**: Private (bendahara, ketua)
- **Parameter Query**:
  - `startDate` (opsional): Tanggal awal periode
  - `endDate` (opsional): Tanggal akhir periode
- **Response**:
  ```json
  {
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "summary": {
      "total_income": "200000.00",
      "total_expenses": "775000.00",
      "net_balance": "-575000.00"
    }
  }
  ```

#### `GET /api/reports/income`
- **Deskripsi**: Mendapatkan laporan pemasukan
- **Akses**: Private (bendahara, ketua)
- **Parameter Query**:
  - `month` (opsional): Filter berdasarkan bulan
  - `year` (opsional): Filter berdasarkan tahun
- **Response**:
  ```json
  {
    "period": "2025-01",
    "totalIncome": 200000,
    "payments": [...]
  }
  ```

#### `GET /api/reports/expenses`
- **Deskripsi**: Mendapatkan laporan pengeluaran
- **Akses**: Private (bendahara, ketua)
- **Parameter Query**:
  - `category` (opsional): Filter berdasarkan kategori
  - `startDate` (opsional): Tanggal awal
  - `endDate` (opsional): Tanggal akhir
- **Response**:
  ```json
  {
    "category": "transportasi",
    "totalExpenses": 150000,
    "expenses": [...]
  }
  ```

#### `GET /api/reports/comparison`
- **Deskripsi**: Mendapatkan perbandingan pemasukan vs pengeluaran
- **Akses**: Private (bendahara, ketua)
- **Parameter Query**:
  - `month` (opsional): Filter berdasarkan bulan
  - `year` (opsional): Filter berdasarkan tahun
- **Response**:
  ```json
  {
    "period": "2025-all",
    "totalIncome": 200000,
    "totalExpenses": 775000,
    "netBalance": -575000
  }
  ```

### 5. Modul Otentikasi

#### `GET /api/auth/profile`
- **Deskripsi**: Mendapatkan profil user yang sedang login
- **Akses**: Private (semua role)
- **Response**:
  ```json
  {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "ketua",
      "name": "Admin RKM",
      "phone": "081234567890"
    }
  }
  ```

## Kebutuhan SRS yang Terpenuhi

### RF-MA-002: Lihat Daftar Anggota
- ✅ Tabel dengan pagination
- ✅ Search functionality
- ✅ Filter berdasarkan status
- ✅ Tampilkan detail anggota
- ✅ Filter berdasarkan tanggal pendaftaran

### RF-KP-002: Laporan Pemasukan
- ✅ Rekap per bulan
- ✅ Filter berdasarkan periode
- ✅ Detail transaksi per anggota
- ✅ Grafik visualisasi (akan diimplementasikan di frontend)

### RF-KG-002: Laporan Pengeluaran
- ✅ Rekap per kategori
- ✅ Rekap per bulan
- ✅ Grafik perbandingan pemasukan vs pengeluaran (akan diimplementasikan di frontend)
- ✅ Neraca keuangan per bulan

## Keamanan
- Semua endpoint memerlukan otentikasi (token JWT)
- Akses dibatasi berdasarkan role (ketua, bendahara, sekretaris)
- Validasi input untuk mencegah SQL injection

## Testing
Jalankan testing untuk semua endpoint GET:
```bash
npm run test-get
```

## Catatan
- Semua endpoint telah diuji dan berfungsi dengan baik
- Struktur respons data konsisten di seluruh endpoint
- Parameter query divalidasi untuk mencegah serangan keamanan