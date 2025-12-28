// simple-test-delete.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function simpleTest() {
  console.log('🧪 Testing endpoint DELETE...');

  // Login admin
  const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
    username: TEST_USERS[0].username,
    password: TEST_USERS[0].password
  });
  const adminToken = adminLogin.data.token;
  console.log('✅ Admin login berhasil');

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
      console.log('⚠️  Tidak ada anggota untuk dihapus');
    }
  } catch (error) {
    console.log('❌ Gagal mengambil anggota:', error.message);
  }

  if (memberId) {
    // Test DELETE oleh ketua
    console.log('\n📋 Testing DELETE /api/delete/members/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/members/${memberId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Berhasil - Status:', response.status, '| Pesan:', response.data.message);
    } catch (error) {
      console.log('❌ Gagal -', error.response?.data?.message || error.message);
    }
  }

  // Login bendahara
  const bendaharaLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
    username: TEST_USERS[2].username,
    password: TEST_USERS[2].password
  });
  const bendaharaToken = bendaharaLogin.data.token;
  console.log('\n✅ Bendahara login berhasil');

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
      console.log('⚠️  Tidak ada pembayaran untuk dihapus');
    }
  } catch (error) {
    console.log('❌ Gagal mengambil pembayaran:', error.message);
  }

  if (paymentId) {
    // Test DELETE oleh ketua
    console.log('\n💳 Testing DELETE /api/delete/payments/:id (oleh ketua)');
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
    } else {
      console.log('⚠️  Tidak ada pengeluaran untuk dihapus');
    }
  } catch (error) {
    console.log('❌ Gagal mengambil pengeluaran:', error.message);
  }

  if (expenseId) {
    // Test DELETE oleh ketua
    console.log('\n💰 Testing DELETE /api/delete/expenses/:id (oleh ketua)');
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
}

simpleTest();