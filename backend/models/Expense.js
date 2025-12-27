const { pool } = require('../config/db');

// Fungsi untuk membuat tabel expenses jika belum ada
const createExpensesTable = async () => {
  const query = `
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
  `;
  await pool.query(query);
};

// Fungsi untuk mencari semua pengeluaran
const findAll = async (limit = 10, offset = 0) => {
  const query = `
    SELECT e.*, u.name as created_by_name
    FROM expenses e
    LEFT JOIN users u ON e.created_by = u.id
    ORDER BY e.date DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

// Fungsi untuk mencari pengeluaran berdasarkan ID
const findById = async (id) => {
  const query = `
    SELECT e.*, u.name as created_by_name
    FROM expenses e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk membuat pengeluaran baru
const create = async (expenseData) => {
  const query = `
    INSERT INTO expenses (
      date, category, amount, description, 
      proof_image, created_by, sync_status, offline_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *
  `;
  const result = await pool.query(query, [
    expenseData.date,
    expenseData.category,
    expenseData.amount,
    expenseData.description,
    expenseData.proofImage,
    expenseData.createdBy,
    expenseData.syncStatus,
    expenseData.offlineId
  ]);
  return result.rows[0];
};

// Fungsi untuk memperbarui pengeluaran
const update = async (id, expenseData) => {
  const query = `
    UPDATE expenses 
    SET 
      date = $2, category = $3, amount = $4, 
      description = $5, proof_image = $6, sync_status = $7
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [
    id,
    expenseData.date,
    expenseData.category,
    expenseData.amount,
    expenseData.description,
    expenseData.proofImage,
    expenseData.syncStatus
  ]);
  return result.rows[0];
};

// Fungsi untuk menghapus pengeluaran
const remove = async (id) => {
  const query = 'DELETE FROM expenses WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk mencari pengeluaran berdasarkan kategori
const findByCategory = async (category) => {
  const query = `
    SELECT e.*, u.name as created_by_name
    FROM expenses e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.category = $1
    ORDER BY e.date DESC
  `;
  const result = await pool.query(query, [category]);
  return result.rows;
};

// Fungsi untuk mencari pengeluaran berdasarkan bulan
const findByMonth = async (month) => {
  const query = `
    SELECT e.*, u.name as created_by_name
    FROM expenses e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM $1::date)
      AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM $1::date)
    ORDER BY e.date DESC
  `;
  const result = await pool.query(query, [month]);
  return result.rows;
};

// Fungsi untuk mencari pengeluaran berdasarkan tahun
const findByYear = async (year) => {
  const query = `
    SELECT e.*, u.name as created_by_name
    FROM expenses e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE EXTRACT(YEAR FROM date) = $1
    ORDER BY e.date DESC
  `;
  const result = await pool.query(query, [year]);
  return result.rows;
};

// Fungsi untuk mendapatkan total pengeluaran
const getTotalExpenses = async (startDate, endDate) => {
  let query = 'SELECT SUM(amount) as total FROM expenses WHERE 1=1';
  const params = [];
  let paramCount = 0;

  if (startDate) {
    paramCount++;
    query += ` AND date >= $${paramCount}`;
    params.push(startDate);
  }

  if (endDate) {
    paramCount++;
    query += ` AND date <= $${paramCount}`;
    params.push(endDate);
  }

  const result = await pool.query(query, params);
  return result.rows[0].total || 0;
};

module.exports = {
  createExpensesTable,
  findAll,
  findById,
  create,
  update,
  remove,
  findByCategory,
  findByMonth,
  findByYear,
  getTotalExpenses
};