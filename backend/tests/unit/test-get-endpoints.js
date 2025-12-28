// tests/test-get-endpoints.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

async function testGetEndpoints() {
  console.log('🧪 Memulai pengujian endpoint GET...');

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
        console.log('   Detail anggota:', memberResponse.data.head_name || memberResponse.data.member_number || 'N/A');
      } else {
        console.log('⚠️  Tidak ada anggota untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/members/:id: Gagal -', error.message);
    }

    // Test GET /api/payments
    console.log('\n💳 Menguji endpoint: GET /api/payments');
    try {
      const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, { headers });
      console.log('✅ GET /api/payments: Berhasil - Status:', paymentsResponse.status);
      console.log('   Jumlah pembayaran:', paymentsResponse.data.total || (paymentsResponse.data.payments ? paymentsResponse.data.payments.length : 'N/A'));
    } catch (error) {
      console.log('❌ GET /api/payments: Gagal -', error.message);
    }

    // Test GET /api/payments/:id
    console.log('\n🧾 Menguji endpoint: GET /api/payments/:id');
    try {
      const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, { headers });
      if (paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
        const paymentId = paymentsResponse.data.payments[0].id;
        const paymentResponse = await axios.get(`${BASE_URL}/api/payments/${paymentId}`, { headers });
        console.log('✅ GET /api/payments/:id: Berhasil - Status:', paymentResponse.status);
        console.log('   Detail pembayaran:', paymentResponse.data.amount || 'N/A');
      } else {
        console.log('⚠️  Tidak ada pembayaran untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/payments/:id: Gagal -', error.message);
    }

    // Test GET /api/expenses
    console.log('\n💰 Menguji endpoint: GET /api/expenses');
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, { headers });
      console.log('✅ GET /api/expenses: Berhasil - Status:', expensesResponse.status);
      console.log('   Jumlah pengeluaran:', expensesResponse.data.total || (expensesResponse.data.expenses ? expensesResponse.data.expenses.length : 'N/A'));
    } catch (error) {
      console.log('❌ GET /api/expenses: Gagal -', error.message);
    }

    // Test GET /api/expenses/:id
    console.log('\n📝 Menguji endpoint: GET /api/expenses/:id');
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, { headers });
      if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
        const expenseId = expensesResponse.data.expenses[0].id;
        const expenseResponse = await axios.get(`${BASE_URL}/api/expenses/${expenseId}`, { headers });
        console.log('✅ GET /api/expenses/:id: Berhasil - Status:', expenseResponse.status);
        console.log('   Detail pengeluaran:', expenseResponse.data.amount || 'N/A');
      } else {
        console.log('⚠️  Tidak ada pengeluaran untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/expenses/:id: Gagal -', error.message);
    }

    // Test GET /api/auth/profile
    console.log('\n👤 Menguji endpoint: GET /api/auth/profile');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, { headers });
      console.log('✅ GET /api/auth/profile: Berhasil - Status:', profileResponse.status);
      console.log('   Profil user:', profileResponse.data.user.name || profileResponse.data.user.username);
    } catch (error) {
      console.log('❌ GET /api/auth/profile: Gagal -', error.message);
    }

    console.log('\n🎉 Pengujian endpoint GET selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testGetEndpoints();

module.exports = { testGetEndpoints };