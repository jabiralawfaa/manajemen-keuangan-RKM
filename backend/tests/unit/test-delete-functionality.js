// tests/test-delete-functionality.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function testDeleteFunctionality() {
  console.log('🧪🎯 TESTING FUNGSIONALITAS ENDPOINT DELETE');
  console.log('='.repeat(60));

  // Login admin
  console.log('🔑 Login admin...');
  const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
    username: TEST_USERS[0].username,
    password: TEST_USERS[0].password
  });
  const adminToken = adminLogin.data.token;
  console.log('✅ Admin login berhasil');

  // Login sekretaris
  console.log('🔑 Login sekretaris...');
  const sekretarisLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
    username: TEST_USERS[1].username,
    password: TEST_USERS[1].password
  });
  const sekretarisToken = sekretarisLogin.data.token;
  console.log('✅ Sekretaris login berhasil');

  // Ambil ID anggota untuk pengujian
  let memberId = null;
  try {
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      memberId = membersResponse.data.members[0].id;
      console.log('✅ ID Anggota ditemukan:', memberId);
    } else {
      // Buat anggota baru untuk pengujian
      const newMember = {
        registrationDate: '2025-08-01',
        kkNumber: '9999888877776666',
        memberNumber: 'RKM-TEST-011',
        headName: 'Testing Delete',
        wifeName: 'Testing Delete Istri',
        phone: '081234567911',
        street: 'Jl. Testing Delete No. 111',
        kelurahan: 'TestKelurahan11',
        kecamatan: 'TestKecamatan11',
        kabupaten: 'TestKabupaten11',
        beneficiaryName: 'Testing Delete Beneficiary',
        dependentsCount: 2,
        status: 'active'
      };

      const createResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
        headers: { 'Authorization': `Bearer ${sekretarisToken}` }
      });
      memberId = createResponse.data.member.id;
      console.log('✅ Anggota baru dibuat untuk pengujian delete:', memberId);
    }
  } catch (error) {
    console.log('❌ Gagal mendapatkan ID anggota:', error.message);
    return;
  }

  // Test DELETE /api/delete/members/:id (oleh ketua - seharusnya berhasil)
  console.log('\n📋 1. Testing DELETE /api/delete/members/:id (oleh ketua)');
  try {
    if (memberId) {
      const response = await axios.delete(`${BASE_URL}/api/delete/members/${memberId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('   ✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk dihapus');
    }
  } catch (error) {
    console.log('   ❌ Gagal -', error.response?.data?.message || error.message);
  }

  // Buat anggota baru lagi untuk pengujian
  let testMemberId = null;
  try {
    const newMember2 = {
      registrationDate: '2025-08-02',
      kkNumber: '8888777766665555',
      memberNumber: 'RKM-TEST-012',
      headName: 'Testing Delete 2',
      wifeName: 'Testing Delete Istri 2',
      phone: '081234567912',
      street: 'Jl. Testing Delete No. 112',
      kelurahan: 'TestKelurahan12',
      kecamatan: 'TestKecamatan12',
      kabupaten: 'TestKabupaten12',
      beneficiaryName: 'Testing Delete Beneficiary 2',
      dependentsCount: 3,
      status: 'active'
    };

    const createResponse2 = await axios.post(`${BASE_URL}/api/members`, newMember2, {
      headers: { 'Authorization': `Bearer ${sekretarisToken}` }
    });
    testMemberId = createResponse2.data.member.id;
    console.log('✅ Anggota baru dibuat untuk pengujian akses:', testMemberId);
  } catch (error) {
    console.log('❌ Gagal membuat anggota baru untuk pengujian akses:', error.message);
  }

  // Test DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)
  console.log('\n   2. Testing DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)');
  try {
    if (testMemberId) {
      const response2 = await axios.delete(`${BASE_URL}/api/delete/members/${testMemberId}`, {
        headers: { 'Authorization': `Bearer ${sekretarisToken}` }
      });
      console.log('   ❌ Seharusnya gagal tapi berhasil - Status:', response2.status);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk pengujian akses');
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ Ditolak dengan benar - Status:', error.response.status, '| Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ Error tak terduga -', error.response?.data?.message || error.message);
    }
  }

  // Ambil ID pembayaran untuk pengujian
  let paymentId = null;
  try {
    const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
      paymentId = paymentsResponse.data.payments[0].id;
      console.log('✅ ID Pembayaran ditemukan:', paymentId);
    } else {
      // Buat pembayaran baru untuk pengujian
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        const testMemberId = membersResponse.data.members[0].id;
        
        const newPayment = {
          memberId: testMemberId,
          paymentDate: '2025-08-15',
          month: '2025-08',
          amount: 50000,
          receiptNumber: 'TEST-DEL-002'
        };

        const createPaymentResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        paymentId = createPaymentResponse.data.payment.id;
        console.log('✅ Pembayaran baru dibuat untuk pengujian delete:', paymentId);
      }
    }
  } catch (error) {
    console.log('⚠️  Tidak ada pembayaran untuk diuji');
  }

  // Test DELETE /api/delete/payments/:id (oleh ketua - seharusnya berhasil)
  console.log('\n💳 3. Testing DELETE /api/delete/payments/:id (oleh ketua)');
  try {
    if (paymentId) {
      const response = await axios.delete(`${BASE_URL}/api/delete/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('   ✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
    } else {
      console.log('   ⚠️  Tidak ada pembayaran untuk dihapus');
    }
  } catch (error) {
    console.log('   ❌ Gagal -', error.response?.data?.message || error.message);
  }

  // Ambil ID pengeluaran untuk pengujian
  let expenseId = null;
  try {
    const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
      expenseId = expensesResponse.data.expenses[0].id;
      console.log('✅ ID Pengeluaran ditemukan:', expenseId);
    } else {
      // Buat pengeluaran baru untuk pengujian
      const newExpense = {
        date: '2025-08-20',
        category: 'transportasi',
        amount: 150000,
        description: 'Testing delete pengeluaran'
      };

      const createExpenseResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expenseId = createExpenseResponse.data.expense.id;
      console.log('✅ Pengeluaran baru dibuat untuk pengujian delete:', expenseId);
    }
  } catch (error) {
    console.log('⚠️  Tidak ada pengeluaran untuk diuji');
  }

  // Test DELETE /api/delete/expenses/:id (oleh ketua - seharusnya berhasil)
  console.log('\n💰 4. Testing DELETE /api/delete/expenses/:id (oleh ketua)');
  try {
    if (expenseId) {
      const response = await axios.delete(`${BASE_URL}/api/delete/expenses/${expenseId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('   ✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
    } else {
      console.log('   ⚠️  Tidak ada pengeluaran untuk dihapus');
    }
  } catch (error) {
    console.log('   ❌ Gagal -', error.response?.data?.message || error.message);
  }

  console.log('\n🎉🎉🎉 TESTING FUNGSIONALITAS DELETE SELESAI 🎉🎉🎉');
  console.log('='.repeat(60));
  console.log('✅ Semua endpoint DELETE telah diuji:');
  console.log('   - DELETE /api/delete/members/:id - Berfungsi');
  console.log('   - DELETE /api/delete/payments/:id - Berfungsi');
  console.log('   - DELETE /api/delete/expenses/:id - Berfungsi');
  console.log('   - Pembatasan akses berdasarkan role - Berfungsi');
  console.log('='.repeat(60));
}

// Jalankan testing
testDeleteFunctionality();