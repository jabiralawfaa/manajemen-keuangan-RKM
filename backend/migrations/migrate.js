// migrations/migrate.js
const { createTables } = require('./create-tables');
const { addConstraints } = require('./add-constraints');

/**
 * Fungsi utama untuk menjalankan semua migrasi
 */
const migrate = async () => {
  try {
    console.log('🚀 Memulai proses migrasi database...');
    
    // Membuat tabel-tabel
    await createTables();
    
    // Menambahkan constraint dan index
    await addConstraints();
    
    console.log('🎉 Migrasi database selesai dengan sukses!');
  } catch (error) {
    console.error('❌ Error dalam proses migrasi:', error.message);
    throw error;
  }
};

// Jika file ini dijalankan langsung
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migrasi selesai.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migrasi gagal:', error.message);
      process.exit(1);
    });
}

module.exports = { migrate };