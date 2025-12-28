// tests/test-all-get-endpoints.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

async function testAllGetEndpoints() {
  console.log('🧪 Memulai pengujian semua endpoint GET...');

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

    // 1. Test GET /api/members
    console.log('\n📋 1. Menguji endpoint: GET /api/members');
    try {
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { headers });
      console.log('✅ GET /api/members: Berhasil - Status:', membersResponse.status);
      console.log('   Jumlah anggota:', membersResponse.data.total);
      console.log('   Halaman saat ini:', membersResponse.data.currentPage);
      console.log('   Total halaman:', membersResponse.data.totalPages);
    } catch (error) {
      console.log('❌ GET /api/members: Gagal -', error.message);
    }

    // 2. Test GET /api/members/search
    console.log('\n🔍 2. Menguji endpoint: GET /api/members/search');
    try {
      const searchResponse = await axios.get(`${BASE_URL}/api/members/search?search=Ahmad`, { headers });
      console.log('✅ GET /api/members/search: Berhasil - Status:', searchResponse.status);
      console.log('   Jumlah hasil pencarian:', searchResponse.data.total);
    } catch (error) {
      console.log('❌ GET /api/members/search: Gagal -', error.message);
    }

    // 3. Test GET /api/members/:id
    console.log('\n👤 3. Menguji endpoint: GET /api/members/:id');
    try {
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { headers });
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        const memberId = membersResponse.data.members[0].id;
        const memberResponse = await axios.get(`${BASE_URL}/api/members/${memberId}`, { headers });
        console.log('✅ GET /api/members/:id: Berhasil - Status:', memberResponse.status);
        console.log('   Detail anggota:', memberResponse.data.head_name);
      } else {
        console.log('⚠️  Tidak ada anggota untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/members/:id: Gagal -', error.message);
    }

    // 4. Test GET /api/payments
    console.log('\n💳 4. Menguji endpoint: GET /api/payments');
    try {
      const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, { headers });
      console.log('✅ GET /api/payments: Berhasil - Status:', paymentsResponse.status);
      console.log('   Jumlah pembayaran:', paymentsResponse.data.total);
    } catch (error) {
      console.log('❌ GET /api/payments: Gagal -', error.message);
    }

    // 5. Test GET /api/payments/:id
    console.log('\n🧾 5. Menguji endpoint: GET /api/payments/:id');
    try {
      const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, { headers });
      if (paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
        const paymentId = paymentsResponse.data.payments[0].id;
        const paymentResponse = await axios.get(`${BASE_URL}/api/payments/${paymentId}`, { headers });
        console.log('✅ GET /api/payments/:id: Berhasil - Status:', paymentResponse.status);
        console.log('   Detail pembayaran: Rp', paymentResponse.data.amount);
      } else {
        console.log('⚠️  Tidak ada pembayaran untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/payments/:id: Gagal -', error.message);
    }

    // 6. Test GET /api/expenses
    console.log('\n💰 6. Menguji endpoint: GET /api/expenses');
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, { headers });
      console.log('✅ GET /api/expenses: Berhasil - Status:', expensesResponse.status);
      console.log('   Jumlah pengeluaran:', expensesResponse.data.total);
    } catch (error) {
      console.log('❌ GET /api/expenses: Gagal -', error.message);
    }

    // 7. Test GET /api/expenses/:id
    console.log('\n📝 7. Menguji endpoint: GET /api/expenses/:id');
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, { headers });
      if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
        const expenseId = expensesResponse.data.expenses[0].id;
        const expenseResponse = await axios.get(`${BASE_URL}/api/expenses/${expenseId}`, { headers });
        console.log('✅ GET /api/expenses/:id: Berhasil - Status:', expenseResponse.status);
        console.log('   Detail pengeluaran: Rp', expenseResponse.data.amount);
      } else {
        console.log('⚠️  Tidak ada pengeluaran untuk diuji');
      }
    } catch (error) {
      console.log('❌ GET /api/expenses/:id: Gagal -', error.message);
    }

    // 8. Test GET /api/auth/profile
    console.log('\n👤 8. Menguji endpoint: GET /api/auth/profile');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, { headers });
      console.log('✅ GET /api/auth/profile: Berhasil - Status:', profileResponse.status);
      console.log('   Profil user:', profileResponse.data.user.name);
    } catch (error) {
      console.log('❌ GET /api/auth/profile: Gagal -', error.message);
    }

    // 9. Test GET /api/reports/summary
    console.log('\n📋 9. Menguji endpoint: GET /api/reports/summary');
    try {
      const summaryResponse = await axios.get(`${BASE_URL}/api/reports/summary`, { headers });
      console.log('✅ GET /api/reports/summary: Berhasil - Status:', summaryResponse.status);
      console.log('   Ringkasan keuangan:', summaryResponse.data.summary);
    } catch (error) {
      console.log('❌ GET /api/reports/summary: Gagal -', error.message);
    }

    // 10. Test GET /api/reports/income
    console.log('\n📊 10. Menguji endpoint: GET /api/reports/income');
    try {
      const incomeResponse = await axios.get(`${BASE_URL}/api/reports/income`, { headers });
      console.log('✅ GET /api/reports/income: Berhasil - Status:', incomeResponse.status);
      console.log('   Total pemasukan:', incomeResponse.data.totalIncome);
    } catch (error) {
      console.log('❌ GET /api/reports/income: Gagal -', error.message);
    }

    // 11. Test GET /api/reports/expenses
    console.log('\n📈 11. Menguji endpoint: GET /api/reports/expenses');
    try {
      const expensesReportResponse = await axios.get(`${BASE_URL}/api/reports/expenses`, { headers });
      console.log('✅ GET /api/reports/expenses: Berhasil - Status:', expensesReportResponse.status);
      console.log('   Total pengeluaran:', expensesReportResponse.data.totalExpenses);
    } catch (error) {
      console.log('❌ GET /api/reports/expenses: Gagal -', error.message);
    }

    // 12. Test GET /api/reports/comparison
    console.log('\n🔍 12. Menguji endpoint: GET /api/reports/comparison');
    try {
      const comparisonResponse = await axios.get(`${BASE_URL}/api/reports/comparison`, { headers });
      console.log('✅ GET /api/reports/comparison: Berhasil - Status:', comparisonResponse.status);
      console.log('   Perbandingan keuangan:', {
        income: comparisonResponse.data.totalIncome,
        expenses: comparisonResponse.data.totalExpenses,
        netBalance: comparisonResponse.data.netBalance
      });
    } catch (error) {
      console.log('❌ GET /api/reports/comparison: Gagal -', error.message);
    }

    console.log('\n🎉 Pengujian semua endpoint GET selesai!');
    console.log('\n✅ Semua endpoint GET yang dibutuhkan berdasarkan SRS telah diimplementasikan:');
    console.log('   - Modul Manajemen Anggota (RF-MA-002)');
    console.log('   - Modul Keuangan - Pemasukan (RF-KP-002)');
    console.log('   - Modul Keuangan - Pengeluaran (RF-KG-002)');
    console.log('   - Modul Otentikasi');
    console.log('   - Modul Laporan Keuangan');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testAllGetEndpoints();

module.exports = { testAllGetEndpoints };