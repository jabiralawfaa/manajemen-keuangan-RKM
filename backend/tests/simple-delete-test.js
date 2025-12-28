// tests/simple-delete-test.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function simpleDeleteTest() {
  console.log('🧪 Menguji endpoint DELETE...');

  try {
    // Login admin
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[0].username,
      password: TEST_USERS[0].password
    });
    const adminToken = adminLogin.data.token;
    console.log('✅ Login admin berhasil');

    // Ambil ID anggota untuk pengujian delete
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
          memberNumber: 'RKM-TEST-DEL-001',
          headName: 'Testing Delete',
          wifeName: 'Testing Delete Istri',
          phone: '081234567901',
          street: 'Jl. Testing Delete No. 101',
          kelurahan: 'TestKelurahanDel',
          kecamatan: 'TestKecamatanDel',
          kabupaten: 'TestKabupatenDel',
          beneficiaryName: 'Testing Delete Beneficiary',
          dependentsCount: 2,
          status: 'active'
        };

        const createResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        memberId = createResponse.data.member.id;
        console.log('✅ Anggota baru dibuat untuk pengujian delete:', memberId);
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID anggota:', error.message);
    }

    // Test DELETE /api/delete/members/:id (oleh ketua - seharusnya berhasil)
    if (memberId) {
      console.log('\n📋 Menguji DELETE /api/delete/members/:id (oleh ketua)');
      try {
        const response = await axios.delete(`${BASE_URL}/api/delete/members/${memberId}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
      } catch (error) {
        console.log('❌ Gagal -', error.response?.data?.message || error.message);
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
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID pembayaran:', error.message);
    }

    // Test DELETE /api/delete/payments/:id (oleh ketua - seharusnya berhasil)
    if (paymentId) {
      console.log('\n💳 Menguji DELETE /api/delete/payments/:id (oleh ketua)');
      try {
        const response = await axios.delete(`${BASE_URL}/api/delete/payments/${paymentId}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
      } catch (error) {
        console.log('❌ Gagal -', error.response?.data?.message || error.message);
      }
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
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID pengeluaran:', error.message);
    }

    // Test DELETE /api/delete/expenses/:id (oleh ketua - seharusnya berhasil)
    if (expenseId) {
      console.log('\n💰 Menguji DELETE /api/delete/expenses/:id (oleh ketua)');
      try {
        const response = await axios.delete(`${BASE_URL}/api/delete/expenses/${expenseId}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
      } catch (error) {
        console.log('❌ Gagal -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Testing endpoint DELETE selesai!');
  } catch (error) {
    console.error('❌ Error dalam testing:', error.message);
  }
}

// Jalankan testing
simpleDeleteTest();