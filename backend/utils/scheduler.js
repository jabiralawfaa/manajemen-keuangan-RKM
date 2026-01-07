// backend/utils/scheduler.js
const cron = require('node-cron');
const { pool } = require('../config/db');

// Fungsi untuk menambahkan tanggungan ke semua anggota aktif setiap minggu
const scheduleWeeklyDependentsIncrease = () => {
  // Menjadwalkan tugas setiap minggu pada hari Senin pukul 00:00
  cron.schedule('0 0 * * 1', async () => {
    console.log('Menjalankan penambahan tanggungan mingguan...');
    
    try {
      // Ambil semua anggota aktif
      const activeMembersQuery = 'SELECT id, dependents_count FROM members WHERE status = $1';
      const activeMembersResult = await pool.query(activeMembersQuery, ['active']);
      
      const members = activeMembersResult.rows;
      
      if (members.length > 0) {
        // Gunakan transaksi untuk memastikan konsistensi data
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          
          for (const member of members) {
            const newDependentsCount = member.dependents_count + 1;
            
            const updateQuery = 'UPDATE members SET dependents_count = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
            await client.query(updateQuery, [newDependentsCount, member.id]);
          }
          
          await client.query('COMMIT');
          console.log(`Penambahan tanggungan selesai. Jumlah anggota yang diproses: ${members.length}`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error('Error saat menambahkan tanggungan mingguan:', error);
          throw error;
        } finally {
          client.release();
        }
      } else {
        console.log('Tidak ada anggota aktif untuk ditambahkan tanggungannya');
      }
    } catch (error) {
      console.error('Error dalam scheduler penambahan tanggungan mingguan:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta"
  });
  
  console.log('Scheduler penambahan tanggungan mingguan telah diatur');
};

module.exports = {
  scheduleWeeklyDependentsIncrease
};