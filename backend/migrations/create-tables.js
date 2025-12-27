// migrations/create-tables.js
const { pool } = require('../config/db');

/**
 * Membuat tabel-tabel untuk sistem RKM Admin jika belum ada
 */
const createTables = async () => {
  try {
    console.log('🔍 Memeriksa keberadaan tabel...');

    // Membuat tabel users jika belum ada
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('ketua', 'bendahara', 'sekretaris')),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        sync_token VARCHAR(255)
      );
    `);
    console.log('✅ Tabel users siap digunakan');

    // Membuat tabel members jika belum ada
    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        registration_date DATE NOT NULL,
        kk_number VARCHAR(255),
        member_number VARCHAR(100) UNIQUE NOT NULL,
        head_name VARCHAR(255) NOT NULL,
        wife_name VARCHAR(255),
        phone VARCHAR(20),
        street VARCHAR(255),
        kelurahan VARCHAR(255),
        kecamatan VARCHAR(255),
        kabupaten VARCHAR(255),
        beneficiary_name VARCHAR(255) NOT NULL,
        dependents_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabel members siap digunakan');

    // Membuat tabel payments jika belum ada
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
        payment_date DATE NOT NULL,
        month VARCHAR(7) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        receipt_number VARCHAR(255) UNIQUE,
        proof_image VARCHAR(500),
        sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
        offline_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabel payments siap digunakan');

    // Membuat tabel expenses jika belum ada
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('kain_kafan', 'memandikan', 'transportasi', 'alat_tulis', 'lain_lain')),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        proof_image VARCHAR(500),
        created_by INTEGER REFERENCES users(id),
        sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
        offline_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabel expenses siap digunakan');

    console.log('🎉 Semua tabel telah siap digunakan!');
  } catch (error) {
    console.error('❌ Error saat membuat tabel:', error.message);
    throw error;
  }
};

module.exports = { createTables };