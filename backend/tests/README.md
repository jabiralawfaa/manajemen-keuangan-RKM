# Struktur Folder Testing untuk RKM Admin

## Overview
Folder `tests/` berisi semua file testing untuk sistem RKM Admin, diorganisir berdasarkan jenis dan tujuan pengujian.

## Struktur Folder

```
tests/
├── unit/                 # Unit tests untuk fungsi-fungsi individual
│   ├── test-core-js.js      # Testing fungsi dasar JavaScript
│   ├── test-db-connection.js # Testing koneksi database
│   └── ...
├── integration/          # Integration tests untuk endpoint-endpoint
│   ├── test-members.js      # Testing endpoint manajemen anggota
│   ├── test-payments.js     # Testing endpoint pembayaran
│   ├── test-expenses.js     # Testing endpoint pengeluaran
│   ├── test-auth.js         # Testing endpoint otentikasi
│   └── ...
├── functional/           # Functional tests untuk fitur-fitur spesifik
│   ├── inbound-parser.test.js    # Testing parser data masuk
│   ├── outbound-serializer.test.js # Testing serializer data keluar
│   ├── promise.test.js           # Testing promise handling
│   └── index.test.js             # Testing index module
└── e2e/                # End-to-end tests untuk alur penggunaan sistem
    ├── test-all-endpoints-comprehensive.js  # Testing semua endpoint secara menyeluruh
    ├── final-comprehensive-test.js          # Testing komprehensif akhir
    └── final-testing-summary.js             # Ringkasan hasil testing
```

## Jenis-jenis Testing

### 1. Unit Tests
- Menguji fungsi-fungsi individual
- Tidak bergantung pada database atau sistem eksternal
- Cepat dan fokus pada logika spesifik

### 2. Integration Tests
- Menguji endpoint-endpoint API
- Menguji interaksi antar modul
- Bergantung pada database dan middleware

### 3. Functional Tests
- Menguji fungsi-fungsi spesifik
- Menguji parser, serializer, dan helper functions
- Bergantung pada input/output tertentu

### 4. End-to-End (E2E) Tests
- Menguji alur penggunaan sistem secara menyeluruh
- Menguji semua endpoint secara komprehensif
- Menguji pembatasan akses berdasarkan role
- Menggunakan data aktual dari database

## Skrip Testing di package.json

```json
{
  "scripts": {
    "test-unit": "node tests/unit/*.js",
    "test-integration": "node tests/integration/*.js",
    "test-functional": "node tests/functional/*.js",
    "test-e2e": "node tests/e2e/*.js",
    "test-all": "npm run test-unit && npm run test-integration && npm run test-functional && npm run test-e2e"
  }
}
```

## Standar Penamaan File Testing

- `test-[deskripsi].js` - Untuk testing komponen spesifik
- `[nama-modul].test.js` - Untuk testing fungsi-fungsi dengan format Jest (jika digunakan)
- `[fitur]-[jenis-testing].js` - Untuk testing spesifik fitur dan jenis

## Panduan Menulis Testing

1. Gunakan format yang konsisten
2. Pastikan testing mencakup skenario sukses dan gagal
3. Uji pembatasan akses berdasarkan role
4. Gunakan data dummy untuk testing
5. Bersihkan data setelah testing selesai (jika diperlukan)