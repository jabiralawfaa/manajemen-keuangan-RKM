// utils/helpers/userInfo.js
const { pool } = require('../../config/db');

/**
 * Fungsi untuk mendapatkan informasi semua akun
 */
const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT username, role, name, phone, created_at FROM users ORDER BY role, username');
    return result.rows;
  } catch (error) {
    console.error('❌ Error saat mengambil informasi akun:', error.message);
    throw error;
  }
};

/**
 * Fungsi untuk mendapatkan jumlah akun berdasarkan role
 */
const getUserCountByRole = async () => {
  try {
    const result = await pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role 
      ORDER BY role;
    `);
    const counts = {};
    result.rows.forEach(row => {
      counts[row.role] = parseInt(row.count);
    });
    return counts;
  } catch (error) {
    console.error('❌ Error saat menghitung jumlah akun per role:', error.message);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserCountByRole
};