const { pool } = require('../config/db');

// Fungsi untuk membuat tabel members jika belum ada
const createMembersTable = async () => {
  const query = `
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
  `;
  await pool.query(query);
};

// Fungsi untuk mencari semua member
const findAll = async (limit = 10, offset = 0) => {
  const query = `
    SELECT * FROM members 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

// Fungsi untuk mencari member berdasarkan ID
const findById = async (id) => {
  const query = 'SELECT * FROM members WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk mencari member berdasarkan nomor anggota
const findByMemberNumber = async (memberNumber) => {
  const query = 'SELECT * FROM members WHERE member_number = $1';
  const result = await pool.query(query, [memberNumber]);
  return result.rows[0];
};

// Fungsi untuk membuat member baru
const create = async (memberData) => {
  const query = `
    INSERT INTO members (
      registration_date, kk_number, member_number, head_name, 
      wife_name, phone, street, kelurahan, kecamatan, kabupaten, 
      beneficiary_name, dependents_count, status
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
    RETURNING *
  `;
  const result = await pool.query(query, [
    memberData.registrationDate,
    memberData.kkNumber,
    memberData.memberNumber,
    memberData.headName,
    memberData.wifeName,
    memberData.phone,
    memberData.street,
    memberData.kelurahan,
    memberData.kecamatan,
    memberData.kabupaten,
    memberData.beneficiaryName,
    memberData.dependentsCount,
    memberData.status
  ]);
  return result.rows[0];
};

// Fungsi untuk memperbarui member
const update = async (id, memberData) => {
  const query = `
    UPDATE members 
    SET 
      registration_date = $2, kk_number = $3, member_number = $4, 
      head_name = $5, wife_name = $6, phone = $7, street = $8, 
      kelurahan = $9, kecamatan = $10, kabupaten = $11, 
      beneficiary_name = $12, dependents_count = $13, status = $14, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [
    id,
    memberData.registrationDate,
    memberData.kkNumber,
    memberData.memberNumber,
    memberData.headName,
    memberData.wifeName,
    memberData.phone,
    memberData.street,
    memberData.kelurahan,
    memberData.kecamatan,
    memberData.kabupaten,
    memberData.beneficiaryName,
    memberData.dependentsCount,
    memberData.status
  ]);
  return result.rows[0];
};

// Fungsi untuk menghapus member
const remove = async (id) => {
  const query = 'DELETE FROM members WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Fungsi untuk mencari member dengan filter
const findByFilters = async (filters, limit = 10, offset = 0) => {
  let query = 'SELECT * FROM members WHERE 1=1';
  const params = [];
  let paramCount = 0;

  if (filters.status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    params.push(filters.status);
  }

  if (filters.search) {
    paramCount++;
    query += ` AND (head_name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

// Fungsi untuk menghitung total member dengan filter
const countByFilters = async (filters) => {
  let query = 'SELECT COUNT(*) as total FROM members WHERE 1=1';
  const params = [];
  let paramCount = 0;

  if (filters.status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    params.push(filters.status);
  }

  if (filters.search) {
    paramCount++;
    query += ` AND (head_name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].total);
};

module.exports = {
  createMembersTable,
  findAll,
  findById,
  findByMemberNumber,
  create,
  update,
  remove,
  findByFilters,
  countByFilters
};