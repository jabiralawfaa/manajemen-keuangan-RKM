// Script untuk menambahkan data contoh tambahan ke database
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function addAdditionalSampleData() {
  try {
    console.log('Menambahkan data contoh tambahan ke database...');

    // Menambahkan beberapa anggota tambahan
    const membersData = [
      {
        registration_date: new Date('2025-01-20'),
        kk_number: '2345678901234567',
        member_number: 'RKM-2025-002',
        head_name: 'Budi Santoso',
        wife_name: 'Sri Handayani',
        phone: '081234567892',
        street: 'Jl. Merdeka No. 45',
        kelurahan: 'Bakti Jaya',
        kecamatan: 'Sawangan',
        kabupaten: 'Depok',
        beneficiary_name: 'Budi Santoso',
        dependents_count: 3,
        status: 'active'
      },
      {
        registration_date: new Date('2025-02-01'),
        kk_number: '3456789012345678',
        member_number: 'RKM-2025-003',
        head_name: 'Rizki Pratama',
        wife_name: 'Dewi Lestari',
        phone: '081234567893',
        street: 'Jl. Sudirman No. 78',
        kelurahan: 'Menteng',
        kecamatan: 'Gambir',
        kabupaten: 'Jakarta Pusat',
        beneficiary_name: 'Rizki Pratama',
        dependents_count: 5,
        status: 'active'
      }
    ];

    for (const member of membersData) {
      await pool.query(`
        INSERT INTO members (registration_date, kk_number, member_number, head_name, 
          wife_name, phone, street, kelurahan, kecamatan, kabupaten, 
          beneficiary_name, dependents_count, status, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (member_number) DO NOTHING;
      `, [
        member.registration_date, member.kk_number, member.member_number, member.head_name,
        member.wife_name, member.phone, member.street, member.kelurahan, member.kecamatan,
        member.kabupaten, member.beneficiary_name, member.dependents_count, member.status,
        new Date(), new Date()
      ]);
    }
    console.log('✅ Anggota tambahan berhasil ditambahkan');

    // Menambahkan beberapa pembayaran tambahan
    const paymentsData = [
      {
        member_number: 'RKM-2025-002',
        payment_date: new Date('2025-02-05'),
        month: '2025-01',
        amount: 50000,
        receipt_number: 'INV-002'
      },
      {
        member_number: 'RKM-2025-003',
        payment_date: new Date('2025-02-10'),
        month: '2025-01',
        amount: 50000,
        receipt_number: 'INV-003'
      },
      {
        member_number: 'RKM-2025-001',
        payment_date: new Date('2025-02-15'),
        month: '2025-02',
        amount: 50000,
        receipt_number: 'INV-004'
      }
    ];

    for (const payment of paymentsData) {
      await pool.query(`
        INSERT INTO payments (member_id, payment_date, month, amount, receipt_number, created_at) 
        VALUES (
          (SELECT id FROM members WHERE member_number = $1), 
          $2, $3, $4, $5, $6
        )
        ON CONFLICT (receipt_number) DO NOTHING;
      `, [
        payment.member_number, 
        payment.payment_date, 
        payment.month, 
        payment.amount, 
        payment.receipt_number, 
        new Date()
      ]);
    }
    console.log('✅ Pembayaran tambahan berhasil ditambahkan');

    // Menambahkan beberapa pengeluaran tambahan
    const expensesData = [
      {
        date: new Date('2025-02-05'),
        category: 'kain_kafan',
        amount: 250000,
        description: 'Pembelian kain kafan'
      },
      {
        date: new Date('2025-02-10'),
        category: 'memandikan',
        amount: 300000,
        description: 'Biaya memandikan jenazah'
      },
      {
        date: new Date('2025-02-15'),
        category: 'alat_tulis',
        amount: 75000,
        description: 'Pembelian perlengkapan administrasi'
      }
    ];

    for (const expense of expensesData) {
      await pool.query(`
        INSERT INTO expenses (date, category, amount, description, created_by, created_at) 
        VALUES (
          $1, $2, $3, $4, 
          (SELECT id FROM users WHERE username = 'admin'), 
          $5
        )
        ON CONFLICT (created_at, amount, description) DO NOTHING;
      `, [expense.date, expense.category, expense.amount, expense.description, new Date()]);
    }
    console.log('✅ Pengeluaran tambahan berhasil ditambahkan');

    console.log('🎉 Semua data contoh tambahan telah ditambahkan!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error saat menambahkan data contoh tambahan:', error.message);
    await pool.end();
  }
}

addAdditionalSampleData();