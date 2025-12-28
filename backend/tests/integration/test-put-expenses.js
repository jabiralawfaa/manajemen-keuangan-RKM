// tests/test-put-expenses.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'Newpassword123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'Newpassword456', role: 'bendahara' }
];

async function testPutExpenses() {
  console.log('🧪 Menguji endpoint PUT Modul Keuangan - Pengeluaran...');

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

    // Login untuk mendapatkan token sekretaris
    console.log('🔑 Melakukan login sekretaris untuk mendapatkan token...');
    const sekretarisLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[1].username,
      password: TEST_USERS[1].password
    });
    tokens.sekretaris = sekretarisLoginResponse.data.token;
    console.log('✅ Login sekretaris berhasil');

    // Login untuk mendapatkan token bendahara
    console.log('🔑 Melakukan login bendahara untuk mendapatkan token...');
    const bendaharaLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[2].username,
      password: TEST_USERS[2].password
    });
    tokens.bendahara = bendaharaLoginResponse.data.token;
    console.log('✅ Login bendahara berhasil');

    // Ambil ID pengeluaran untuk pengujian update
    let expenseId = null;
    let expenseOriginalData = null;
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
        expenseId = expensesResponse.data.expenses[0].id;
        expenseOriginalData = expensesResponse.data.expenses[0];
        console.log(`✅ ID Pengeluaran ditemukan: ${expenseId}, Jumlah: ${expenseOriginalData.amount}`);
      } else {
        console.log('⚠️  Tidak ada pengeluaran untuk diupdate');
        return;
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID pengeluaran:', error.message);
      return;
    }

    // Test PUT /api/expenses/:id (oleh bendahara - seharusnya berhasil)
    console.log('\n   1. Menguji PUT /api/expenses/:id (oleh bendahara)');
    try {
      const updatedExpense = {
        date: '2025-06-20',
        category: 'transportasi',
        amount: 200000,
        description: 'Transportasi rapat pengurus update oleh bendahara'
      };

      const response = await axios.put(`${BASE_URL}/api/expenses/${expenseId}`, updatedExpense, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/expenses/:id (oleh bendahara): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
      console.log('      Jumlah Pengeluaran Baru:', response.data.expense.amount);
    } catch (error) {
      console.log('   ❌ PUT /api/expenses/:id (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/expenses/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   2. Menguji PUT /api/expenses/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const updatedExpense2 = {
        date: '2025-06-21',
        category: 'alat_tulis',
        amount: 80000,
        description: 'Pembelian perlengkapan administrasi update oleh sekretaris'
      };

      const response2 = await axios.put(`${BASE_URL}/api/expenses/${expenseId}`, updatedExpense2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ PUT /api/expenses/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ PUT /api/expenses/:id (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ PUT /api/expenses/:id (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test PUT /api/expenses/:id (oleh ketua - seharusnya berhasil)
    console.log('\n   3. Menguji PUT /api/expenses/:id (oleh ketua)');
    try {
      const updatedExpense3 = {
        date: '2025-06-22',
        category: 'kain_kafan',
        amount: 275000,
        description: 'Pembelian kain kafan update oleh ketua'
      };

      const response3 = await axios.put(`${BASE_URL}/api/expenses/${expenseId}`, updatedExpense3, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/expenses/:id (oleh ketua): Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
      console.log('      Jumlah Pengeluaran Baru:', response3.data.expense.amount);
    } catch (error) {
      console.log('   ❌ PUT /api/expenses/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Pengujian endpoint PUT Modul Keuangan - Pengeluaran selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testPutExpenses();

module.exports = { testPutExpenses };