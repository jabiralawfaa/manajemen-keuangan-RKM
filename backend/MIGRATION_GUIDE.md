# Panduan Migrasi Database untuk RKM Admin

## Struktur Folder Migrasi

```
backend/
├── migrations/
│   ├── create-tables.js      # Membuat tabel-tabel utama
│   ├── add-constraints.js    # Menambahkan constraint dan index
│   ├── migrate.js           # File utama untuk migrasi
│   └── migrate-and-seed.js  # File untuk migrasi dan seeding
├── seeders/
│   └── seed-initial-data.js # Menambahkan data awal
├── services/
│   └── databaseService.js   # Layanan untuk manajemen database
└── utils/helpers/
    └── database.js          # Fungsi-fungsi helper database
```

## Perintah Migrasi

### 1. Migrasi Tabel Saja
```bash
npm run migrate
```
Perintah ini hanya akan membuat tabel-tabel jika belum ada.

### 2. Seeding Data Saja
```bash
npm run seed
```
Perintah ini hanya akan menambahkan data awal jika belum ada.

### 3. Migrasi dan Seeding (Rekomendasi)
```bash
npm run migrate-and-seed
```
Perintah ini akan menjalankan migrasi tabel dan seeding data secara lengkap.

### 4. Cek Kesehatan Database
```bash
npm run db-health
```
Perintah ini akan mengecek koneksi dan menampilkan informasi tabel beserta jumlah datanya.

## Tabel-tabel yang Dibuat

### 1. users
- id: SERIAL PRIMARY KEY
- username: VARCHAR(255) UNIQUE NOT NULL
- password: VARCHAR(255) NOT NULL
- role: VARCHAR(50) NOT NULL (CHECK: ketua, bendahara, sekretaris)
- name: VARCHAR(255) NOT NULL
- phone: VARCHAR(20)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- last_login: TIMESTAMP
- sync_token: VARCHAR(255)

## Akun Default yang Dibuat

### Akun Admin (ketua)
- Username: `admin`
- Password: `password123`
- Role: `ketua`
- Nama: `Admin RKM`

### Akun Bendahara
- Username: `bendahara1`
- Password: `password123`
- Role: `bendahara`
- Nama: `Ahmad Hidayat`

- Username: `bendahara2`
- Password: `password123`
- Role: `bendahara`
- Nama: `Siti Rahmawati`

### Akun Sekretaris
- Username: `sekretaris1`
- Password: `password123`
- Role: `sekretaris`
- Nama: `Rudi Santoso`

- Username: `sekretaris2`
- Password: `password123`
- Role: `sekretaris`
- Nama: `Lina Marlina`

### 2. members
- id: SERIAL PRIMARY KEY
- registration_date: DATE NOT NULL
- kk_number: VARCHAR(255)
- member_number: VARCHAR(100) UNIQUE NOT NULL
- head_name: VARCHAR(255) NOT NULL
- wife_name: VARCHAR(255)
- phone: VARCHAR(20)
- street: VARCHAR(255)
- kelurahan: VARCHAR(255)
- kecamatan: VARCHAR(255)
- kabupaten: VARCHAR(255)
- beneficiary_name: VARCHAR(255) NOT NULL
- dependents_count: INTEGER DEFAULT 0
- status: VARCHAR(20) DEFAULT 'active' (CHECK: active, inactive)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 3. payments
- id: SERIAL PRIMARY KEY
- member_id: INTEGER REFERENCES members(id) ON DELETE CASCADE
- payment_date: DATE NOT NULL
- month: VARCHAR(7) NOT NULL
- amount: DECIMAL(10, 2) NOT NULL
- receipt_number: VARCHAR(255) UNIQUE
- proof_image: VARCHAR(500)
- sync_status: VARCHAR(20) DEFAULT 'pending' (CHECK: pending, synced, failed)
- offline_id: VARCHAR(255)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 4. expenses
- id: SERIAL PRIMARY KEY
- date: DATE NOT NULL
- category: VARCHAR(50) NOT NULL (CHECK: kain_kafan, memandikan, transportasi, alat_tulis, lain_lain)
- amount: DECIMAL(10, 2) NOT NULL
- description: TEXT
- proof_image: VARCHAR(500)
- created_by: INTEGER REFERENCES users(id)
- sync_status: VARCHAR(20) DEFAULT 'pending' (CHECK: pending, synced, failed)
- offline_id: VARCHAR(255)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## Constraint dan Index

- Constraint unik untuk `receipt_number` di tabel `payments`
- Index unik untuk kombinasi `(created_at, amount, description)` di tabel `expenses`

## Fitur Pengkondisian

Semua file migrasi dirancang untuk:
- Membuat tabel hanya jika belum ada (menggunakan `IF NOT EXISTS`)
- Menambahkan constraint hanya jika belum ada
- Menambahkan data awal hanya jika belum ada
- Tidak menghapus data yang sudah ada

## Panduan Penggunaan

### Untuk Instalasi Baru
1. Pastikan konfigurasi database di `.env` sudah benar
2. Jalankan: `npm run migrate-and-seed`

### Untuk Update Struktur
1. Jika hanya ingin memperbarui struktur tabel: `npm run migrate`
2. Jika hanya ingin menambahkan data awal: `npm run seed`

### Untuk Verifikasi
1. Untuk memeriksa kesehatan database: `npm run db-health`

## Troubleshooting

### Jika migrasi gagal
- Pastikan koneksi database aktif
- Periksa konfigurasi di file `.env`
- Pastikan kredensial database benar

### Jika tabel sudah ada
- File migrasi dirancang untuk tidak membuat duplikat
- Tabel hanya akan dibuat jika belum ada

### Jika data sudah ada
- Proses seeding akan melewati data yang sudah ada
- Tidak akan membuat duplikat data