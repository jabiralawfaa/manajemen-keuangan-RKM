# Panduan Koneksi ke NeonDB

## Masalah Umum dan Solusi

### 1. Koneksi Gagal (ECONNRESET)
Jika Anda mengalami error `ECONNRESET` saat mencoba terhubung ke NeonDB, kemungkinan besar disebabkan oleh:

- **Database dalam mode paused**: NeonDB secara otomatis memasukkan database ke mode paused setelah periode tidak aktif. Pastikan database Anda aktif.
- **SSL Configuration**: NeonDB memerlukan koneksi SSL yang benar.
- **Kredensial salah**: Periksa kembali username, password, dan nama database.
- **Akses jaringan**: Beberapa jaringan mungkin membatasi koneksi ke database eksternal.

### 2. Solusi Langkah-demi-Langkah

#### A. Pastikan Database NeonDB Aktif
1. Login ke dashboard NeonDB Anda
2. Pastikan status database adalah "Active" bukan "Paused"
3. Jika dalam mode paused, aktifkan kembali database Anda

#### B. Periksa Kredensial
1. Pastikan `DATABASE_URL` di file `.env` benar
2. Contoh format yang benar:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_m2TaNwolPH0Z@ep-sweet-violet-a1gsk664-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

#### C. Coba Koneksi dengan SSL Mode Lain
Beberapa konfigurasi SSL yang bisa dicoba di `DATABASE_URL`:
- `sslmode=require`
- `sslmode=prefer`
- `sslmode=no-verify`

#### D. Gunakan Database Lokal untuk Development
Jika koneksi ke NeonDB terus gagal, Anda bisa menggunakan database PostgreSQL lokal untuk development:

1. Instal PostgreSQL di lokal Anda
2. Buat database bernama `rkm_db`
3. Update file `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rkm_db
   DB_USER=postgres
   DB_PASS=your_local_password
   ```

### 3. Testing Koneksi
Anda bisa menggunakan perintah berikut untuk testing koneksi:

```bash
# Jika menggunakan psql
psql "postgresql://neondb_owner:npg_m2TaNwolPH0Z@ep-sweet-violet-a1gsk664-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Jika menggunakan Node.js
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_m2TaNwolPH0Z@ep-sweet-violet-a1gsk664-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});
client.connect()
  .then(() => console.log('Connected!'))
  .then(() => client.end());
"
```

### 4. Troubleshooting Tambahan
- Pastikan firewall lokal Anda tidak memblokir koneksi ke eksternal
- Coba dari jaringan berbeda untuk menguji apakah ada pembatasan jaringan
- Periksa dokumentasi resmi NeonDB untuk konfigurasi spesifik

## Konfigurasi untuk Production
Saat deployment ke production, pastikan:
- `NODE_ENV` disetel ke `production`
- Gunakan SSL untuk semua koneksi production
- Simpan kredensial database dengan aman
- Gunakan connection pooling yang sesuai