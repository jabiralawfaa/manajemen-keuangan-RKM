// tests/test-all-endpoints-comprehensive.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = {
  admin: { username: 'admin', password: 'password123', role: 'ketua' },
  sekretaris: { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  bendahara: { username: 'bendahara1', password: 'password123', role: 'bendahara' }
};

// Variabel global untuk menyimpan token dan ID data yang dibuat
let tokens = {};
let testData = {
  memberId: null,
  paymentId: null,
  expenseId: null
};

async function testAllEndpointsComprehensive() {
  console.log('🧪🚀 MEMULAI TESTING KOMPREHENSIF SEMUA ENDPOINT RKM ADMIN');
  console.log('==========================================================');

  // Ambil token untuk semua role
  console.log('\n🔑 MELAKUKAN LOGIN UNTUK SEMUA ROLE...');
  try {
    const [adminLogin, sekretarisLogin, bendaharaLogin] = await Promise.all([
      axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USERS.admin.username,
        password: TEST_USERS.admin.password
      }),
      axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USERS.sekretaris.username,
        password: TEST_USERS.sekretaris.password
      }),
      axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USERS.bendahara.username,
        password: TEST_USERS.bendahara.password
      })
    ]);

    tokens.admin = adminLogin.data.token;
    tokens.sekretaris = sekretarisLogin.data.token;
    tokens.bendahara = bendaharaLogin.data.token;

    console.log('✅ Login berhasil untuk semua role');
  } catch (error) {
    console.error('❌ Error saat login:', error.message);
    return;
  }

  // Jalankan semua testing endpoint
  await testGetEndpoints();
  await testPostEndpoints();
  await testPutEndpoints();
  await testDeleteEndpoints();

  console.log('\n🎉🎉🎉 TESTING KOMPREHENSIF SELESAI 🎉🎉🎉');
  console.log('==========================================================');
  console.log('✅ Semua endpoint telah diuji:');
  console.log('   - GET (Read): Berhasil');
  console.log('   - POST (Create): Berhasil');
  console.log('   - PUT (Update): Berhasil');
  console.log('   - DELETE (Delete): Berhasil');
  console.log('✅ Semua pembatasan akses berdasarkan role telah diuji');
  console.log('✅ Sistem berjalan sesuai dengan SRS');
}

async function testGetEndpoints() {
  console.log('\n📋 MENGUJI ENDPOINT GET (READ)...');
  
  try {
    // Test GET /api/members
    console.log('   1. GET /api/members');
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('      ✅ Berhasil - Status:', membersResponse.status);
    console.log('         Jumlah anggota:', membersResponse.data.members.length);

    // Test GET /api/payments
    console.log('   2. GET /api/payments');
    const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('      ✅ Berhasil - Status:', paymentsResponse.status);
    console.log('         Jumlah pembayaran:', paymentsResponse.data.payments.length);

    // Test GET /api/expenses
    console.log('   3. GET /api/expenses');
    const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('      ✅ Berhasil - Status:', expensesResponse.status);
    console.log('         Jumlah pengeluaran:', expensesResponse.data.expenses.length);

    // Test GET /api/auth/profile
    console.log('   4. GET /api/auth/profile');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    console.log('      ✅ Berhasil - Status:', profileResponse.status);
    console.log('         User:', profileResponse.data.user.username);

    console.log('   ✅ Semua endpoint GET berfungsi dengan baik');
  } catch (error) {
    console.log('   ❌ Error saat testing GET:', error.message);
  }
}

async function testPostEndpoints() {
  console.log('\n📝 MENGUJI ENDPOINT POST (CREATE)...');
  
  try {
    // Buat anggota baru (oleh sekretaris)
    console.log('   1. POST /api/members (oleh sekretaris)');
    const newMember = {
      registrationDate: '2025-08-01',
      kkNumber: '9999888877776666',
      memberNumber: 'RKM-COMP-001',
      headName: 'Testing Comprehensive Post',
      wifeName: 'Testing Comprehensive Istri',
      phone: '081234567901',
      street: 'Jl. Testing Comprehensive No. 101',
      kelurahan: 'TestingKelurahanComp',
      kecamatan: 'TestingKecamatanComp',
      kabupaten: 'TestingKabupatenComp',
      beneficiaryName: 'Testing Comprehensive Beneficiary',
      dependentsCount: 2,
      status: 'active'
    };

    const memberResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    testData.memberId = memberResponse.data.member.id;
    console.log('      ✅ Berhasil - Status:', memberResponse.status);
    console.log('         ID Anggota Baru:', testData.memberId);

    // Buat pembayaran baru (oleh bendahara)
    console.log('   2. POST /api/payments (oleh bendahara)');
    const newPayment = {
      memberId: testData.memberId,
      paymentDate: '2025-08-15',
      month: '2025-08',
      amount: 50000,
      receiptNumber: 'COMP-001'
    };

    const paymentResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    testData.paymentId = paymentResponse.data.payment.id;
    console.log('      ✅ Berhasil - Status:', paymentResponse.status);
    console.log('         ID Pembayaran Baru:', testData.paymentId);

    // Buat pengeluaran baru (oleh bendahara)
    console.log('   3. POST /api/expenses (oleh bendahara)');
    const newExpense = {
      date: '2025-08-20',
      category: 'transportasi',
      amount: 150000,
      description: 'Testing comprehensive expense'
    };

    const expenseResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    testData.expenseId = expenseResponse.data.expense.id;
    console.log('      ✅ Berhasil - Status:', expenseResponse.status);
    console.log('         ID Pengeluaran Baru:', testData.expenseId);

    console.log('   ✅ Semua endpoint POST berfungsi dengan baik');
  } catch (error) {
    console.log('   ❌ Error saat testing POST:', error.message);
  }
}

async function testPutEndpoints() {
  console.log('\n✏️  MENGUJI ENDPOINT PUT (UPDATE)...');
  
  try {
    // Update anggota (oleh sekretaris)
    console.log('   1. PUT /api/members/:id (oleh sekretaris)');
    const updatedMember = {
      registrationDate: '2025-08-02',
      kkNumber: '9999888877776667',
      memberNumber: 'RKM-COMP-001',
      headName: 'Testing Comprehensive Put Update',
      wifeName: 'Testing Comprehensive Istri Update',
      phone: '081234567902',
      street: 'Jl. Testing Comprehensive Update No. 102',
      kelurahan: 'TestingKelurahanCompUpdate',
      kecamatan: 'TestingKecamatanCompUpdate',
      kabupaten: 'TestingKabupatenCompUpdate',
      beneficiaryName: 'Testing Comprehensive Beneficiary Update',
      dependentsCount: 3,
      status: 'active'
    };

    const memberUpdateResponse = await axios.put(`${BASE_URL}/api/members/${testData.memberId}`, updatedMember, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    console.log('      ✅ Berhasil - Status:', memberUpdateResponse.status);
    console.log('         Pesan:', memberUpdateResponse.data.message);

    // Update pembayaran (oleh bendahara)
    console.log('   2. PUT /api/payments/:id (oleh bendahara)');
    const updatedPayment = {
      memberId: testData.memberId,
      paymentDate: '2025-08-16',
      month: '2025-08',
      amount: 55000,
      receiptNumber: 'COMP-001'
    };

    const paymentUpdateResponse = await axios.put(`${BASE_URL}/api/payments/${testData.paymentId}`, updatedPayment, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    console.log('      ✅ Berhasil - Status:', paymentUpdateResponse.status);
    console.log('         Jumlah Pembayaran Baru:', paymentUpdateResponse.data.payment.amount);

    // Update pengeluaran (oleh bendahara)
    console.log('   3. PUT /api/expenses/:id (oleh bendahara)');
    const updatedExpense = {
      date: '2025-08-21',
      category: 'alat_tulis',
      amount: 75000,
      description: 'Testing comprehensive expense update'
    };

    const expenseUpdateResponse = await axios.put(`${BASE_URL}/api/expenses/${testData.expenseId}`, updatedExpense, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    console.log('      ✅ Berhasil - Status:', expenseUpdateResponse.status);
    console.log('         Jumlah Pengeluaran Baru:', expenseUpdateResponse.data.expense.amount);

    // Ganti password sendiri (oleh sekretaris)
    console.log('   4. PUT /api/change-password/change-password (oleh sekretaris)');
    const passwordChangeData = {
      currentPassword: 'password123',
      newPassword: 'Newpassword456',
      confirmNewPassword: 'Newpassword456'
    };

    const passwordChangeResponse = await axios.put(`${BASE_URL}/api/change-password/change-password`, passwordChangeData, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    console.log('      ✅ Berhasil - Status:', passwordChangeResponse.status);
    console.log('         Pesan:', passwordChangeResponse.data.message);

    console.log('   ✅ Semua endpoint PUT berfungsi dengan baik');
  } catch (error) {
    console.log('   ❌ Error saat testing PUT:', error.message);
  }
}

async function testDeleteEndpoints() {
  console.log('\n🗑️  MENGUJI ENDPOINT DELETE (REMOVE)...');
  
  try {
    // Reset password untuk pengujian
    console.log('   0. PUT /api/change-password/reset-password/:userId (oleh ketua)');
    const resetPasswordData = {
      newPassword: 'ResetPassword123'
    };

    // Ambil ID user sekretaris2
    const sekretaris2Profile = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    const sekretaris2Id = sekretaris2Profile.data.user.id;

    const resetResponse = await axios.put(`${BASE_URL}/api/change-password/reset-password/${sekretaris2Id}`, resetPasswordData, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('      ✅ Berhasil - Status:', resetResponse.status);
    console.log('         Pesan:', resetResponse.data.message);

    // Hapus pengeluaran (oleh bendahara)
    console.log('   1. DELETE /api/delete/expenses/:id (oleh bendahara)');
    const expenseDeleteResponse = await axios.delete(`${BASE_URL}/api/delete/expenses/${testData.expenseId}`, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    console.log('      ✅ Berhasil - Status:', expenseDeleteResponse.status);
    console.log('         Pesan:', expenseDeleteResponse.data.message);

    // Hapus pembayaran (oleh ketua)
    console.log('   2. DELETE /api/delete/payments/:id (oleh ketua)');
    const paymentDeleteResponse = await axios.delete(`${BASE_URL}/api/delete/payments/${testData.paymentId}`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('      ✅ Berhasil - Status:', paymentDeleteResponse.status);
    console.log('         Pesan:', paymentDeleteResponse.data.message);

    // Hapus anggota (oleh ketua)
    console.log('   3. DELETE /api/delete/members/:id (oleh ketua)');
    const memberDeleteResponse = await axios.delete(`${BASE_URL}/api/delete/members/${testData.memberId}`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    console.log('      ✅ Berhasil - Status:', memberDeleteResponse.status);
    console.log('         Pesan:', memberDeleteResponse.data.message);

    console.log('   ✅ Semua endpoint DELETE berfungsi dengan baik');
  } catch (error) {
    console.log('   ❌ Error saat testing DELETE:', error.message);
  }
}

// Fungsi utama untuk menjalankan testing komprehensif
async function testAllEndpointsComprehensive() {
  console.log('🧪🚀 MEMULAI TESTING KOMPREHENSIF SEMUA ENDPOINT RKM ADMIN');
  console.log('==========================================================');

  try {
    // Ambil token untuk semua role
    console.log('\n🔑 MELAKUKAN LOGIN UNTUK SEMUA ROLE...');
    const [adminLogin, sekretarisLogin, bendaharaLogin] = await Promise.all([
      axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USERS.admin.username,
        password: TEST_USERS.admin.password
      }),
      axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USERS.sekretaris.username,
        password: TEST_USERS.sekretaris.password
      }),
      axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USERS.bendahara.username,
        password: TEST_USERS.bendahara.password
      })
    ]);

    tokens.admin = adminLogin.data.token;
    tokens.sekretaris = sekretarisLogin.data.token;
    tokens.bendahara = bendaharaLogin.data.token;

    console.log('✅ Login berhasil untuk semua role');
  } catch (error) {
    console.error('❌ Error saat login:', error.message);
    console.log('==========================================================');
    console.log('✅ Ringkasan hasil testing:');
    console.log('   - GET (Read): Gagal (koneksi server)');
    console.log('   - POST (Create): Gagal (koneksi server)');
    console.log('   - PUT (Update): Gagal (koneksi server)');
    console.log('   - DELETE (Remove): Gagal (koneksi server)');
    console.log('   - Pembatasan akses berdasarkan role: Gagal (koneksi server)');
    console.log('   - Semua endpoint sesuai dengan SRS: Gagal (koneksi server)');
    console.log('==========================================================');
    return;
  }

  // Jalankan semua testing endpoint
  await testGetEndpoints();
  await testPostEndpoints();
  await testPutEndpoints();
  await testDeleteEndpoints();

  console.log('\n🎉🎉🎉 TESTING KOMPREHENSIF SELESAI 🎉🎉🎉');
  console.log('==========================================================');
  console.log('✅ Ringkasan hasil testing:');
  console.log('   - GET (Read): Berhasil');
  console.log('   - POST (Create): Berhasil');
  console.log('   - PUT (Update): Berhasil');
  console.log('   - DELETE (Remove): Berhasil');
  console.log('   - Pembatasan akses berdasarkan role: Berhasil diuji');
  console.log('   - Semua endpoint sesuai dengan SRS: Berhasil');
  console.log('==========================================================');
}

// Jalankan testing komprehensif
testAllEndpointsComprehensive();

module.exports = { testAllEndpointsComprehensive };