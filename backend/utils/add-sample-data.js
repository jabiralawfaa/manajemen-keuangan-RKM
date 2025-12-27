// Script untuk menambahkan data contoh ke database
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function addSampleData() {
  try {
    console.log('Menambahkan data contoh ke database...');

    // Hash password untuk user admin
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Menambahkan user admin (ketua)
    const userResult = await pool.query(`
      INSERT INTO users (username, password, role, name, phone, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, ['admin', hashedPassword, 'ketua', 'Admin RKM', '081234567890', new Date()]);
    
    if (userResult.rows.length > 0) {
      console.log('✅ User admin berhasil ditambahkan');
    } else {
      console.log('ℹ️  User admin sudah ada');
    }

    // Menambahkan contoh anggota
    const memberResult = await pool.query(`
      INSERT INTO members (registration_date, kk_number, member_number, head_name, 
        wife_name, phone, street, kelurahan, kecamatan, kabupaten, 
        beneficiary_name, dependents_count, status, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (member_number) DO NOTHING
      RETURNING *;
    `, [
      new Date('2025-01-15'), '1234567890123456', 'RKM-2025-001', 'Ahmad Fauzi', 
      'Siti Aminah', '081234567891', 'Jl. Raya No. 123', 'Sukamaju', 
      'Pancoran', 'Jakarta Selatan', 'Ahmad Fauzi', 4, 'active', 
      new Date(), new Date()
    ]);
    
    if (memberResult.rows.length > 0) {
      console.log('✅ Anggota contoh berhasil ditambahkan');
    } else {
      console.log('ℹ️  Anggota contoh sudah ada');
    }

    // Menambahkan contoh pembayaran
    const paymentResult = await pool.query(`
      INSERT INTO payments (member_id, payment_date, month, amount, receipt_number, created_at)
      VALUES (
        (SELECT id FROM members WHERE member_number = 'RKM-2025-001'),
        $1, $2, $3, $4, $5
      )
      ON CONFLICT (receipt_number) DO NOTHING
      RETURNING *;
    `, [new Date('2025-01-20'), '2025-01', 50000, 'INV-001', new Date()]);
    
    if (paymentResult.rows.length > 0) {
      console.log('✅ Pembayaran contoh berhasil ditambahkan');
    } else {
      console.log('ℹ️  Pembayaran contoh sudah ada');
    }

    // Menambahkan contoh pengeluaran
    const expenseResult = await pool.query(`
      INSERT INTO expenses (date, category, amount, description, created_by, created_at) 
      VALUES (
        $1, $2, $3, $4, 
        (SELECT id FROM users WHERE username = 'admin'), 
        $5
      )
      ON CONFLICT (created_at, amount, description) DO NOTHING
      RETURNING *;
    `, [new Date('2025-01-25'), 'transportasi', 150000, 'Transportasi ke pemakaman', new Date()]);
    
    if (expenseResult.rows.length > 0) {
      console.log('✅ Pengeluaran contoh berhasil ditambahkan');
    } else {
      console.log('ℹ️  Pengeluaran contoh sudah ada');
    }

    console.log('🎉 Semua data contoh telah diproses!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error saat menambahkan data contoh:', error.message);
    await pool.end();
  }
}

addSampleData();