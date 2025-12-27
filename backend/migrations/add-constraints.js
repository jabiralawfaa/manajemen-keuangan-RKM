// migrations/add-constraints.js
const { pool } = require('../config/db');

/**
 * Menambahkan constraint dan index ke tabel-tabel jika belum ada
 */
const addConstraints = async () => {
  try {
    console.log('🔍 Memeriksa keberadaan constraint dan index...');

    // Menambahkan constraint unik untuk receipt_number di tabel payments jika belum ada
    try {
      await pool.query(`
        ALTER TABLE payments ADD CONSTRAINT unique_receipt_number UNIQUE (receipt_number);
      `);
      console.log('✅ Constraint unik untuk receipt_number ditambahkan');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Constraint unik untuk receipt_number sudah ada');
      } else {
        throw error;
      }
    }

    // Membuat index unik untuk expenses jika belum ada
    try {
      await pool.query(`
        CREATE UNIQUE INDEX idx_expenses_unique ON expenses (created_at, amount, description);
      `);
      console.log('✅ Index unik untuk expenses ditambahkan');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Index unik untuk expenses sudah ada');
      } else {
        throw error;
      }
    }

    console.log('🎉 Semua constraint dan index telah siap!');
  } catch (error) {
    console.error('❌ Error saat menambahkan constraint/index:', error.message);
    throw error;
  }
};

module.exports = { addConstraints };