const { pool } = require('../config/db');

// Fungsi untuk membuat tabel members jika belum ada
const createMembersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      registration_date DATE NOT NULL,
      member_number VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      rt_rw VARCHAR(100),
      dusun VARCHAR(255),
      desa VARCHAR(255),
      kecamatan VARCHAR(255),
      kabupaten VARCHAR(255),
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
      registration_date, member_number, name, phone, rt_rw, dusun,
      desa, kecamatan, kabupaten, dependents_count, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const result = await pool.query(query, [
    memberData.registrationDate,
    memberData.memberNumber,
    memberData.name,
    memberData.phone,
    memberData.rtRw,
    memberData.dusun,
    memberData.desa,
    memberData.kecamatan,
    memberData.kabupaten,
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
      registration_date = $2, member_number = $3, name = $4,
      phone = $5, rt_rw = $6, dusun = $7, desa = $8, kecamatan = $9,
      kabupaten = $10, dependents_count = $11, status = $12,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [
    id,
    memberData.registrationDate,
    memberData.memberNumber,
    memberData.name,
    memberData.phone,
    memberData.rtRw,
    memberData.dusun,
    memberData.desa,
    memberData.kecamatan,
    memberData.kabupaten,
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
const findByFilters = async (filters, limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'DESC') => {
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
    query += ` AND (name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }

  // Validasi sortBy dan sortOrder untuk mencegah SQL injection
  const allowedSortColumns = ['created_at', 'updated_at', 'name', 'member_number', 'registration_date'];
  const allowedSortOrders = ['ASC', 'DESC'];

  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const sortDirection = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

  query += ` ORDER BY ${sortColumn} ${sortDirection} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

// Fungsi untuk mencari member dengan filter tanggal pendaftaran
const findByFiltersWithDates = async (filters, limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'DESC') => {
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
    query += ` AND (name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }

  if (filters.registrationDateFrom) {
    paramCount++;
    query += ` AND registration_date >= $${paramCount}`;
    params.push(filters.registrationDateFrom);
  }

  if (filters.registrationDateTo) {
    paramCount++;
    query += ` AND registration_date <= $${paramCount}`;
    params.push(filters.registrationDateTo);
  }

  // Validasi sortBy dan sortOrder untuk mencegah SQL injection
  const allowedSortColumns = ['created_at', 'updated_at', 'name', 'member_number', 'registration_date'];
  const allowedSortOrders = ['ASC', 'DESC'];

  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const sortDirection = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

  query += ` ORDER BY ${sortColumn} ${sortDirection} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
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
    query += ` AND (name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].total);
};

// Fungsi untuk menghitung total member dengan filter tanggal pendaftaran
const countByFiltersWithDates = async (filters) => {
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
    query += ` AND (name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }

  if (filters.registrationDateFrom) {
    paramCount++;
    query += ` AND registration_date >= $${paramCount}`;
    params.push(filters.registrationDateFrom);
  }

  if (filters.registrationDateTo) {
    paramCount++;
    query += ` AND registration_date <= $${paramCount}`;
    params.push(filters.registrationDateTo);
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
  findByFiltersWithDates,
  countByFilters,
  countByFiltersWithDates
};