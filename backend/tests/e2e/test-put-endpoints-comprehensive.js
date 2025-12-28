// tests/test-put-endpoints-comprehensive.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function testComprehensivePutEndpoints() {
  console.log('🧪 Memulai pengujian endpoint PUT komprehensif...');

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

    // Test semua endpoint PUT dengan role yang sesuai
    await testUpdateMemberEndpoints(tokens);
    await testUpdatePaymentEndpoints(tokens);
    await testUpdateExpenseEndpoints(tokens);
    await testChangePasswordEndpoints(tokens);
    
    console.log('\n🎉 Pengujian endpoint PUT komprehensif selesai!');
    console.log('\n✅ Semua endpoint PUT yang dibutuhkan berdasarkan SRS telah diuji:');
    console.log('   - Modul Manajemen Anggota (Update)');
    console.log('   - Modul Keuangan - Pemasukan (Update)');
    console.log('   - Modul Keuangan - Pengeluaran (Update)');
    console.log('   - Modul Perubahan Sandi');
    console.log('   - Pembatasan akses berdasarkan role telah diuji');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

async function testUpdateMemberEndpoints(tokens) {
  console.log('\n📋 Menguji endpoint Update Modul Manajemen Anggota...');

  // Ambil ID anggota untuk pengujian update
  let memberId = null;
  let memberOriginalData = null;
  try {
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, { 
      headers: { 
        'Authorization': `Bearer ${tokens.admin}`,
        'Content-Type': 'application/json'
      } 
    });
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      memberId = membersResponse.data.members[0].id;
      memberOriginalData = membersResponse.data.members[0];
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID anggota:', error.message);
  }

  // Test PUT /api/members/:id (oleh sekretaris - seharusnya berhasil)
  console.log('\n   1. Menguji PUT /api/members/:id (oleh sekretaris)');
  try {
    if (memberId) {
      const updatedMember = {
        registrationDate: '2025-06-01',
        kkNumber: '9999000011112222',
        memberNumber: memberOriginalData.member_number,
        headName: 'Ahmad Sugiarto Update',
        wifeName: 'Siti Khasanah Update',
        phone: '081234567903',
        street: 'Jl. Kenangan No. 20 Update',
        kelurahan: 'Sukadamai Update',
        kecamatan: 'Sukacinta Update',
        kabupaten: 'Bandung Update',
        beneficiaryName: 'Ahmad Sugiarto Update',
        dependentsCount: 4,
        status: 'active'
      };

      const response = await axios.put(`${BASE_URL}/api/members/${memberId}`, updatedMember, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/members/:id (oleh sekretaris): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
      console.log('      Nama Anggota Baru:', response.data.member.headName);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk diupdate');
    }
  } catch (error) {
    console.log('   ❌ PUT /api/members/:id (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
  }

  // Test PUT /api/members/:id (oleh bendahara - seharusnya gagal)
  console.log('\n   2. Menguji PUT /api/members/:id (oleh bendahara - seharusnya gagal)');
  try {
    if (memberId) {
      const updatedMember2 = {
        registrationDate: '2025-06-01',
        kkNumber: '9999000011112222',
        memberNumber: memberOriginalData.member_number,
        headName: 'Ahmad Sugiarto Update 2',
        wifeName: 'Siti Khasanah Update 2',
        phone: '081234567903',
        street: 'Jl. Kenangan No. 20 Update 2',
        kelurahan: 'Sukadamai Update 2',
        kecamatan: 'Sukacinta Update 2',
        kabupaten: 'Bandung Update 2',
        beneficiaryName: 'Ahmad Sugiarto Update 2',
        dependentsCount: 4,
        status: 'active'
      };

      const response2 = await axios.put(`${BASE_URL}/api/members/${memberId}`, updatedMember2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ PUT /api/members/:id (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk diupdate');
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ PUT /api/members/:id (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
      console.log('      Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ PUT /api/members/:id (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }

  // Test PUT /api/members/:id (oleh ketua - seharusnya berhasil)
  console.log('\n   3. Menguji PUT /api/members/:id (oleh ketua)');
  try {
    if (memberId) {
      const updatedMember3 = {
        registrationDate: '2025-06-01',
        kkNumber: '9999000011112222',
        memberNumber: memberOriginalData.member_number,
        headName: 'Ahmad Sugiarto Update 3 (oleh Ketua)',
        wifeName: 'Siti Khasanah Update 3 (oleh Ketua)',
        phone: '081234567903',
        street: 'Jl. Kenangan No. 20 Update 3',
        kelurahan: 'Sukadamai Update 3',
        kecamatan: 'Sukacinta Update 3',
        kabupaten: 'Bandung Update 3',
        beneficiaryName: 'Ahmad Sugiarto Update 3 (oleh Ketua)',
        dependentsCount: 4,
        status: 'active'
      };

      const response3 = await axios.put(`${BASE_URL}/api/members/${memberId}`, updatedMember3, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/members/:id (oleh ketua): Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
      console.log('      Nama Anggota Baru:', response3.data.member.headName);
    } else {
      console.log('   ⚠️  Tidak ada anggota untuk diupdate');
    }
  } catch (error) {
    console.log('   ❌ PUT /api/members/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
  }
}

async function testUpdatePaymentEndpoints(tokens) {
  console.log('\n💳 Menguji endpoint Update Modul Keuangan - Pemasukan...');

  // Ambil ID pembayaran untuk pengujian update
  let paymentId = null;
  let paymentOriginalData = null;
  try {
    const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, { 
      headers: { 
        'Authorization': `Bearer ${tokens.admin}`,
        'Content-Type': 'application/json'
      } 
    });
    if (paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
      paymentId = paymentsResponse.data.payments[0].id;
      paymentOriginalData = paymentsResponse.data.payments[0];
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID pembayaran:', error.message);
  }

  // Test PUT /api/payments/:id (oleh bendahara - seharusnya berhasil)
  console.log('\n   1. Menguji PUT /api/payments/:id (oleh bendahara)');
  try {
    if (paymentId) {
      const updatedPayment = {
        memberId: paymentOriginalData.member_id,
        paymentDate: '2025-06-15',
        month: '2025-06',
        amount: 55000,
        receiptNumber: paymentOriginalData.receipt_number
      };

      const response = await axios.put(`${BASE_URL}/api/payments/${paymentId}`, updatedPayment, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/payments/:id (oleh bendahara): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
      console.log('      Jumlah Pembayaran Baru:', response.data.payment.amount);
    } else {
      console.log('   ⚠️  Tidak ada pembayaran untuk diupdate');
    }
  } catch (error) {
    console.log('   ❌ PUT /api/payments/:id (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
  }

  // Test PUT /api/payments/:id (oleh sekretaris - seharusnya gagal)
  console.log('\n   2. Menguji PUT /api/payments/:id (oleh sekretaris - seharusnya gagal)');
  try {
    if (paymentId) {
      const updatedPayment2 = {
        memberId: paymentOriginalData.member_id,
        paymentDate: '2025-06-16',
        month: '2025-06',
        amount: 60000,
        receiptNumber: paymentOriginalData.receipt_number
      };

      const response2 = await axios.put(`${BASE_URL}/api/payments/${paymentId}`, updatedPayment2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ PUT /api/payments/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } else {
      console.log('   ⚠️  Tidak ada pembayaran untuk diupdate');
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ PUT /api/payments/:id (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
      console.log('      Pesan:', error.response.data.message);
    } else {
      console.log('   ❌ PUT /api/payments/:id (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
    }
  }

  // Test PUT /api/payments/:id (oleh ketua - seharusnya berhasil)
  console.log('\n   3. Menguji PUT /api/payments/:id (oleh ketua)');
  try {
    if (paymentId) {
      const updatedPayment3 = {
        memberId: paymentOriginalData.member_id,
        paymentDate: '2025-06-17',
        month: '2025-06',
        amount: 65000,
        receiptNumber: paymentOriginalData.receipt_number
      };

      const response3 = await axios.put(`${BASE_URL}/api/payments/${paymentId}`, updatedPayment3, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ PUT /api/payments/:id (oleh ketua): Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
      console.log('      Jumlah Pembayaran Baru:', response3.data.payment.amount);
    } else {
      console.log('   ⚠️  Tidak ada pembayaran untuk diupdate');
    }
  } catch (error) {
    console.log('   ❌ PUT /api/payments/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
  }
}

async function testUpdateExpenseEndpoints(tokens) {
  console.log('\n💰 Menguji endpoint Update Modul Keuangan - Pengeluaran...');

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
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID pengeluaran:', error.message);
  }

  // Test PUT /api/expenses/:id (oleh bendahara - seharusnya berhasil)
  console.log('\n   1. Menguji PUT /api/expenses/:id (oleh bendahara)');
  try {
    if (expenseId) {
      const updatedExpense = {
        date: '2025-06-20',
        category: 'transportasi',
        amount: 200000,
        description: 'Transportasi rapat pengurus update'
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
    } else {
      console.log('   ⚠️  Tidak ada pengeluaran untuk diupdate');
    }
  } catch (error) {
    console.log('   ❌ PUT /api/expenses/:id (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
  }

  // Test PUT /api/expenses/:id (oleh sekretaris - seharusnya gagal)
  console.log('\n   2. Menguji PUT /api/expenses/:id (oleh sekretaris - seharusnya gagal)');
  try {
    if (expenseId) {
      const updatedExpense2 = {
        date: '2025-06-21',
        category: 'alat_tulis',
        amount: 80000,
        description: 'Pembelian perlengkapan administrasi update'
      };

      const response2 = await axios.put(`${BASE_URL}/api/expenses/${expenseId}`, updatedExpense2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ PUT /api/expenses/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } else {
      console.log('   ⚠️  Tidak ada pengeluaran untuk diupdate');
    }
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
    if (expenseId) {
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
    } else {
      console.log('   ⚠️  Tidak ada pengeluaran untuk diupdate');
    }
  } catch (error) {
    console.log('   ❌ PUT /api/expenses/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
  }
}

async function testChangePasswordEndpoints(tokens) {
  console.log('\n🔐 Menguji endpoint Perubahan Password...');

  // Test PUT /api/change-password/change-password (oleh semua role)
  console.log('\n   1. Menguji PUT /api/change-password/change-password (oleh sekretaris)');
  try {
    const changePasswordData = {
      currentPassword: 'password123',
      newPassword: 'Newpassword4567',
      confirmNewPassword: 'Newpassword4567'
    };

    const response = await axios.put(`${BASE_URL}/api/change-password/change-password`, changePasswordData, { 
      headers: { 
        'Authorization': `Bearer ${tokens.sekretaris}`,
        'Content-Type': 'application/json'
      } 
    });
    console.log('   ✅ PUT /api/change-password/change-password (oleh sekretaris): Berhasil - Status:', response.status);
    console.log('      Pesan:', response.data.message);
  } catch (error) {
    console.log('   ❌ PUT /api/change-password/change-password (oleh sekretaris): Gagal -', error.response?.data?.message || error.message);
  }

  // Test PUT /api/change-password/reset-password/:userId (oleh ketua)
  console.log('\n   2. Menguji PUT /api/change-password/reset-password/:userId (oleh ketua)');
  try {
    // Reset password untuk user sekretaris2 (cari ID dari profil)
    const resetPasswordData = {
      newPassword: 'ResetPassword123'
    };

    // Ambil ID user sekretaris2 dari profil
    const sekretaris2ProfileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${tokens.sekretaris}`,
        'Content-Type': 'application/json'
      }
    });
    const sekretaris2Id = sekretaris2ProfileResponse.data.user.id;

    const response2 = await axios.put(`${BASE_URL}/api/change-password/reset-password/${sekretaris2Id}`, resetPasswordData, {
      headers: {
        'Authorization': `Bearer ${tokens.admin}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('   ✅ PUT /api/change-password/reset-password/:userId (oleh ketua): Berhasil - Status:', response2.status);
    console.log('      Pesan:', response2.data.message);
  } catch (error) {
    console.log('   ❌ PUT /api/change-password/reset-password/:userId (oleh ketua): Gagal -', error.response?.data?.message || error.message);
  }
}

// Jalankan pengujian
testComprehensivePutEndpoints();

module.exports = { testComprehensivePutEndpoints };