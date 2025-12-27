// File untuk testing koneksi database
const { connectDB } = require('./config/db');

console.log('Testing database connection...');

connectDB()
  .then(() => {
    console.log('✅ Database connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Check the NEONDB_CONNECTION_GUIDE.md file for troubleshooting steps');
    process.exit(1);
  });