// tests/test-delete-basic.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = {
  admin: { username: 'admin', password: 'password123', role: 'ketua' },
  sekretaris: { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  bendahara: { username: 'bendahara1', password: 'password123', role: 'bendahara' }
};

async function testDeleteBasic() {
  console.log('🧪 Memulai pengujian endpoint DELETE dasar...');

  // Login untuk mendapatkan token
  let tokens = {};
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

  // Test endpoint DELETE
  await testDeleteMembers(tokens);
  await testDeletePayments(tokens);
  await testDeleteExpenses(tokens);

  console.log('\n🎉 Pengujian endpoint DELETE selesai!');
}

async function testDeleteMembers(tokens) {
  console.log('\n📋 Testing endpoint DELETE Modul Anggota...');

  // Buat anggota baru untuk pengujian delete
  let testMemberId = null;
  try {
    const newMember = {
      registrationDate: '2025-08-01',
      kkNumber: '9999888877776666',
      memberNumber: 'RKM-TEST-001',
      headName: 'Testing Delete',
      wifeName: 'Testing Delete Istri',
      phone: '081234567899',
      street: 'Jl. Testing Delete No. 99',
      kelurahan: 'TestKelurahan',
      kecamatan: 'TestKecamatan',
      kabupaten: 'TestKabupaten',
      beneficiaryName: 'Testing Delete Beneficiary',
      dependentsCount: 2,
      status: 'active'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    testMemberId = createResponse.data.member.id;
    console.log('   ✅ Anggota baru dibuat untuk pengujian delete:', testMemberId);
  } catch (error) {
    console.log('   ❌ Gagal membuat anggota untuk pengujian delete:', error.message);
    return;
  }

  if (testMemberId) {
    // Test DELETE oleh ketua (seharusnya berhasil)
    console.log('   1. Menguji DELETE /api/delete/members/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/members/${testMemberId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('   ✅ DELETE oleh ketua: Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ DELETE oleh ketua: Gagal -', error.response?.data?.message || error.message);
    }
  }
}

async function testDeletePayments(tokens) {
  console.log('\n💳 Testing endpoint DELETE Modul Pembayaran...');

  // Ambil ID anggota untuk pengujian pembayaran
  let memberId = null;
  try {
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      memberId = membersResponse.data.members[0].id;
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID anggota:', error.message);
    return;
  }

  // Buat pembayaran baru untuk pengujian delete
  let testPaymentId = null;
  if (memberId) {
    try {
      const newPayment = {
        memberId: memberId,
        paymentDate: '2025-08-10',
        month: '2025-08',
        amount: 50000,
        receiptNumber: 'TEST-001'
      };

      const createResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      testPaymentId = createResponse.data.payment.id;
      console.log('   ✅ Pembayaran baru dibuat untuk pengujian delete:', testPaymentId);
    } catch (error) {
      console.log('   ❌ Gagal membuat pembayaran untuk pengujian delete:', error.message);
      return;
    }
  }

  if (testPaymentId) {
    // Test DELETE oleh ketua (seharusnya berhasil)
    console.log('   1. Menguji DELETE /api/delete/payments/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/payments/${testPaymentId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('   ✅ DELETE oleh ketua: Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ DELETE oleh ketua: Gagal -', error.response?.data?.message || error.message);
    }
  }
}

async function testDeleteExpenses(tokens) {
  console.log('\n💰 Testing endpoint DELETE Modul Pengeluaran...');

  // Buat pengeluaran baru untuk pengujian delete
  let testExpenseId = null;
  try {
    const newExpense = {
      date: '2025-08-10',
      category: 'transportasi',
      amount: 150000,
      description: 'Testing delete expense'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    testExpenseId = createResponse.data.expense.id;
    console.log('   ✅ Pengeluaran baru dibuat untuk pengujian delete:', testExpenseId);
  } catch (error) {
    console.log('   ❌ Gagal membuat pengeluaran untuk pengujian delete:', error.message);
    return;
  }

  if (testExpenseId) {
    // Test DELETE oleh ketua (seharusnya berhasil)
    console.log('   1. Menguji DELETE /api/delete/expenses/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/expenses/${testExpenseId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('   ✅ DELETE oleh ketua: Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ DELETE oleh ketua: Gagal -', error.response?.data?.message || error.message);
    }
  }
}

// Jalankan pengujian
testDeleteBasic();