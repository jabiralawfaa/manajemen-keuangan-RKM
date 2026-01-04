// tests/integration/test-members-post.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function testMembersPost() {
  console.log('🧪 Memulai pengujian endpoint POST /api/members...');

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

    // Test POST /api/members (oleh sekretaris - seharusnya berhasil)
    console.log('\n📋 1. Menguji endpoint: POST /api/members (oleh sekretaris)');
    try {
      const newMember = {
        registrationDate: '2025-03-01',
        memberNumber: 'RKM-2025-005',
        name: 'Testing Nama Baru',
        phone: '081234567890',
        rtRw: '005/006',
        dusun: 'Dusun Testing',
        desa: 'Desa Testing',
        kecamatan: 'Kecamatan Testing',
        kabupaten: 'Kabupaten Testing',
        dependentsCount: 2,
        status: 'active'
      };

      const membersResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
        headers: {
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ POST /api/members (oleh sekretaris): Berhasil - Status:', membersResponse.status);
      console.log('   Pesan:', membersResponse.data.message);
      console.log('   ID Anggota Baru:', membersResponse.data.member.id);
      console.log('   Nama Anggota:', membersResponse.data.member.name);
    } catch (error) {
      console.log('❌ POST /api/members (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
    }

    // Test POST /api/members (oleh ketua - seharusnya berhasil)
    console.log('\n📋 2. Menguji endpoint: POST /api/members (oleh ketua)');
    try {
      const newMember2 = {
        registrationDate: '2025-03-02',
        memberNumber: 'RKM-2025-006',
        name: 'Testing Nama Ketua',
        phone: '081234567891',
        rtRw: '006/007',
        dusun: 'Dusun Testing 2',
        desa: 'Desa Testing 2',
        kecamatan: 'Kecamatan Testing 2',
        kabupaten: 'Kabupaten Testing 2',
        dependentsCount: 3,
        status: 'active'
      };

      const membersResponse2 = await axios.post(`${BASE_URL}/api/members`, newMember2, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ POST /api/members (oleh ketua): Berhasil - Status:', membersResponse2.status);
      console.log('   Pesan:', membersResponse2.data.message);
      console.log('   ID Anggota Baru:', membersResponse2.data.member.id);
      console.log('   Nama Anggota:', membersResponse2.data.member.name);
    } catch (error) {
      console.log('❌ POST /api/members (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test POST /api/members (oleh bendahara - seharusnya gagal)
    console.log('\n📋 3. Menguji endpoint: POST /api/members (oleh bendahara - seharusnya gagal)');
    try {
      const newMember3 = {
        registrationDate: '2025-03-03',
        memberNumber: 'RKM-2025-007',
        name: 'Testing Nama Bendahara',
        phone: '081234567892',
        rtRw: '007/008',
        dusun: 'Dusun Testing 3',
        desa: 'Desa Testing 3',
        kecamatan: 'Kecamatan Testing 3',
        kabupaten: 'Kabupaten Testing 3',
        dependentsCount: 4,
        status: 'active'
      };

      const membersResponse3 = await axios.post(`${BASE_URL}/api/members`, newMember3, {
        headers: {
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ POST /api/members (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', membersResponse3.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ POST /api/members (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
        console.log('   Pesan:', error.response.data.message);
      } else {
        console.log('❌ POST /api/members (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test POST /api/members (data tidak lengkap - seharusnya gagal)
    console.log('\n📋 4. Menguji endpoint: POST /api/members (data tidak lengkap - seharusnya gagal)');
    try {
      const incompleteMember = {
        registrationDate: '2025-03-04',
        // memberNumber tidak disertakan
        name: 'Testing Nama Incomplete',
        phone: '081234567893',
        rtRw: '008/009',
        dusun: 'Dusun Testing 4',
        desa: 'Desa Testing 4',
        kecamatan: 'Kecamatan Testing 4',
        kabupaten: 'Kabupaten Testing 4',
        dependentsCount: 1,
        status: 'active'
      };

      const membersResponse4 = await axios.post(`${BASE_URL}/api/members`, incompleteMember, {
        headers: {
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ POST /api/members (data tidak lengkap): Seharusnya gagal tapi berhasil - Status:', membersResponse4.status);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ POST /api/members (data tidak lengkap): Ditolak dengan benar - Status:', error.response.status);
        console.log('   Pesan:', error.response.data.message);
      } else {
        console.log('❌ POST /api/members (data tidak lengkap): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Pengujian endpoint POST /api/members selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testMembersPost();

module.exports = { testMembersPost };