#!/bin/bash
# Script untuk seeding fresh database

echo "🔄 Menghapus semua tabel dari database..."
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

echo "🌱 Menjalankan migrasi dan seeding ulang..."
npm run migrate-and-seed

echo "✅ Seeding fresh selesai!"