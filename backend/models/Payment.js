const { pool } = require('../config/db');

// Fungsi untuk membuat tabel payments jika belum ada
const createPaymentsTable = async () => {
  const query = `
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
  `;
  await pool.query(query);
};

// Fungsi untuk mencari semua pembayaran
const findAll = async (limit = 10, offset = 0) => {
  const query = `
    SELECT p.*, m.name, m.member_number
    FROM payments p
    LEFT JOIN members m ON p.member_id = m.id
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

// Fungsi untuk mencari pembayaran berdasarkan ID
const findById = async (id) => {
  const query = `
    SELECT p.*, m.name, m.member_number
    FROM payments p
    LEFT JOIN members m ON p.member_id = m.id
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk mencari pembayaran berdasarkan ID member
const findByMemberId = async (memberId) => {
  const query = `
    SELECT * FROM payments 
    WHERE member_id = $1 
    ORDER BY payment_date DESC
  `;
  const result = await pool.query(query, [memberId]);
  return result.rows;
};

// Fungsi untuk membuat pembayaran baru
const create = async (paymentData) => {
  const query = `
    INSERT INTO payments (
      member_id, payment_date, month, amount, 
      receipt_number, proof_image, sync_status, offline_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *
  `;
  const result = await pool.query(query, [
    paymentData.memberId,
    paymentData.paymentDate,
    paymentData.month,
    paymentData.amount,
    paymentData.receiptNumber,
    paymentData.proofImage,
    paymentData.syncStatus,
    paymentData.offlineId
  ]);
  return result.rows[0];
};

// Fungsi untuk memperbarui pembayaran
const update = async (id, paymentData) => {
  const query = `
    UPDATE payments 
    SET 
      member_id = $2, payment_date = $3, month = $4, 
      amount = $5, receipt_number = $6, proof_image = $7, 
      sync_status = $8
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [
    id,
    paymentData.memberId,
    paymentData.paymentDate,
    paymentData.month,
    paymentData.amount,
    paymentData.receiptNumber,
    paymentData.proofImage,
    paymentData.syncStatus
  ]);
  return result.rows[0];
};

// Fungsi untuk menghapus pembayaran
const remove = async (id) => {
  const query = 'DELETE FROM payments WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk mencari pembayaran berdasarkan bulan
const findByMonth = async (month) => {
  const query = `
    SELECT p.*, m.name, m.member_number
    FROM payments p
    LEFT JOIN members m ON p.member_id = m.id
    WHERE p.month = $1
    ORDER BY p.payment_date DESC
  `;
  const result = await pool.query(query, [month]);
  return result.rows;
};

// Fungsi untuk mencari pembayaran berdasarkan tahun
const findByYear = async (year) => {
  const query = `
    SELECT p.*, m.name, m.member_number
    FROM payments p
    LEFT JOIN members m ON p.member_id = m.id
    WHERE EXTRACT(YEAR FROM payment_date) = $1
    ORDER BY p.payment_date DESC
  `;
  const result = await pool.query(query, [year]);
  return result.rows;
};

module.exports = {
  createPaymentsTable,
  findAll,
  findById,
  findByMemberId,
  create,
  update,
  remove,
  findByMonth,
  findByYear
};