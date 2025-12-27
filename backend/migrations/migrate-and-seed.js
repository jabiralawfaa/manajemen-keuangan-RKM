// migrations/migrate-and-seed.js
const { migrate } = require('./migrate');
const { seedInitialData } = require('../seeders/seed-initial-data');

/**
 * Fungsi utama untuk menjalankan migrasi dan seeding
 */
const migrateAndSeed = async () => {
  try {
    console.log('🚀 Memulai proses migrasi dan seeding database...');
    
    // Jalankan migrasi tabel
    await migrate();
    
    // Jalankan seeding data
    await seedInitialData();
    
    console.log('🎉 Migrasi dan seeding database selesai dengan sukses!');
  } catch (error) {
    console.error('❌ Error dalam proses migrasi dan seeding:', error.message);
    throw error;
  }
};

// Jika file ini dijalankan langsung
if (require.main === module) {
  migrateAndSeed()
    .then(() => {
      console.log('✅ Migrasi dan seeding selesai.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migrasi dan seeding gagal:', error.message);
      process.exit(1);
    });
}

module.exports = { migrateAndSeed };