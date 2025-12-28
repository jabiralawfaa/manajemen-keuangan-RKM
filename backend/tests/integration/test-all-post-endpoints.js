// tests/test-all-post-endpoints.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'bendahara1', password: 'Newpassword456', role: 'bendahara' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' }
];

async function testAllPostEndpoints() {
  console.log('🧪 Memulai pengujian semua endpoint POST...');

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

    // Login untuk mendapatkan token bendahara
    console.log('🔑 Melakukan login bendahara untuk mendapatkan token...');
    const bendaharaLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[1].username,
      password: TEST_USERS[1].password
    });
    tokens.bendahara = bendaharaLoginResponse.data.token;
    console.log('✅ Login bendahara berhasil');

    // Login untuk mendapatkan token sekretaris
    console.log('🔑 Melakukan login sekretaris untuk mendapatkan token...');
    const sekretarisLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[2].username,
      password: TEST_USERS[2].password
    });
    tokens.sekretaris = sekretarisLoginResponse.data.token;
    console.log('✅ Login sekretaris berhasil');

    // Test semua endpoint POST dengan role yang sesuai
    await testMemberEndpoints(tokens);
    await testPaymentEndpoints(tokens);
    await testExpenseEndpoints(tokens);
    await testAuthEndpoints(tokens);
    
    console.log('\n🎉 Pengujian semua endpoint POST selesai!');
    console.log('\n✅ Semua endpoint POST yang dibutuhkan berdasarkan SRS telah diuji:');
    console.log('   - Modul Manajemen Anggota (RF-MA-001)');
    console.log('   - Modul Keuangan - Pemasukan (RF-KP-001)');
    console.log('   - Modul Keuangan - Pengeluaran (RF-KG-001)');
    console.log('   - Modul Otentikasi (User Management)');
    console.log('   - Pembatasan akses berdasarkan role telah diuji');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

async function testMemberEndpoints(tokens) {
  console.log('\n📋 Menguji endpoint Modul Manajemen Anggota...');

  // Test POST /api/members (oleh sekretaris - seharusnya berhasil)
  console.log('\n   1. Menguji POST /api/members (oleh sekretaris)');
  try {
    const newMember = {
      registrationDate: '2025-06-01',
      kkNumber: '9999000011112222',
      memberNumber: 'RKM-2025-007',
      headName: 'Ahmad Sugiarto',
      wifeName: 'Siti Khasanah',
      phone: '081234567903',
      street: 'Jl. Kenangan No. 20',
      kelurahan: 'Sukadamai',
      kecamatan: 'Sukacinta',
      kabupaten: 'Bandung',
      beneficiaryName: 'Ahmad Sugiarto',
      dependentsCount: 3,
      status: 'active'
    };

    const response = await axios.post(`${BASE_URL}/api/members`, newMember, { 
      headers: { 
        'Authorization': `Bearer ${tokens.sekretaris}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ✅ POST /api/members (oleh sekretaris): Berhasil - Status:', response.status);
    console.log('      Pesan:', response.data.message);
    console.log('      ID Anggota Baru:', response.data.member.id);
  } catch (error) {
    console.log('   ❌ POST /api/members (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
  }

  // Test POST /api/members (oleh bendahara - seharusnya gagal)
  console.log('\n   2. Menguji POST /api/members (oleh bendahara - seharusnya gagal)');
  try {
    const newMember2 = {
      registrationDate: '2025-06-02',
      kkNumber: '1111222233334444',
      memberNumber: 'RKM-2025-008',
      headName: 'Budi Santoso',
      wifeName: 'Ani Santoso',
      phone: '081234567904',
      street: 'Jl. Harapan No. 25',
      kelurahan: 'Sukamakmur',
      kecamatan: 'Sukabaru',
      kabupaten: 'Garut',
      beneficiaryName: 'Budi Santoso',
      dependentsCount: 2,
      status: 'active'
    };

    const response2 = await axios.post(`${BASE_URL}/api/members`, newMember2, { 
      headers: { 
        'Authorization': `Bearer ${tokens.bendahara}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ❌ POST /api/members (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response2.status);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ POST /api/members (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
      console.log('      Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ POST /api/members (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }
}

async function testPaymentEndpoints(tokens) {
  console.log('\n💳 Menguji endpoint Modul Keuangan - Pemasukan...');

  // Ambil ID anggota yang ada untuk pembayaran
  let memberId = null;
  try {
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, { 
      headers: { 
        'Authorization': `Bearer ${tokens.admin}`,
        'Content-Type': 'application/json'
      } 
    });
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      memberId = membersResponse.data.members[0].id;
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID anggota:', error.message);
  }

  // Test POST /api/payments (oleh bendahara - seharusnya berhasil)
  console.log('\n   1. Menguji POST /api/payments (oleh bendahara)');
  try {
    if (memberId) {
      const newPayment = {
        memberId: memberId,
        paymentDate: '2025-06-15',
        month: '2025-06',
        amount: 50000,
        receiptNumber: 'INV-008'
      };

      const response = await axios.post(`${BASE_URL}/api/payments`, newPayment, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ POST /api/payments (oleh bendahara): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
      console.log('      ID Pembayaran Baru:', response.data.payment.id);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk membuat pembayaran');
    }
  } catch (error) {
    console.log('   ❌ POST /api/payments (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
  }

  // Test POST /api/payments (oleh sekretaris - seharusnya gagal)
  console.log('\n   2. Menguji POST /api/payments (oleh sekretaris - seharusnya gagal)');
  try {
    if (memberId) {
      const newPayment2 = {
        memberId: memberId,
        paymentDate: '2025-06-16',
        month: '2025-06',
        amount: 55000,
        receiptNumber: 'INV-009'
      };

      const response2 = await axios.post(`${BASE_URL}/api/payments`, newPayment2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ POST /api/payments (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk membuat pembayaran');
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ POST /api/payments (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
      console.log('      Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ POST /api/payments (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }
}

async function testExpenseEndpoints(tokens) {
  console.log('\n💰 Menguji endpoint Modul Keuangan - Pengeluaran...');

  // Test POST /api/expenses (oleh bendahara - seharusnya berhasil)
  console.log('\n   1. Menguji POST /api/expenses (oleh bendahara)');
  try {
    const newExpense = {
      date: '2025-06-20',
      category: 'kain_kafan',
      amount: 250000,
      description: 'Pembelian kain kafan untuk kegiatan'
    };

    const response = await axios.post(`${BASE_URL}/api/expenses`, newExpense, { 
      headers: { 
        'Authorization': `Bearer ${tokens.bendahara}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ✅ POST /api/expenses (oleh bendahara): Berhasil - Status:', response.status);
    console.log('      Pesan:', response.data.message);
    console.log('      ID Pengeluaran Baru:', response.data.expense.id);
  } catch (error) {
    console.log('   ❌ POST /api/expenses (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
  }

  // Test POST /api/expenses (oleh sekretaris - seharusnya gagal)
  console.log('\n   2. Menguji POST /api/expenses (oleh sekretaris - seharusnya gagal)');
  try {
    const newExpense2 = {
      date: '2025-06-21',
      category: 'alat_tulis',
      amount: 75000,
      description: 'Pembelian perlengkapan administrasi'
    };

    const response2 = await axios.post(`${BASE_URL}/api/expenses`, newExpense2, { 
      headers: { 
        'Authorization': `Bearer ${tokens.sekretaris}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ❌ POST /api/expenses (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ POST /api/expenses (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
      console.log('      Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ POST /api/expenses (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }
}

async function testAuthEndpoints(tokens) {
  console.log('\n👤 Menguji endpoint Modul Otentikasi...');

  // Test POST /api/auth/register (oleh ketua - seharusnya berhasil)
  console.log('\n   1. Menguji POST /api/auth/register (oleh ketua)');
  try {
    const newUser = {
      username: 'pegawai_baru4',
      password: 'passwordbaru101',
      role: 'sekretaris',
      name: 'Pegawai Baru Empat',
      phone: '081234567905'
    };

    const response = await axios.post(`${BASE_URL}/api/auth/register`, newUser, { 
      headers: { 
        'Authorization': `Bearer ${tokens.admin}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ✅ POST /api/auth/register (oleh ketua): Berhasil - Status:', response.status);
    console.log('      Pesan:', response.data.message);
    console.log('      User ID:', response.data.user.id);
  } catch (error) {
    console.log('   ❌ POST /api/auth/register (oleh ketua): Gagal -', error.response?.data?.message || error.message);
  }

  // Test POST /api/auth/register (oleh bendahara - seharusnya gagal)
  console.log('\n   2. Menguji POST /api/auth/register (oleh bendahara - seharusnya gagal)');
  try {
    const newUser2 = {
      username: 'pegawai_baru5',
      password: 'passwordbaru102',
      role: 'bendahara',
      name: 'Pegawai Baru Lima',
      phone: '081234567906'
    };

    const response2 = await axios.post(`${BASE_URL}/api/auth/register`, newUser2, { 
      headers: { 
        'Authorization': `Bearer ${tokens.bendahara}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ❌ POST /api/auth/register (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response2.status);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ POST /api/auth/register (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
      console.log('      Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ POST /api/auth/register (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }
}

// Jalankan pengujian
testAllPostEndpoints();

module.exports = { testAllPostEndpoints };