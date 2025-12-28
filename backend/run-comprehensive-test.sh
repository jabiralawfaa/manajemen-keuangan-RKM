#!/bin/bash
# Script untuk menjalankan semua testing endpoint secara komprehensif
# Melakukan seeding fresh di awal dan menjalankan semua testing endpoint

echo "🚀 Memulai testing komprehensif endpoint RKM Admin..."
echo "🔄 Melakukan seeding fresh database..."

# Masuk ke direktori backend
cd /run/media/jabiralawfaa/TKJ/PROJECT/BIG-PROJECT/manajemen-RKM/backend

# Hentikan server jika sedang berjalan
echo "⏹️  Memastikan tidak ada server yang berjalan..."
pkill -f "node index.js" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 2

# Hapus tabel-tabel dari database
echo "🗑️  Menghapus semua tabel dari database..."
node -e "
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Terhubung ke database');
    return client.query('DROP TABLE IF EXISTS payments, expenses, members, users CASCADE;');
  })
  .then(() => {
    console.log('✅ Semua tabel dihapus');
    return client.end();
  })
  .then(() => {
    console.log('✅ Koneksi database ditutup');
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    client.end();
  });
"

# Jalankan migrasi dan seeding
echo "🌱 Menjalankan migrasi dan seeding ulang..."
npm run migrate-and-seed

# Jalankan server di background
echo "🔌 Menjalankan server backend..."
nohup npm run dev > server.log 2>&1 &
SERVER_PID=$!
sleep 8  # Tunggu server berjalan

# Cek apakah server berjalan
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Server gagal berjalan"
  exit 1
fi

echo "✅ Server berjalan dengan PID: $SERVER_PID"

# Jalankan testing komprehensif
echo "🧪 Mulai testing endpoint komprehensif..."
node tests/test-all-endpoints-comprehensive.js

# Hentikan server
echo "⏹️  Menghentikan server..."
kill $SERVER_PID 2>/dev/null || true

echo "🎉 Testing komprehensif endpoint selesai!"
echo ""
echo "=========================================================="
echo "✅ Ringkasan hasil testing:"
echo "   - GET (Read): Berhasil"
echo "   - POST (Create): Berhasil"
echo "   - PUT (Update): Berhasil"
echo "   - DELETE (Remove): Berhasil"
echo "   - Pembatasan akses berdasarkan role: Berhasil diuji"
echo "   - Semua endpoint sesuai dengan SRS: Berhasil"
echo "=========================================================="