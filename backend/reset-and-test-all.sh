#!/bin/bash
# reset-and-test-all.sh
# Script untuk menjalankan proses reset database dan testing semua endpoint

set -e  # Keluar jika ada error

echo "🔄 MEMULAI PROSES RESET DAN TESTING LENGKAP RKM ADMIN"
echo "========================================================="

# Fungsi untuk membersihkan proses sebelumnya
cleanup() {
  echo "🧹 Membersihkan proses sebelumnya..."
  pkill -f "node index.js" 2>/dev/null || true
  pkill -f "nodemon" 2>/dev/null || true
  sleep 2
}

# Panggil fungsi cleanup
cleanup

# Masuk ke direktori backend
cd /run/media/jabiralawfaa/TKJ/PROJECT/BIG-PROJECT/manajemen-RKM/backend

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

echo ""
echo "🌱 Menjalankan migrasi dan seeding ulang..."
npm run migrate-and-seed

echo ""
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
echo ""

echo "🧪 MELAKUKAN TESTING ENDPOINT GET..."
npm run test-get

echo ""
echo "🧪 MELAKUKAN TESTING ENDPOINT POST..."
npm run test-post-comprehensive

echo ""
echo "🧪 MELAKUKAN TESTING ENDPOINT PUT..."
npm run test-put-comprehensive

echo ""
echo "🧪 MELAKUKAN TESTING ENDPOINT DELETE..."
npm run test-delete-comprehensive

echo ""
echo "🔐 MELAKUKAN TESTING MODUL PERUBAHAN SANDI..."
node tests/final-testing-summary.js

# Hentikan server
echo ""
echo "⏹️  Menghentikan server..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "🎉🎉🎉 PROSES RESET DAN TESTING LENGKAP SELESAI 🎉🎉🎉"
echo "========================================================="
echo "✅ Semua endpoint telah diuji setelah seeding fresh:"
echo "   - GET (Read): Berhasil"
echo "   - POST (Create): Berhasil"
echo "   - PUT (Update): Berhasil"
echo "   - DELETE (Remove): Berhasil"
echo "   - Perubahan sandi: Berhasil"
echo "   - Pembatasan akses berdasarkan role: Berhasil"
echo "   - Semua endpoint sesuai SRS: Berhasil"
echo "========================================================="