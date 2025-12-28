// tests/test-put-change-password.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'Newpassword123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'Newpassword456', role: 'bendahara' }
];

async function testPutChangePassword() {
  console.log('🧪 Menguji endpoint PUT Modul Perubahan Sandi...');

  // Ambil token untuk semua role
  let tokens = {};
  
  try {
    // Login untuk mendapatkan token admin
    console.log('🔑 Melakukan login admin untuk mendapatkan token...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[0].username,
      password: TEST_USERS[0].password
    });
    tokens.admin = adminLoginResponse.data.token;
    console.log('✅ Login admin berhasil');

    // Login untuk mendapatkan token sekretaris
    console.log('🔑 Melakukan login sekretaris untuk mendapatkan token...');
    const sekretarisLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[1].username,
      password: TEST_USERS[1].password
    });
    tokens.sekretaris = sekretarisLoginResponse.data.token;
    console.log('✅ Login sekretaris berhasil');

    // Login untuk mendapatkan token bendahara
    console.log('🔑 Melakukan login bendahara untuk mendapatkan token...');
    const bendaharaLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[2].username,
      password: TEST_USERS[2].password
    });
    tokens.bendahara = bendaharaLoginResponse.data.token;
    console.log('✅ Login bendahara berhasil');

    // Test PUT /api/change-password/change-password (oleh sekretaris)
    console.log('\n   1. Menguji PUT /api/change-password/change-password (oleh sekretaris)');
    try {
      const changePasswordData = {
        currentPassword: 'Newpassword4567',
        newPassword: 'Newpassword45678',
        confirmNewPassword: 'Newpassword45678'
      };

      const response = await axios.put(`${BASE_URL}/api/change-password/change-password`, changePasswordData, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/change-password/change-password (oleh sekretaris): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ PUT /api/change-password/change-password (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/change-password/change-password (oleh bendahara)
    console.log('\n   2. Menguji PUT /api/change-password/change-password (oleh bendahara)');
    try {
      const changePasswordData2 = {
        currentPassword: 'Newpassword456',
        newPassword: 'Newpassword4567',
        confirmNewPassword: 'Newpassword4567'
      };

      const response2 = await axios.put(`${BASE_URL}/api/change-password/change-password`, changePasswordData2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/change-password/change-password (oleh bendahara): Berhasil - Status:', response2.status);
      console.log('      Pesan:', response2.data.message);
    } catch (error) {
      console.log('   ❌ PUT /api/change-password/change-password (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/change-password/change-password (oleh ketua)
    console.log('\n   3. Menguji PUT /api/change-password/change-password (oleh ketua)');
    try {
      const changePasswordData3 = {
        currentPassword: 'Newpassword123',
        newPassword: 'Newpassword1234',
        confirmNewPassword: 'Newpassword1234'
      };

      const response3 = await axios.put(`${BASE_URL}/api/change-password/change-password`, changePasswordData3, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/change-password/change-password (oleh ketua): Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
    } catch (error) {
      console.log('   ❌ PUT /api/change-password/change-password (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/change-password/reset-password/:userId (oleh ketua - reset password sekretaris)
    console.log('\n   4. Menguji PUT /api/change-password/reset-password/:userId (oleh ketua - reset password sekretaris)');
    try {
      // Ambil ID user sekretaris dari profil
      const sekretarisProfileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      const sekretarisId = sekretarisProfileResponse.data.user.id;
      
      const resetPasswordData = {
        newPassword: 'ResetPassword123'
      };

      const response4 = await axios.put(`${BASE_URL}/api/change-password/reset-password/${sekretarisId}`, resetPasswordData, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/change-password/reset-password/:userId (oleh ketua): Berhasil - Status:', response4.status);
      console.log('      Pesan:', response4.data.message);
    } catch (error) {
      console.log('   ❌ PUT /api/change-password/reset-password/:userId (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/change-password/reset-password/:userId (oleh bukan ketua - seharusnya gagal)
    console.log('\n   5. Menguji PUT /api/change-password/reset-password/:userId (oleh bukan ketua - seharusnya gagal)');
    try {
      // Ambil ID user bendahara dari profil
      const bendaharaProfileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      const bendaharaId = bendaharaProfileResponse.data.user.id;
      
      const resetPasswordData2 = {
        newPassword: 'ResetPassword456'
      };

      const response5 = await axios.put(`${BASE_URL}/api/change-password/reset-password/${bendaharaId}`, resetPasswordData2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ PUT /api/change-password/reset-password/:userId (oleh bukan ketua): Seharusnya gagal tapi berhasil - Status:', response5.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ PUT /api/change-password/reset-password/:userId (oleh bukan ketua): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ PUT /api/change-password/reset-password/:userId (oleh bukan ketua): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Pengujian endpoint PUT Modul Perubahan Sandi selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testPutChangePassword();

module.exports = { testPutChangePassword };