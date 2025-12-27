const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'rkm_db',
  password: process.env.DB_PASS || 'your_postgres_password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const createTables = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Membuat tabel users
    await client.query(`
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

    // Membuat tabel members
    await client.query(`
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

    // Membuat tabel payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
        payment_date DATE NOT NULL,
        month VARCHAR(7) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        receipt_number VARCHAR(255),
        proof_image VARCHAR(500),
        sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
        offline_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Membuat tabel expenses
    await client.query(`
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

    console.log('Tables created successfully');
    await client.end();
  } catch (err) {
    console.error('Error creating tables:', err);
    await client.end();
  }
};

createTables();