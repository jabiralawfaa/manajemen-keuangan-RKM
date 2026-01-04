// tests/integration/test-members-put.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function testMembersPut() {
  console.log('🧪 Memulai pengujian endpoint PUT /api/members...');

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

    // Ambil ID anggota untuk pengujian update
    let memberId = null;
    let memberOriginalData = null;
    try {
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        memberId = membersResponse.data.members[0].id;
        memberOriginalData = membersResponse.data.members[0];
        console.log(`✅ ID Anggota ditemukan: ${memberId}, Nama: ${memberOriginalData.name}`);
      } else {
        console.log('⚠️  Tidak ada anggota untuk diupdate');
        return;
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID anggota:', error.message);
      return;
    }

    // Test PUT /api/members/:id (oleh sekretaris - seharusnya berhasil)
    console.log('\n   1. Menguji PUT /api/members/:id (oleh sekretaris)');
    try {
      const updatedMember = {
        registrationDate: '2025-06-01',
        memberNumber: memberOriginalData.member_number,
        name: 'Ahmad Sugiarto Update oleh Sekretaris',
        phone: '081234567903',
        rtRw: '007/008',
        dusun: 'Dusun Kenangan',
        desa: 'Sukadamai Update oleh Sekretaris',
        kecamatan: 'Sukacinta Update oleh Sekretaris',
        kabupaten: 'Bandung Update oleh Sekretaris',
        dependentsCount: 4,
        status: 'active'
      };

      const response = await axios.put(`${BASE_URL}/api/members/${memberId}`, updatedMember, {
        headers: {
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ✅ PUT /api/members/:id (oleh sekretaris): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
      console.log('      Nama Anggota Baru:', response.data.member.name);
    } catch (error) {
      console.log('   ❌ PUT /api/members/:id (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/members/:id (oleh bendahara - seharusnya gagal)
    console.log('\n   2. Menguji PUT /api/members/:id (oleh bendahara - seharusnya gagal)');
    try {
      const updatedMember2 = {
        registrationDate: '2025-06-01',
        memberNumber: memberOriginalData.member_number,
        name: 'Ahmad Sugiarto Update oleh Bendahara',
        phone: '081234567903',
        rtRw: '008/009',
        dusun: 'Dusun Kenangan Update oleh Bendahara',
        desa: 'Sukadamai Update oleh Bendahara',
        kecamatan: 'Sukacinta Update oleh Bendahara',
        kabupaten: 'Bandung Update oleh Bendahara',
        dependentsCount: 4,
        status: 'active'
      };

      const response2 = await axios.put(`${BASE_URL}/api/members/${memberId}`, updatedMember2, {
        headers: {
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ❌ PUT /api/members/:id (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ PUT /api/members/:id (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ PUT /api/members/:id (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test PUT /api/members/:id (oleh ketua - seharusnya berhasil)
    console.log('\n   3. Menguji PUT /api/members/:id (oleh ketua)');
    try {
      const updatedMember3 = {
        registrationDate: '2025-06-01',
        memberNumber: memberOriginalData.member_number,
        name: 'Ahmad Sugiarto Update oleh Ketua',
        phone: '081234567903',
        rtRw: '009/010',
        dusun: 'Dusun Kenangan Update oleh Ketua',
        desa: 'Sukadamai Update oleh Ketua',
        kecamatan: 'Sukacinta Update oleh Ketua',
        kabupaten: 'Bandung Update oleh Ketua',
        dependentsCount: 4,
        status: 'active'
      };

      const response3 = await axios.put(`${BASE_URL}/api/members/${memberId}`, updatedMember3, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ✅ PUT /api/members/:id (oleh ketua): Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
      console.log('      Nama Anggota Baru:', response3.data.member.name);
    } catch (error) {
      console.log('   ❌ PUT /api/members/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/members/:id (data tidak lengkap - seharusnya gagal)
    console.log('\n   4. Menguji PUT /api/members/:id (data tidak lengkap - seharusnya gagal)');
    try {
      const incompleteUpdate = {
        registrationDate: '2025-06-01',
        // memberNumber tidak disertakan
        name: 'Ahmad Sugiarto Update Tidak Lengkap',
        phone: '081234567903',
        rtRw: '010/011',
        dusun: 'Dusun Tidak Lengkap',
        desa: 'Sukadamai Tidak Lengkap',
        kecamatan: 'Sukacinta Tidak Lengkap',
        kabupaten: 'Bandung Tidak Lengkap',
        dependentsCount: 4,
        status: 'active'
      };

      const response4 = await axios.put(`${BASE_URL}/api/members/${memberId}`, incompleteUpdate, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ❌ PUT /api/members/:id (data tidak lengkap): Seharusnya gagal tapi berhasil - Status:', response4.status);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('   ✅ PUT /api/members/:id (data tidak lengkap): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ PUT /api/members/:id (data tidak lengkap): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Pengujian endpoint PUT /api/members selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testMembersPut();

module.exports = { testMembersPut };