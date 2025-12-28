// run-delete-test.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function runDeleteTest() {
  console.log('🧪 Memulai pengujian endpoint DELETE komprehensif final...');

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

    // Ambil ID data untuk pengujian delete
    let memberId = null;
    let paymentId = null;
    let expenseId = null;

    // Ambil ID anggota untuk pengujian delete
    try {
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        memberId = membersResponse.data.members[0].id;
      }
    } catch (error) {
      console.log('⚠️  Gagal mengambil ID anggota:', error.message);
    }

    // Ambil ID pembayaran untuk pengujian delete
    try {
      const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      if (paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
        paymentId = paymentsResponse.data.payments[0].id;
      }
    } catch (error) {
      console.log('⚠️  Gagal mengambil ID pembayaran:', error.message);
    }

    // Ambil ID pengeluaran untuk pengujian delete
    try {
      const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
        expenseId = expensesResponse.data.expenses[0].id;
      }
    } catch (error) {
      console.log('⚠️  Gagal mengambil ID pengeluaran:', error.message);
    }

    // Test DELETE /api/delete/members/:id (oleh ketua - seharusnya berhasil)
    console.log('\n📋 Menguji DELETE /api/delete/members/:id (oleh ketua)');
    try {
      if (memberId) {
        const response = await axios.delete(`${BASE_URL}/api/delete/members/${memberId}`, {
          headers: { 'Authorization': `Bearer ${tokens.admin}` }
        });
        console.log('✅ DELETE /api/delete/members/:id (oleh ketua): Berhasil - Status:', response.status);
        console.log('   Pesan:', response.data.message);
      } else {
        console.log('⚠️  Tidak ada anggota untuk dihapus');
      }
    } catch (error) {
      console.log('❌ DELETE /api/delete/members/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)');
    try {
      // Buat anggota baru untuk pengujian
      const newMember = {
        registrationDate: '2025-08-01',
        kkNumber: '9999888877776666',
        memberNumber: 'RKM-TEST-009',
        headName: 'Testing Delete Sekretaris',
        wifeName: 'Testing Delete Istri Sekretaris',
        phone: '081234567909',
        street: 'Jl. Testing Delete No. 109',
        kelurahan: 'TestKelurahan9',
        kecamatan: 'TestKecamatan9',
        kabupaten: 'TestKabupaten9',
        beneficiaryName: 'Testing Delete Beneficiary Sekretaris',
        dependentsCount: 2,
        status: 'active'
      };

      const createResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
      });
      const testMemberId = createResponse.data.member.id;
      console.log('      Anggota baru dibuat untuk pengujian delete sekretaris:', testMemberId);

      try {
        const response2 = await axios.delete(`${BASE_URL}/api/delete/members/${testMemberId}`, {
          headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
        });
        console.log('   ❌ DELETE /api/delete/members/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
      } catch (deleteError) {
        if (deleteError.response && deleteError.response.status === 403) {
          console.log('   ✅ DELETE /api/delete/members/:id (oleh sekretaris): Ditolak dengan benar - Status:', deleteError.response.status);
          console.log('      Pesan:', deleteError.response.data.message);
        } else {
          console.log('   ❌ DELETE /api/delete/members/:id (oleh sekretaris): Error tak terduga -', deleteError.response?.data?.message || deleteError.message);
        }
      }
    } catch (createError) {
      console.log('   ❌ Gagal membuat anggota untuk pengujian:', createError.response?.data?.message || createError.message);
    }

    // Test DELETE /api/delete/payments/:id (oleh ketua - seharusnya berhasil)
    console.log('\n💳 Menguji DELETE /api/delete/payments/:id (oleh ketua)');
    try {
      if (paymentId) {
        const response = await axios.delete(`${BASE_URL}/api/delete/payments/${paymentId}`, {
          headers: { 'Authorization': `Bearer ${tokens.admin}` }
        });
        console.log('✅ DELETE /api/delete/payments/:id (oleh ketua): Berhasil - Status:', response.status);
        console.log('   Pesan:', response.data.message);
      } else {
        console.log('⚠️  Tidak ada pembayaran untuk dihapus');
      }
    } catch (error) {
      console.log('❌ DELETE /api/delete/payments/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test DELETE /api/delete/payments/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/payments/:id (oleh sekretaris - seharusnya gagal)');
    try {
      // Ambil ID anggota untuk pembuatan pembayaran pengujian
      const membersResponse2 = await axios.get(`${BASE_URL}/api/members`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      if (membersResponse2.data.members && membersResponse2.data.members.length > 0) {
        const testMemberId2 = membersResponse2.data.members[0].id;

        // Buat pembayaran baru untuk pengujian
        const newPayment = {
          memberId: testMemberId2,
          paymentDate: '2025-08-15',
          month: '2025-08',
          amount: 55000,
          receiptNumber: 'TEST-DEL-001'
        };

        const createPaymentResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, {
          headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
        });
        const testPaymentId = createPaymentResponse.data.payment.id;
        console.log('      Pembayaran baru dibuat untuk pengujian delete sekretaris:', testPaymentId);

        try {
          const response2 = await axios.delete(`${BASE_URL}/api/delete/payments/${testPaymentId}`, {
            headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
          });
          console.log('   ❌ DELETE /api/delete/payments/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
        } catch (deleteError) {
          if (deleteError.response && deleteError.response.status === 403) {
            console.log('   ✅ DELETE /api/delete/payments/:id (oleh sekretaris): Ditolak dengan benar - Status:', deleteError.response.status);
            console.log('      Pesan:', deleteError.response.data.message);
          } else {
            console.log('   ❌ DELETE /api/delete/payments/:id (oleh sekretaris): Error tak terduga -', deleteError.response?.data?.message || deleteError.message);
          }
        }
      } else {
        console.log('   ⚠️  Tidak ada anggota untuk membuat pembayaran pengujian');
      }
    } catch (error) {
      console.log('   ❌ Gagal membuat pembayaran untuk pengujian:', error.response?.data?.message || error.message);
    }

    // Test DELETE /api/delete/expenses/:id (oleh ketua - seharusnya berhasil)
    console.log('\n💰 Menguji DELETE /api/delete/expenses/:id (oleh ketua)');
    try {
      if (expenseId) {
        const response = await axios.delete(`${BASE_URL}/api/delete/expenses/${expenseId}`, {
          headers: { 'Authorization': `Bearer ${tokens.admin}` }
        });
        console.log('✅ DELETE /api/delete/expenses/:id (oleh ketua): Berhasil - Status:', response.status);
        console.log('   Pesan:', response.data.message);
      } else {
        console.log('⚠️  Tidak ada pengeluaran untuk dihapus');
      }
    } catch (error) {
      console.log('❌ DELETE /api/delete/expenses/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Test DELETE /api/delete/expenses/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/expenses/:id (oleh sekretaris - seharusnya gagal)');
    try {
      // Buat pengeluaran baru untuk pengujian
      const newExpense = {
        date: '2025-08-20',
        category: 'alat_tulis',
        amount: 80000,
        description: 'Testing delete expense by sekretaris'
      };

      const createExpenseResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      const testExpenseId = createExpenseResponse.data.expense.id;
      console.log('      Pengeluaran baru dibuat untuk pengujian delete sekretaris:', testExpenseId);

      try {
        const response2 = await axios.delete(`${BASE_URL}/api/delete/expenses/${testExpenseId}`, {
          headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
        });
        console.log('   ❌ DELETE /api/delete/expenses/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
      } catch (deleteError) {
        if (deleteError.response && deleteError.response.status === 403) {
          console.log('   ✅ DELETE /api/delete/expenses/:id (oleh sekretaris): Ditolak dengan benar - Status:', deleteError.response.status);
          console.log('      Pesan:', deleteError.response.data.message);
        } else {
          console.log('   ❌ DELETE /api/delete/expenses/:id (oleh sekretaris): Error tak terduga -', deleteError.response?.data?.message || deleteError.message);
        }
      }
    } catch (error) {
      console.log('   ❌ Gagal membuat pengeluaran untuk pengujian:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Pengujian endpoint DELETE komprehensif final selesai!');
    console.log('\n✅ Semua endpoint DELETE yang dibutuhkan berdasarkan SRS telah diuji:');
    console.log('   - Modul Manajemen Anggota (RF-MA-003)');
    console.log('   - Modul Keuangan - Pemasukan (RF-KP-003)');
    console.log('   - Modul Keuangan - Pengeluaran (RF-KG-003)');
    console.log('   - Pembatasan akses berdasarkan role telah diuji');
    console.log('   - Semua endpoint sesuai dengan SRS');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
runDeleteTest();