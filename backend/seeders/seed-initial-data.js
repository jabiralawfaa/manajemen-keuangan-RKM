// seeders/seed-initial-data.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Menambahkan data awal ke database
 */
const seedInitialData = async () => {
  try {
    console.log('🌱 Memulai seeding data awal...');

    // Hash password default
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Menambahkan user admin jika belum ada
    const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (userCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (username, password, role, name, phone, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6);
      `, ['admin', hashedPassword, 'ketua', 'Admin RKM', '081234567890', new Date()]);
      console.log('✅ User admin ditambahkan');
    } else {
      console.log('ℹ️  User admin sudah ada');
    }

    // Menambahkan beberapa anggota contoh jika belum ada
    const memberCount = await pool.query('SELECT COUNT(*) FROM members');
    if (parseInt(memberCount.rows[0].count) === 0) {
      const membersData = [
        {
          registration_date: new Date('2025-01-15'),
          member_number: 'RKM-2025-001',
          name: 'Ahmad Fauzi',
          phone: '081234567891',
          rt_rw: '001/002',
          dusun: 'Dusun Mekar Jaya',
          desa: 'Sukamaju',
          kecamatan: 'Pancoran',
          kabupaten: 'Jakarta Selatan',
          dependents_count: 4,
          status: 'active'
        },
        {
          registration_date: new Date('2025-01-20'),
          member_number: 'RKM-2025-002',
          name: 'Budi Santoso',
          phone: '081234567892',
          rt_rw: '002/003',
          dusun: 'Dusun Bakti Jaya',
          desa: 'Bakti Jaya',
          kecamatan: 'Sawangan',
          kabupaten: 'Depok',
          dependents_count: 3,
          status: 'active'
        },
        {
          registration_date: new Date('2025-02-01'),
          member_number: 'RKM-2025-003',
          name: 'Rizki Pratama',
          phone: '081234567893',
          rt_rw: '003/004',
          dusun: 'Dusun Menteng',
          desa: 'Menteng',
          kecamatan: 'Gambir',
          kabupaten: 'Jakarta Pusat',
          dependents_count: 5,
          status: 'active'
        }
      ];

      for (const member of membersData) {
        await pool.query(`
          INSERT INTO members (registration_date, member_number, name, phone, rt_rw,
            dusun, desa, kecamatan, kabupaten, dependents_count, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `, [
          member.registration_date, member.member_number, member.name, member.phone, member.rt_rw,
          member.dusun, member.desa, member.kecamatan, member.kabupaten, member.dependents_count,
          member.status, new Date(), new Date()
        ]);
      }
      console.log('✅ Data anggota contoh ditambahkan');
    } else {
      console.log('ℹ️  Data anggota sudah ada');
    }

    // Menambahkan beberapa pembayaran contoh jika belum ada
    const paymentCount = await pool.query('SELECT COUNT(*) FROM payments');
    if (parseInt(paymentCount.rows[0].count) === 0) {
      const paymentsData = [
        {
          member_number: 'RKM-2025-001',
          payment_date: new Date('2025-01-20'),
          month: '2025-01',
          amount: 50000,
          receipt_number: 'INV-001'
        },
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
          );
        `, [
          payment.member_number, 
          payment.payment_date, 
          payment.month, 
          payment.amount, 
          payment.receipt_number, 
          new Date()
        ]);
      }
      console.log('✅ Data pembayaran contoh ditambahkan');
    } else {
      console.log('ℹ️  Data pembayaran sudah ada');
    }

    // Menambahkan beberapa pengeluaran contoh jika belum ada
    const expenseCount = await pool.query('SELECT COUNT(*) FROM expenses');
    if (parseInt(expenseCount.rows[0].count) === 0) {
      const expensesData = [
        {
          date: new Date('2025-01-25'),
          category: 'transportasi',
          amount: 150000,
          description: 'Transportasi ke pemakaman'
        },
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
          );
        `, [expense.date, expense.category, expense.amount, expense.description, new Date()]);
      }
      console.log('✅ Data pengeluaran contoh ditambahkan');
    } else {
      console.log('ℹ️  Data pengeluaran sudah ada');
    }

    // Menambahkan akun tambahan (bendahara dan sekretaris)
    const additionalUsers = [
      {
        username: 'bendahara1',
        password: hashedPassword,
        role: 'bendahara',
        name: 'Ahmad Hidayat',
        phone: '081234567894'
      },
      {
        username: 'bendahara2',
        password: hashedPassword,
        role: 'bendahara',
        name: 'Siti Rahmawati',
        phone: '081234567895'
      },
      {
        username: 'sekretaris1',
        password: hashedPassword,
        role: 'sekretaris',
        name: 'Rudi Santoso',
        phone: '081234567896'
      },
      {
        username: 'sekretaris2',
        password: hashedPassword,
        role: 'sekretaris',
        name: 'Lina Marlina',
        phone: '081234567897'
      }
    ];

    for (const user of additionalUsers) {
      const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [user.username]);

      if (userCheck.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (username, password, role, name, phone, created_at)
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [user.username, user.password, user.role, user.name, user.phone, new Date()]);
      }
    }
    console.log('✅ Akun tambahan (bendahara dan sekretaris) ditambahkan');

    console.log('🎉 Seeding data awal selesai!');
  } catch (error) {
    console.error('❌ Error saat seeding data awal:', error.message);
    throw error;
  }
};

// Jika file ini dijalankan langsung
if (require.main === module) {
  seedInitialData()
    .then(() => {
      console.log('✅ Seeding selesai.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding gagal:', error.message);
      process.exit(1);
    });
}

module.exports = { seedInitialData };