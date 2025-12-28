// tests/test-financial-reports.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

async function testFinancialReports() {
  console.log('🧪 Memulai pengujian endpoint laporan keuangan...');

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

    // Test endpoint GET /api/reports/summary
    console.log('\n📋 Menguji endpoint: GET /api/reports/summary');
    try {
      const summaryResponse = await axios.get(`${BASE_URL}/api/reports/summary`, { headers });
      console.log('✅ GET /api/reports/summary: Berhasil - Status:', summaryResponse.status);
      console.log('   Ringkasan:', summaryResponse.data.summary);
    } catch (error) {
      console.log('❌ GET /api/reports/summary: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/summary dengan filter tanggal
    console.log('\n🗓️  Menguji endpoint: GET /api/reports/summary dengan filter tanggal');
    try {
      const summaryWithFilterResponse = await axios.get(`${BASE_URL}/api/reports/summary?startDate=2025-01-01&endDate=2025-12-31`, { headers });
      console.log('✅ GET /api/reports/summary?startDate&endDate: Berhasil - Status:', summaryWithFilterResponse.status);
      console.log('   Ringkasan (dengan filter):', summaryWithFilterResponse.data.summary);
    } catch (error) {
      console.log('❌ GET /api/reports/summary?startDate&endDate: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/income
    console.log('\n💳 Menguji endpoint: GET /api/reports/income');
    try {
      const incomeResponse = await axios.get(`${BASE_URL}/api/reports/income`, { headers });
      console.log('✅ GET /api/reports/income: Berhasil - Status:', incomeResponse.status);
      console.log('   Total pemasukan:', incomeResponse.data.totalIncome);
      console.log('   Jumlah pembayaran:', incomeResponse.data.payments.length);
    } catch (error) {
      console.log('❌ GET /api/reports/income: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/income dengan filter bulan dan tahun
    console.log('\n📅 Menguji endpoint: GET /api/reports/income dengan filter bulan/tahun');
    try {
      const incomeWithFilterResponse = await axios.get(`${BASE_URL}/api/reports/income?month=2025-01&year=2025`, { headers });
      console.log('✅ GET /api/reports/income?month&year: Berhasil - Status:', incomeWithFilterResponse.status);
      console.log('   Total pemasukan (Jan 2025):', incomeWithFilterResponse.data.totalIncome);
    } catch (error) {
      console.log('❌ GET /api/reports/income?month&year: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/expenses
    console.log('\n💰 Menguji endpoint: GET /api/reports/expenses');
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/reports/expenses`, { headers });
      console.log('✅ GET /api/reports/expenses: Berhasil - Status:', expensesResponse.status);
      console.log('   Total pengeluaran:', expensesResponse.data.totalExpenses);
      console.log('   Jumlah pengeluaran:', expensesResponse.data.expenses.length);
    } catch (error) {
      console.log('❌ GET /api/reports/expenses: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/expenses dengan filter kategori
    console.log('\n🏷️  Menguji endpoint: GET /api/reports/expenses dengan filter kategori');
    try {
      const expensesWithFilterResponse = await axios.get(`${BASE_URL}/api/reports/expenses?category=transportasi`, { headers });
      console.log('✅ GET /api/reports/expenses?category: Berhasil - Status:', expensesWithFilterResponse.status);
      console.log('   Total pengeluaran (transportasi):', expensesWithFilterResponse.data.totalExpenses);
    } catch (error) {
      console.log('❌ GET /api/reports/expenses?category: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/comparison
    console.log('\n📊 Menguji endpoint: GET /api/reports/comparison');
    try {
      const comparisonResponse = await axios.get(`${BASE_URL}/api/reports/comparison`, { headers });
      console.log('✅ GET /api/reports/comparison: Berhasil - Status:', comparisonResponse.status);
      console.log('   Perbandingan:', {
        income: comparisonResponse.data.totalIncome,
        expenses: comparisonResponse.data.totalExpenses,
        netBalance: comparisonResponse.data.netBalance
      });
    } catch (error) {
      console.log('❌ GET /api/reports/comparison: Gagal -', error.message);
    }

    // Test endpoint GET /api/reports/comparison dengan filter bulan/tahun
    console.log('\n📈 Menguji endpoint: GET /api/reports/comparison dengan filter bulan/tahun');
    try {
      const comparisonWithFilterResponse = await axios.get(`${BASE_URL}/api/reports/comparison?month=2025-01&year=2025`, { headers });
      console.log('✅ GET /api/reports/comparison?month&year: Berhasil - Status:', comparisonWithFilterResponse.status);
      console.log('   Perbandingan (Jan 2025):', {
        income: comparisonWithFilterResponse.data.totalIncome,
        expenses: comparisonWithFilterResponse.data.totalExpenses,
        netBalance: comparisonWithFilterResponse.data.netBalance
      });
    } catch (error) {
      console.log('❌ GET /api/reports/comparison?month&year: Gagal -', error.message);
    }

    console.log('\n🎉 Pengujian endpoint laporan keuangan selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testFinancialReports();

module.exports = { testFinancialReports };