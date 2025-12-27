// seeders/seed-additional-users.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Menambahkan akun-akun tambahan ke database
 */
const seedAdditionalUsers = async () => {
  try {
    console.log('👥 Memulai seeding akun tambahan...');

    // Hash password default
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Data akun tambahan
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

    // Menambahkan akun-akun tambahan jika belum ada
    for (const user of additionalUsers) {
      const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [user.username]);
      
      if (userCheck.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (username, password, role, name, phone, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [user.username, user.password, user.role, user.name, user.phone, new Date()]);
        console.log(`✅ Akun ${user.username} (${user.role}) ditambahkan`);
      } else {
        console.log(`ℹ️  Akun ${user.username} (${user.role}) sudah ada`);
      }
    }

    console.log('🎉 Seeding akun tambahan selesai!');
  } catch (error) {
    console.error('❌ Error saat seeding akun tambahan:', error.message);
    throw error;
  }
};

// Jika file ini dijalankan langsung
if (require.main === module) {
  seedAdditionalUsers()
    .then(() => {
      console.log('✅ Seeding akun tambahan selesai.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding akun tambahan gagal:', error.message);
      process.exit(1);
    });
}

module.exports = { seedAdditionalUsers };