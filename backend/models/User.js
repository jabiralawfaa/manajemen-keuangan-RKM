const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// Fungsi untuk membuat tabel users jika belum ada
const createUsersTable = async () => {
  const query = `
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
  `;
  await pool.query(query);
};

// Fungsi untuk mencari user berdasarkan username
const findByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

// Fungsi untuk mencari user berdasarkan ID
const findById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk membuat user baru
const create = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const query = `
    INSERT INTO users (username, password, role, name, phone) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, username, role, name, phone, created_at
  `;
  const result = await pool.query(query, [
    userData.username,
    hashedPassword,
    userData.role,
    userData.name,
    userData.phone
  ]);
  return result.rows[0];
};

// Fungsi untuk mendapatkan semua user
const findAll = async () => {
  const query = 'SELECT id, username, role, name, phone, created_at FROM users';
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createUsersTable,
  findByUsername,
  findById,
  create,
  findAll
};