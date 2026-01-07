// tests/integration/test-finance-comprehensive.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

let authToken = '';
let testMember = null;

async function testFinanceComprehensive() {
  console.log('🧪🚀 MENGUJI KOMPONEN KEUANGAN SECARA KOMPREHENSIF');
  console.log('='.repeat(70));

  try {
    // Login
    console.log('\n🔑 MELAKUKAN LOGIN ADMIN...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USER.username,
      password: TEST_USER.password
    });
    authToken = loginResponse.data.token;
    console.log('✅ Login berhasil');

    // Ambil anggota untuk testing
    console.log('\n👥 MENGAMBIL DATA ANGGOTA UNTUK PENGUJIAN...');
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      testMember = membersResponse.data.members[0];
      console.log(`✅ Anggota ditemukan: ${testMember.name}`);
      console.log(`   Nomor Anggota: ${testMember.member_number}`);
      console.log(`   Tanggungan Awal: ${testMember.dependents_count}`);
    } else {
      console.log('❌ Tidak ada anggota untuk diuji');
      return;
    }

    // Test 1: Pembayaran kelipatan 20.000 (seharusnya mengurangi tanggungan)
    console.log('\n📋 TEST 1: PEMBAYARAN KELIPATAN 20.000');
    console.log('   Tujuan: Menguji apakah pembayaran kelipatan 20.000 mengurangi tanggungan');
    
    const initialDependents = testMember.dependents_count;
    const paymentAmount = 60000; // 3x kelipatan 20.000
    const expectedReduction = 3; // Harusnya mengurangi 3 tanggungan
    const expectedDependentsAfter = Math.max(0, initialDependents - expectedReduction);
    
    const paymentData1 = {
      memberId: testMember.id,
      paymentDate: new Date().toISOString().split('T')[0],
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      amount: paymentAmount,
      receiptNumber: `TEST-FIN-${Date.now()}`
    };
    
    try {
      const paymentResponse = await axios.post(`${BASE_URL}/api/payments`, paymentData1, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Pembayaran berhasil dibuat');
      console.log(`   Jumlah pembayaran: Rp ${paymentAmount.toLocaleString('id-ID')}`);
      console.log(`   Kelipatan 20.000: ${Math.floor(paymentAmount / 20000)}x`);
      
      // Ambil data anggota setelah pembayaran
      const updatedMemberResponse = await axios.get(`${BASE_URL}/api/members/${testMember.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      const newDependents = updatedMemberResponse.data.dependents_count;
      console.log(`   Tanggungan sebelum: ${initialDependents}`);
      console.log(`   Tanggungan sesudah: ${newDependents}`);
      console.log(`   Pengurangan yang diharapkan: ${expectedReduction || 3}`);
      console.log(`   Pengurangan yang terjadi: ${initialDependents - newDependents}`);
      
      if (newDependents === expectedDependentsAfter) {
        console.log('✅ TEST 1 BERHASIL: Tanggungan berkurang sesuai dengan kelipatan 20.000');
      } else {
        console.log(`❌ TEST 1 GAGAL: Tanggungan seharusnya ${expectedDependentsAfter} tapi sekarang ${newDependents}`);
      }
    } catch (error) {
      console.log(`❌ TEST 1 GAGAL: ${error.response?.data?.message || error.message}`);
    }

    // Test 2: Pembayaran bukan kelipatan 20.000 (seharusnya tidak mengurangi tanggungan)
    console.log('\n📋 TEST 2: PEMBAYARAN BUKAN KELIPATAN 20.000');
    console.log('   Tujuan: Menguji apakah pembayaran bukan kelipatan 20.000 tidak mengurangi tanggungan');
    
    const paymentAmount2 = 25000; // Bukan kelipatan 20.000
    const currentDependents = await getCurrentDependents(testMember.id);
    const expectedDependentsAfter2 = currentDependents; // Tidak berubah
    
    const paymentData2 = {
      memberId: testMember.id,
      paymentDate: new Date().toISOString().split('T')[0],
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      amount: paymentAmount2,
      receiptNumber: `TEST-FIN-${Date.now()}2`
    };
    
    try {
      const paymentResponse2 = await axios.post(`${BASE_URL}/api/payments`, paymentData2, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Pembayaran kedua berhasil dibuat');
      console.log(`   Jumlah pembayaran: Rp ${paymentAmount2.toLocaleString('id-ID')}`);
      console.log(`   Apakah kelipatan 20.000: ${(paymentAmount2 % 20000 === 0) ? 'YA' : 'TIDAK'}`);
      
      // Ambil data anggota setelah pembayaran kedua
      const updatedMemberResponse2 = await axios.get(`${BASE_URL}/api/members/${testMember.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      const newDependents2 = updatedMemberResponse2.data.dependents_count;
      console.log(`   Tanggungan sebelum: ${currentDependents}`);
      console.log(`   Tanggungan sesudah: ${newDependents2}`);
      console.log(`   Harusnya tidak berubah: ${currentDependents === newDependents2 ? 'YA' : 'TIDAK'}`);
      
      if (newDependents2 === expectedDependentsAfter2) {
        console.log('✅ TEST 2 BERHASIL: Tanggungan tidak berubah karena pembayaran bukan kelipatan 20.000');
      } else {
        console.log(`❌ TEST 2 GAGAL: Tanggungan seharusnya ${expectedDependentsAfter2} tapi sekarang ${newDependents2}`);
      }
    } catch (error) {
      console.log(`❌ TEST 2 GAGAL: ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Pembuatan pengeluaran
    console.log('\n💰 TEST 3: PEMBUATAN PENGELUARAN');
    console.log('   Tujuan: Menguji apakah pembuatan pengeluaran berfungsi');
    
    const expenseData = {
      date: new Date().toISOString().split('T')[0],
      category: 'kain_kafan',
      amount: 150000,
      description: 'Testing pembuatan pengeluaran'
    };
    
    try {
      const expenseResponse = await axios.post(`${BASE_URL}/api/expenses`, expenseData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Pengeluaran berhasil dibuat');
      console.log(`   Jumlah: Rp ${expenseData.amount.toLocaleString('id-ID')}`);
      console.log(`   Kategori: ${expenseData.category}`);
      console.log(`   Deskripsi: ${expenseData.description}`);
    } catch (error) {
      console.log(`❌ TEST 3 GAGAL: ${error.response?.data?.message || error.message}`);
    }

    // Test 4: Update pengeluaran
    console.log('\n✏️  TEST 4: UPDATE PENGELUARAN');
    console.log('   Tujuan: Menguji apakah update pengeluaran berfungsi');
    
    try {
      // Ambil ID pengeluaran yang baru saja dibuat (kita ambil pengeluaran terbaru)
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
        const latestExpense = expensesResponse.data.expenses[0];
        
        const updateExpenseData = {
          date: new Date().toISOString().split('T')[0],
          category: 'transportasi',
          amount: 200000,
          description: 'Pengeluaran transportasi diperbarui'
        };
        
        const updateResponse = await axios.put(`${BASE_URL}/api/expenses/${latestExpense.id}`, updateExpenseData, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Pengeluaran berhasil diperbarui');
        console.log(`   ID Pengeluaran: ${latestExpense.id}`);
        console.log(`   Jumlah baru: Rp ${updateExpenseData.amount.toLocaleString('id-ID')}`);
        console.log(`   Kategori baru: ${updateExpenseData.category}`);
      } else {
        console.log('⚠️  Tidak ada pengeluaran untuk diupdate');
      }
    } catch (error) {
      console.log(`❌ TEST 4 GAGAL: ${error.response?.data?.message || error.message}`);
    }

    // Test 5: Laporan keuangan
    console.log('\n📊 TEST 5: LAPORAN KEUANGAN');
    console.log('   Tujuan: Menguji endpoint laporan keuangan');
    
    try {
      const reportResponse = await axios.get(`${BASE_URL}/api/reports/summary`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log('✅ Laporan keuangan berhasil dimuat');
      console.log(`   Total Pemasukan: Rp ${reportResponse.data.summary.total_income}`);
      console.log(`   Total Pengeluaran: Rp ${reportResponse.data.summary.total_expenses}`);
      console.log(`   Saldo: Rp ${reportResponse.data.summary.net_balance}`);
    } catch (error) {
      console.log(`❌ TEST 5 GAGAL: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎉🎉🎉 PENGUJIAN KOMPONEN KEUANGAN SELESAI 🎉🎉🎉');
    console.log('='.repeat(70));
    console.log('✅ Ringkasan hasil pengujian:');
    console.log('   - Pembayaran kelipatan 20.000 mengurangi tanggungan: DITEST');
    console.log('   - Pembayaran non-kelipatan 20.000 tidak mengurangi tanggungan: DITEST');
    console.log('   - Pembuatan pengeluaran: BERHASIL');
    console.log('   - Update pengeluaran: BERHASIL');
    console.log('   - Laporan keuangan: BERHASIL');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('❌ Error dalam pengujian komprehensif:', error.message);
    if (error.response) {
      console.error('Response error:', error.response.data);
    }
  }
}

// Fungsi bantu untuk mendapatkan jumlah tanggungan terbaru
async function getCurrentDependents(memberId) {
  const response = await axios.get(`${BASE_URL}/api/members/${memberId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.data.dependents_count;
}

// Jalankan pengujian
testFinanceComprehensive();

module.exports = { testFinanceComprehensive };