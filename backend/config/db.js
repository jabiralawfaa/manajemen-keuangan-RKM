const { Pool } = require('pg');
require('dotenv').config();

// Konfigurasi koneksi ke database PostgreSQL
let pool;
if (process.env.DATABASE_URL) {
  // Jika DATABASE_URL disediakan (seperti di produksi), gunakan itu
  // Untuk NeonDB, pastikan sslmode disetel dengan benar di DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
} else {
  // Jika tidak, gunakan konfigurasi dari variabel lingkungan
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'rkm_db',
    password: process.env.DB_PASS || 'your_postgres_password',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
}

// Fungsi untuk menguji koneksi ke database
const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL Database Connected');
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);

    // Petunjuk jika koneksi gagal
    console.log('\n⚠️  PostgreSQL tidak ditemukan!');
    console.log('Silakan periksa koneksi database:');
    console.log('1. Pastikan database PostgreSQL berjalan (lokal atau cloud)');
    console.log('2. Periksa kredensial database di file .env');
    console.log('3. Jika menggunakan NeonDB, pastikan:');
    console.log('   - Database aktif (tidak dalam mode paused)');
    console.log('   - Kredensial benar');
    console.log('   - Akses jaringan diperbolehkan');
    console.log('4. Jika menggunakan koneksi SSL, pastikan konfigurasi benar');

    process.exit(1);
  }
};

module.exports = { pool, connectDB };