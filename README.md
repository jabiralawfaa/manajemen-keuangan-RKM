# RKM Admin - Sistem Manajemen Rukun Kematian Muslim

Sistem administrasi untuk mengelola keanggotaan dan keuangan RKM (Rukun Kematian Muslim) dengan dukungan PWA dan mode offline.

## Fitur Utama

- Manajemen data anggota
- Pencatatan pembayaran iuran bulanan
- Pencatatan pengeluaran operasional
- Pelaporan keuangan
- Dukungan PWA dengan mode offline menggunakan IndexedDB
- Sistem otentikasi dengan role-based access control

## Teknologi yang Digunakan

### Frontend
- React.js 18.2.0
- Vite 4.0.0
- Redux Toolkit 1.9.0
- React Router 6.8.0
- Tailwind CSS 3.2.0
- Workbox 6.5.0 (PWA)
- localForage 1.10.0 (IndexedDB)
- Axios 1.2.0
- Chart.js 4.2.0

### Backend
- Node.js 18.12.0
- Express.js 4.18.2
- PostgreSQL 15+
- Sequelize 6.32.0
- JWT 9.0.0
- Bcryptjs 2.4.3
- pg 8.11.0

## Instalasi

### Backend

1. Pastikan Node.js dan PostgreSQL sudah terinstal
2. Clone repository ini
3. Masuk ke direktori backend: `cd backend`
4. Install dependensi: `npm install`
5. Buat file `.env` berdasarkan `.env.example`
6. Inisialisasi database: `npm run init-db`
7. Jalankan server: `npm run dev`

### Frontend

1. Masuk ke direktori frontend: `cd frontend`
2. Install dependensi: `npm install`
3. Jalankan aplikasi: `npm run dev`

## Struktur Proyek

```
manajemen-RKM/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── middleware/
│   ├── config/
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── pages/
    │   ├── utils/
    │   ├── assets/
    │   ├── store/
    │   ├── api/
    │   ├── hooks/
    │   ├── contexts/
    │   └── styles/
    ├── public/
    ├── package.json
    └── vite.config.js
```

## Kontribusi

Silakan buat pull request untuk kontribusi pengembangan proyek ini.

## Lisensi

Proyek ini dilindungi oleh lisensi MIT.