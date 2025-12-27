// utils/helpers/database.js
const { pool } = require('../../config/db');

/**
 * Fungsi untuk memeriksa apakah koneksi ke database berfungsi
 */
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    return true;
  } catch (error) {
    console.error('❌ Error saat menguji koneksi database:', error.message);
    return false;
  }
};

/**
 * Fungsi untuk mendapatkan informasi tabel-tabel di database
 */
const getTableInfo = async () => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('❌ Error saat mengambil informasi tabel:', error.message);
    throw error;
  }
};

/**
 * Fungsi untuk menghitung jumlah data di setiap tabel
 */
const getTableCounts = async () => {
  try {
    const tableNames = await getTableInfo();
    const counts = {};
    
    for (const tableName of tableNames) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${tableName};`);
      counts[tableName] = parseInt(result.rows[0].count);
    }
    
    return counts;
  } catch (error) {
    console.error('❌ Error saat menghitung jumlah data tabel:', error.message);
    throw error;
  }
};

module.exports = {
  testConnection,
  getTableInfo,
  getTableCounts
};