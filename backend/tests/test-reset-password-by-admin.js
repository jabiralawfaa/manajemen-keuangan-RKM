// tests/test-reset-password-by-admin.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function testResetPasswordByAdmin() {
  console.log('🧪 Memulai pengujian endpoint reset password oleh ketua...');

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

    // Ambil ID user sekretaris2 untuk pengujian reset password
    let sekretaris2Id = null;
    try {
      // Ambil daftar semua user
      const allUsersResponse = await axios.get(`${BASE_URL}/api/auth/profiles`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      // Cari user dengan role sekretaris dan bukan user sekretaris1
      for (const user of allUsersResponse.data.users || []) {
        if (user.role === 'sekretaris' && user.username !== 'sekretaris1') {
          sekretaris2Id = user.id;
          break;
        }
      }
    } catch (error) {
      console.log('⚠️  Gagal mengambil ID user sekretaris2:', error.message);
    }

    // Jika tidak berhasil dengan endpoint profiles, coba endpoint users
    if (!sekretaris2Id) {
      try {
        const usersResponse = await axios.get(`${BASE_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${tokens.admin}` }
        });
        // Cari user dengan role sekretaris dan bukan user sekretaris1
        for (const user of usersResponse.data.users || []) {
          if (user.role === 'sekretaris' && user.username !== 'sekretaris1') {
            sekretaris2Id = user.id;
            break;
          }
        }
      } catch (error) {
        console.log('⚠️  Gagal mengambil ID user sekretaris2 dari endpoint users:', error.message);
      }
    }

    if (!sekretaris2Id) {
      // Jika tidak bisa menemukan user sekretaris2, kita cari dari semua users
      try {
        const allUsersQuery = await axios.get(`${BASE_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${tokens.admin}` }
        });
        for (const user of allUsersQuery.data.users) {
          if (user.role === 'sekretaris' && user.username !== 'sekretaris1') {
            sekretaris2Id = user.id;
            break;
          }
        }
      } catch (error) {
        console.log('⚠️  Gagal mengambil ID user sekretaris2 dari endpoint users:', error.message);
      }
    }

    // Test PUT /api/change-password/reset-password/:userId (oleh ketua)
    console.log('\n🔐 Menguji PUT /api/change-password/reset-password/:userId (oleh ketua)');
    try {
      // Kita akan mencoba reset password untuk user bendahara2 (ID 3) - asumsi berdasarkan seeding
      const resetPasswordData = {
        newPassword: 'ResetPassword123'
      };

      const response = await axios.put(`${BASE_URL}/api/change-password/reset-password/3`, resetPasswordData, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ PUT /api/change-password/reset-password/:userId (oleh ketua): Berhasil - Status:', response.status);
      console.log('   Pesan:', response.data.message);
    } catch (error) {
      console.log('❌ PUT /api/change-password/reset-password/:userId (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/change-password/reset-password/:userId (oleh bukan ketua - seharusnya gagal)
    console.log('\n   2. Menguji PUT /api/change-password/reset-password/:userId (oleh bukan ketua - seharusnya gagal)');
    try {
      // Ambil ID user bendahara2 untuk pengujian
      let bendahara2Id = null;
      try {
        const allUsersQuery = await axios.get(`${BASE_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${tokens.admin}` }
        });
        for (const user of allUsersQuery.data.users) {
          if (user.role === 'bendahara' && user.username !== 'bendahara1') {
            bendahara2Id = user.id;
            break;
          }
        }
      } catch (error) {
        console.log('⚠️  Gagal mengambil ID user bendahara2:', error.message);
      }

      if (bendahara2Id) {
        const resetPasswordData2 = {
          newPassword: 'ResetPassword456'
        };

        const response2 = await axios.put(`${BASE_URL}/api/change-password/reset-password/${bendahara2Id}`, resetPasswordData2, {
          headers: {
            'Authorization': `Bearer ${tokens.sekretaris}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('   ❌ PUT /api/change-password/reset-password/:userId (oleh bukan ketua): Seharusnya gagal tapi berhasil - Status:', response2.status);
      } else {
        console.log('   ⚠️  Tidak ada user bendahara2 untuk pengujian reset password');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ PUT /api/change-password/reset-password/:userId (oleh bukan ketua): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ PUT /api/change-password/reset-password/:userId (oleh bukan ketua): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Pengujian endpoint reset password selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian reset password:', error.message);
  }
}

// Jalankan pengujian
testResetPasswordByAdmin();