// tests/final-testing-summary.js
const { testConnection, getTableInfo, getTableCounts } = require('../utils/helpers/database');

async function testFinalSummary() {
  console.log('🧪 Menguji endpoint PUT Modul Perubahan Sandi...');
  
  try {
    // Login admin
    const { default: axios } = await import('axios');
    const BASE_URL = 'http://localhost:5000';
    
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'password123'
    });
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Login admin berhasil');
    
    // Test ganti password sendiri
    const changePasswordData = {
      currentPassword: 'password123',
      newPassword: 'Newpassword456',
      confirmNewPassword: 'Newpassword456'
    };

    const changePasswordResponse = await axios.put(`${BASE_URL}/api/change-password/change-password`, changePasswordData, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ PUT /api/change-password/change-password (oleh ketua): Berhasil - Status:', changePasswordResponse.status);
    console.log('   Pesan:', changePasswordResponse.data.message);
    
    // Reset password untuk pengujian berikutnya
    const resetPasswordData = {
      newPassword: 'password123'
    };
    
    // Ambil ID user bendahara1
    const usersResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    const resetResponse = await axios.put(`${BASE_URL}/api/change-password/reset-password/2`, resetPasswordData, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ PUT /api/change-password/reset-password/:userId (oleh ketua): Berhasil - Status:', resetResponse.status);
    console.log('   Pesan:', resetResponse.data.message);
    
    console.log('🎉 Pengujian endpoint PUT Modul Perubahan Sandi selesai!');
  } catch (error) {
    console.log('❌ Error saat pengujian:', error.message);
  }
}

testFinalSummary();

module.exports = { testFinalSummary };