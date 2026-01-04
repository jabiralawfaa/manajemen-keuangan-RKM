// tests/unit/test-members-get.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

async function testMembersGet() {
  console.log('🧪 Memulai pengujian endpoint GET untuk members...');

  try {
    // Login untuk mendapatkan token
    console.log('🔑 Melakukan login untuk mendapatkan token...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USER.username,
      password: TEST_USER.password
    });

    const authToken = loginResponse.data.token;
    console.log('✅ Login berhasil, token diperoleh');

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    // Test GET /api/members
    console.log('\n📋 Menguji endpoint: GET /api/members');
    try {
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { headers });
      console.log('✅ GET /api/members: Berhasil - Status:', membersResponse.status);
      console.log('   Jumlah anggota:', membersResponse.data.total || (membersResponse.data.members ? membersResponse.data.members.length : 'N/A'));
      
      // Cek apakah data memiliki struktur yang benar
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        const firstMember = membersResponse.data.members[0];
        console.log('   Struktur data anggota:');
        console.log('   - id:', firstMember.id !== undefined ? '✅' : '❌');
        console.log('   - name:', firstMember.name !== undefined ? '✅' : '❌');
        console.log('   - member_number:', firstMember.member_number !== undefined ? '✅' : '❌');
        console.log('   - phone:', firstMember.phone !== undefined ? '✅' : '❌');
        console.log('   - rt_rw:', firstMember.rt_rw !== undefined ? '✅' : '❌');
        console.log('   - dusun:', firstMember.dusun !== undefined ? '✅' : '❌');
        console.log('   - desa:', firstMember.desa !== undefined ? '✅' : '❌');
        console.log('   - kecamatan:', firstMember.kecamatan !== undefined ? '✅' : '❌');
        console.log('   - kabupaten:', firstMember.kabupaten !== undefined ? '✅' : '❌');
        console.log('   - dependents_count:', firstMember.dependents_count !== undefined ? '✅' : '❌');
        console.log('   - status:', firstMember.status !== undefined ? '✅' : '❌');
      }
    } catch (error) {
      console.log('❌ GET /api/members: Gagal -', error.message);
    }

    // Test GET /api/members/:id (ambil ID dari response sebelumnya jika tersedia)
    console.log('\n👤 Menguji endpoint: GET /api/members/:id');
    try {
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { headers });
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        const memberId = membersResponse.data.members[0].id;
        const memberResponse = await axios.get(`${BASE_URL}/api/members/${memberId}`, { headers });
        console.log('✅ GET /api/members/:id: Berhasil - Status:', memberResponse.status);
        console.log('   Detail anggota:', memberResponse.data.name || memberResponse.data.member_number || 'N/A');
        
        // Cek apakah data memiliki struktur yang benar
        const member = memberResponse.data;
        console.log('   Struktur data anggota:');
        console.log('   - id:', member.id !== undefined ? '✅' : '❌');
        console.log('   - name:', member.name !== undefined ? '✅' : '❌');
        console.log('   - member_number:', member.member_number !== undefined ? '✅' : '❌');
        console.log('   - phone:', member.phone !== undefined ? '✅' : '❌');
        console.log('   - rt_rw:', member.rt_rw !== undefined ? '✅' : '❌');
        console.log('   - dusun:', member.dusun !== undefined ? '✅' : '❌');
        console.log('   - desa:', member.desa !== undefined ? '✅' : '❌');
        console.log('   - kecamatan:', member.kecamatan !== undefined ? '✅' : '❌');
        console.log('   - kabupaten:', member.kabupaten !== undefined ? '✅' : '❌');
        console.log('   - dependents_count:', member.dependents_count !== undefined ? '✅' : '❌');
        console.log('   - status:', member.status !== undefined ? '✅' : '❌');
      } else {
        console.log('⚠️  Tidak ada anggota untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/members/:id: Gagal -', error.message);
    }

    // Test GET /api/members/search
    console.log('\n🔍 Menguji endpoint: GET /api/members/search');
    try {
      const searchResponse = await axios.get(`${BASE_URL}/api/members/search?search=Ahmad`, { headers });
      console.log('✅ GET /api/members/search: Berhasil - Status:', searchResponse.status);
      console.log('   Jumlah hasil pencarian:', searchResponse.data.total || (searchResponse.data.members ? searchResponse.data.members.length : 'N/A'));
    } catch (error) {
      console.log('❌ GET /api/members/search: Gagal -', error.message);
    }

    console.log('\n🎉 Pengujian endpoint GET untuk members selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testMembersGet();

module.exports = { testMembersGet };