// tests/test-get-endpoints-advanced.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

async function testAdvancedGetEndpoints() {
  console.log('🧪 Memulai pengujian endpoint GET lanjutan...');

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

    // Test endpoint GET untuk laporan pemasukan (RF-KP-002)
    console.log('\n📊 Menguji endpoint laporan pemasukan');
    try {
      // Test dengan filter bulan
      const paymentReportResponse = await axios.get(`${BASE_URL}/api/payments?month=2025-01`, { headers });
      console.log('✅ GET /api/payments?month=2025-01: Berhasil - Status:', paymentReportResponse.status);
    } catch (error) {
      console.log('⚠️  GET /api/payments?month=2025-01: Gagal -', error.message);
    }

    try {
      // Test dengan filter memberId
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { headers });
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        const memberId = membersResponse.data.members[0].id;
        const memberPaymentsResponse = await axios.get(`${BASE_URL}/api/payments?memberId=${memberId}`, { headers });
        console.log('✅ GET /api/payments?memberId=: Berhasil - Status:', memberPaymentsResponse.status);
      }
    } catch (error) {
      console.log('⚠️  GET /api/payments?memberId=: Gagal -', error.message);
    }

    // Test endpoint GET untuk laporan pengeluaran (RF-KG-002)
    console.log('\n📈 Menguji endpoint laporan pengeluaran');
    try {
      // Test dengan filter kategori
      const expenseReportResponse = await axios.get(`${BASE_URL}/api/expenses?category=transportasi`, { headers });
      console.log('✅ GET /api/expenses?category=transportasi: Berhasil - Status:', expenseReportResponse.status);
    } catch (error) {
      console.log('⚠️  GET /api/expenses?category=transportasi: Gagal -', error.message);
    }

    try {
      // Test dengan filter tanggal
      const expenseDateResponse = await axios.get(`${BASE_URL}/api/expenses?startDate=2025-01-01&endDate=2025-12-31`, { headers });
      console.log('✅ GET /api/expenses?startDate&endDate: Berhasil - Status:', expenseDateResponse.status);
    } catch (error) {
      console.log('⚠️  GET /api/expenses?startDate&endDate: Gagal -', error.message);
    }

    // Test endpoint GET dengan pagination dan search (RF-MA-002)
    console.log('\n🔍 Menguji endpoint dengan pagination dan search');
    try {
      const paginatedResponse = await axios.get(`${BASE_URL}/api/members?page=1&limit=5`, { headers });
      console.log('✅ GET /api/members?page=1&limit=5: Berhasil - Status:', paginatedResponse.status);
      console.log('   Total halaman:', paginatedResponse.data.totalPages || 'N/A');
    } catch (error) {
      console.log('⚠️  GET /api/members?page=1&limit=5: Gagal -', error.message);
    }

    try {
      const searchResponse = await axios.get(`${BASE_URL}/api/members?search=Ahmad`, { headers });
      console.log('✅ GET /api/members?search=Ahmad: Berhasil - Status:', searchResponse.status);
    } catch (error) {
      console.log('⚠️  GET /api/members?search=Ahmad: Gagal -', error.message);
    }

    try {
      const statusFilterResponse = await axios.get(`${BASE_URL}/api/members?status=active`, { headers });
      console.log('✅ GET /api/members?status=active: Berhasil - Status:', statusFilterResponse.status);
    } catch (error) {
      console.log('⚠️  GET /api/members?status=active: Gagal -', error.message);
    }

    // Test endpoint untuk mendapatkan semua kategori pengeluaran
    console.log('\n🏷️  Menguji endpoint untuk kategori pengeluaran');
    try {
      // Ini mungkin perlu dibuat endpoint baru, atau gunakan filter
      const allExpenses = await axios.get(`${BASE_URL}/api/expenses`, { headers });
      if (allExpenses.data.expenses) {
        const categories = [...new Set(allExpenses.data.expenses.map(e => e.category))];
        console.log('✅ Kategori pengeluaran yang tersedia:', categories.join(', '));
      }
    } catch (error) {
      console.log('⚠️  Gagal mengambil kategori pengeluaran:', error.message);
    }

    console.log('\n🎉 Pengujian endpoint GET lanjutan selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testAdvancedGetEndpoints();

module.exports = { testAdvancedGetEndpoints };