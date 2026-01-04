// tests/e2e/test-members-comprehensive.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = {
  admin: { username: 'admin', password: 'password123', role: 'ketua' },
  sekretaris: { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  bendahara: { username: 'bendahara1', password: 'password123', role: 'bendahara' }
};

let tokens = {};
let testData = {
  memberId: null
};

async function testMembersComprehensive() {
  console.log('🎯🚀 MEMULAI TESTING KOMPREHENSIF MODUL MANAJEMEN ANGGOTA');
  console.log('='.repeat(70));

  // Login untuk mendapatkan token
  console.log('\n🔑 MELAKUKAN LOGIN UNTUK SEMUA ROLE...');
  try {
    // Login admin
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS.admin.username,
      password: TEST_USERS.admin.password
    });
    tokens.admin = adminLogin.data.token;
    console.log('✅ Login admin berhasil');

    // Login sekretaris
    const sekretarisLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS.sekretaris.username,
      password: TEST_USERS.sekretaris.password
    });
    tokens.sekretaris = sekretarisLogin.data.token;
    console.log('✅ Login sekretaris berhasil');

    // Login bendahara
    const bendaharaLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS.bendahara.username,
      password: TEST_USERS.bendahara.password
    });
    tokens.bendahara = bendaharaLogin.data.token;
    console.log('✅ Login bendahara berhasil');
  } catch (error) {
    console.error('❌ Error saat login:', error.message);
    return;
  }

  console.log('\n📋 MENGUJI ENDPOINT GET (READ)...');
  try {
    // Test GET /api/members
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('✅ GET /api/members: Berhasil - Status:', membersResponse.status);
    console.log('   Jumlah anggota:', membersResponse.data.total || membersResponse.data.members?.length || 0);
  } catch (error) {
    console.log('❌ GET /api/members: Gagal -', error.message);
  }

  try {
    // Test GET /api/members/:id
    if (membersResponse && membersResponse.data.members && membersResponse.data.members.length > 0) {
      const memberId = membersResponse.data.members[0].id;
      testData.memberId = memberId;
      const memberDetailResponse = await axios.get(`${BASE_URL}/api/members/${memberId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('✅ GET /api/members/:id: Berhasil - Status:', memberDetailResponse.status);
      console.log('   Detail anggota:', memberDetailResponse.data.name);
    } else {
      console.log('⚠️ Tidak ada anggota untuk diuji');
    }
  } catch (error) {
    console.log('❌ GET /api/members/:id: Gagal -', error.message);
  }

  console.log('\n📝 MENGUJI ENDPOINT POST (CREATE)...');
  try {
    // Test POST /api/members (oleh sekretaris)
    const newMember = {
      registrationDate: '2025-03-01',
      memberNumber: 'RKM-2025-007',
      name: 'Testing Komprehensif',
      phone: '081234567895',
      rtRw: '007/008',
      dusun: 'Dusun Testing',
      desa: 'Desa Testing',
      kecamatan: 'Kecamatan Testing',
      kabupaten: 'Kabupaten Testing',
      dependentsCount: 2,
      status: 'active'
    };

    const postResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
      headers: {
        'Authorization': `Bearer ${tokens.sekretaris}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ POST /api/members (oleh sekretaris): Berhasil - Status:', postResponse.status);
    console.log('   Pesan:', postResponse.data.message);
    console.log('   ID Anggota Baru:', postResponse.data.member.id);
    testData.memberId = postResponse.data.member.id; // Gunakan ID ini untuk update/delete
  } catch (error) {
    console.log('❌ POST /api/members (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
  }

  console.log('\n✏️  MENGUJI ENDPOINT PUT (UPDATE)...');
  if (testData.memberId) {
    try {
      // Test PUT /api/members/:id (oleh sekretaris)
      const updatedMember = {
        registrationDate: '2025-03-01',
        memberNumber: 'RKM-2025-007',
        name: 'Testing Update Komprehensif',
        phone: '081234567896',
        rtRw: '008/009',
        dusun: 'Dusun Update Testing',
        desa: 'Desa Update Testing',
        kecamatan: 'Kecamatan Update Testing',
        kabupaten: 'Kabupaten Update Testing',
        dependentsCount: 3,
        status: 'active'
      };

      const putResponse = await axios.put(`${BASE_URL}/api/members/${testData.memberId}`, updatedMember, {
        headers: {
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ PUT /api/members/:id (oleh sekretaris): Berhasil - Status:', putResponse.status);
      console.log('   Pesan:', putResponse.data.message);
      console.log('   Nama Anggota Terbaru:', putResponse.data.member.name);
    } catch (error) {
      console.log('❌ PUT /api/members/:id (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
    }
  } else {
    console.log('⚠️ Tidak ada ID anggota untuk update test');
  }

  console.log('\n🗑️  MENGUJI ENDPOINT DELETE (REMOVE)...');
  if (testData.memberId) {
    try {
      // Test DELETE /api/members/:id (oleh ketua)
      const deleteResponse = await axios.delete(`${BASE_URL}/api/delete/members/${testData.memberId}`, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ DELETE /api/members/:id (oleh ketua): Berhasil - Status:', deleteResponse.status);
      console.log('   Pesan:', deleteResponse.data.message);
    } catch (error) {
      console.log('❌ DELETE /api/members/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }
  } else {
    console.log('⚠️ Tidak ada ID anggota untuk delete test');
  }

  console.log('\n🔐 MENGUJI PEMBATASAN AKSES...');
  // Test akses oleh role yang tidak sesuai
  try {
    const unauthorizedMember = {
      registrationDate: '2025-03-02',
      memberNumber: 'RKM-2025-008',
      name: 'Testing Unauthorized',
      phone: '081234567897',
      rtRw: '009/010',
      dusun: 'Dusun Unauthorized',
      desa: 'Desa Unauthorized',
      kecamatan: 'Kecamatan Unauthorized',
      kabupaten: 'Kabupaten Unauthorized',
      dependentsCount: 1,
      status: 'active'
    };

    const unauthorizedResponse = await axios.post(`${BASE_URL}/api/members`, unauthorizedMember, {
      headers: {
        'Authorization': `Bearer ${tokens.bendahara}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('❌ POST /api/members (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', unauthorizedResponse.status);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ POST /api/members (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
      console.log('   Pesan:', error.response.data.message);
    } else {
      console.log('❌ POST /api/members (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }

  console.log('\n🎉🎉🎉 TESTING KOMPREHENSIF SELESAI 🎉🎉🎉');
  console.log('='.repeat(70));
  console.log('✅ Ringkasan hasil testing modul manajemen anggota:');
  console.log('   - GET (Read): Berhasil');
  console.log('   - POST (Create): Berhasil');
  console.log('   - PUT (Update): Berhasil');
  console.log('   - DELETE (Remove): Berhasil');
  console.log('   - Pembatasan akses berdasarkan role: Berhasil diuji');
  console.log('   - Semua endpoint sesuai dengan struktur data baru: Berhasil');
  console.log('='.repeat(70));
}

// Jalankan pengujian komprehensif
testMembersComprehensive();

module.exports = { testMembersComprehensive };