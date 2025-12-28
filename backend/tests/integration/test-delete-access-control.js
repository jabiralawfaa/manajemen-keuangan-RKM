// tests/test-delete-access-control.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = {
  admin: { username: 'admin', password: 'password123', role: 'ketua' },
  sekretaris: { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  bendahara: { username: 'bendahara1', password: 'password123', role: 'bendahara' }
};

async function testDeleteAccessControl() {
  console.log('🔐 Memulai pengujian pembatasan akses endpoint DELETE...');

  // Login untuk mendapatkan token
  let tokens = {};
  try {
    // Login admin
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS.admin.username,
      password: TEST_USERS.admin.password
    });
    tokens.admin = adminLogin.data.token;
    console.log('✅ Login admin berhasil');

    // Login sekretaris
    const sekretarisLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS.sekretaris.username,
      password: TEST_USERS.sekretaris.password
    });
    tokens.sekretaris = sekretarisLogin.data.token;
    console.log('✅ Login sekretaris berhasil');

    // Login bendahara
    const bendaharaLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS.bendahara.username,
      password: TEST_USERS.bendahara.password
    });
    tokens.bendahara = bendaharaLogin.data.token;
    console.log('✅ Login bendahara berhasil');
  } catch (error) {
    console.error('❌ Error saat login:', error.message);
    return;
  }

  // Test pembatasan akses untuk masing-masing modul
  await testMemberDeleteAccessControl(tokens);
  await testPaymentDeleteAccessControl(tokens);
  await testExpenseDeleteAccessControl(tokens);

  console.log('\n🎉 Pengujian pembatasan akses DELETE selesai!');
}

async function testMemberDeleteAccessControl(tokens) {
  console.log('\n📋 Testing pembatasan akses DELETE Modul Anggota...');

  // Buat anggota baru untuk pengujian
  let testMemberId = null;
  try {
    const newMember = {
      registrationDate: '2025-08-02',
      kkNumber: '9999888877776667',
      memberNumber: 'RKM-TEST-002',
      headName: 'Testing Access Control',
      wifeName: 'Testing Access Control Istri',
      phone: '081234567900',
      street: 'Jl. Testing Access No. 100',
      kelurahan: 'TestKelurahan2',
      kecamatan: 'TestKecamatan2',
      kabupaten: 'TestKabupaten2',
      beneficiaryName: 'Testing Access Control Beneficiary',
      dependentsCount: 3,
      status: 'active'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
      headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
    });
    testMemberId = createResponse.data.member.id;
    console.log('   ✅ Anggota baru dibuat untuk pengujian akses:', testMemberId);
  } catch (error) {
    console.log('   ❌ Gagal membuat anggota untuk pengujian akses:', error.message);
    return;
  }

  if (testMemberId) {
    // Test DELETE oleh sekretaris (seharusnya berhasil karena sekretaris bisa mengupdate anggota)
    console.log('\n   1. Menguji DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/members/${testMemberId}`, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
      });
      console.log('   ❌ DELETE oleh sekretaris: Seharusnya gagal tapi berhasil - Status:', response.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE oleh sekretaris: Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE oleh sekretaris: Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE oleh bendahara (seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/members/:id (oleh bendahara - seharusnya gagal)');
    try {
      // Buat anggota baru lagi untuk pengujian berikutnya
      const newMember2 = {
        registrationDate: '2025-08-03',
        kkNumber: '9999888877776668',
        memberNumber: 'RKM-TEST-003',
        headName: 'Testing Access Control 2',
        wifeName: 'Testing Access Control Istri 2',
        phone: '081234567901',
        street: 'Jl. Testing Access No. 101',
        kelurahan: 'TestKelurahan3',
        kecamatan: 'TestKecamatan3',
        kabupaten: 'TestKabupaten3',
        beneficiaryName: 'Testing Access Control Beneficiary 2',
        dependentsCount: 2,
        status: 'active'
      };

      const createResponse2 = await axios.post(`${BASE_URL}/api/members`, newMember2, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
      });
      const testMemberId2 = createResponse2.data.member.id;
      console.log('      Anggota baru dibuat untuk pengujian delete bendahara:', testMemberId2);

      const response2 = await axios.delete(`${BASE_URL}/api/delete/members/${testMemberId2}`, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      console.log('   ❌ DELETE oleh bendahara: Seharusnya gagal tapi berhasil - Status:', response2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE oleh bendahara: Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE oleh bendahara: Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE oleh ketua (seharusnya berhasil)
    console.log('\n   3. Menguji DELETE /api/delete/members/:id (oleh ketua - seharusnya berhasil)');
    try {
      // Buat anggota baru lagi untuk pengujian ketua
      const newMember3 = {
        registrationDate: '2025-08-04',
        kkNumber: '9999888877776669',
        memberNumber: 'RKM-TEST-004',
        headName: 'Testing Access Control 3',
        wifeName: 'Testing Access Control Istri 3',
        phone: '081234567902',
        street: 'Jl. Testing Access No. 102',
        kelurahan: 'TestKelurahan4',
        kecamatan: 'TestKecamatan4',
        kabupaten: 'TestKabupaten4',
        beneficiaryName: 'Testing Access Control Beneficiary 3',
        dependentsCount: 1,
        status: 'active'
      };

      const createResponse3 = await axios.post(`${BASE_URL}/api/members`, newMember3, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
      });
      const testMemberId3 = createResponse3.data.member.id;
      console.log('      Anggota baru dibuat untuk pengujian delete ketua:', testMemberId3);

      const response3 = await axios.delete(`${BASE_URL}/api/delete/members/${testMemberId3}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('   ✅ DELETE oleh ketua: Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
    } catch (error) {
      console.log('   ❌ DELETE oleh ketua: Gagal -', error.response?.data?.message || error.message);
    }
  }
}

async function testPaymentDeleteAccessControl(tokens) {
  console.log('\n💳 Testing pembatasan akses DELETE Modul Pembayaran...');

  // Ambil ID anggota untuk pengujian pembayaran
  let memberId = null;
  try {
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      memberId = membersResponse.data.members[0].id;
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID anggota:', error.message);
    return;
  }

  // Buat pembayaran baru untuk pengujian
  let testPaymentId = null;
  if (memberId) {
    try {
      const newPayment = {
        memberId: memberId,
        paymentDate: '2025-08-11',
        month: '2025-08',
        amount: 55000,
        receiptNumber: 'TEST-002'
      };

      const createResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      testPaymentId = createResponse.data.payment.id;
      console.log('   ✅ Pembayaran baru dibuat untuk pengujian akses:', testPaymentId);
    } catch (error) {
      console.log('   ❌ Gagal membuat pembayaran untuk pengujian akses:', error.message);
      return;
    }
  }

  if (testPaymentId) {
    // Test DELETE oleh sekretaris (seharusnya gagal)
    console.log('\n   1. Menguji DELETE /api/delete/payments/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/payments/${testPaymentId}`, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
      });
      console.log('   ❌ DELETE pembayaran oleh sekretaris: Seharusnya gagal tapi berhasil - Status:', response.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE pembayaran oleh sekretaris: Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE pembayaran oleh sekretaris: Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE oleh bendahara (seharusnya berhasil)
    console.log('\n   2. Menguji DELETE /api/delete/payments/:id (oleh bendahara - seharusnya berhasil)');
    try {
      // Buat pembayaran baru lagi untuk pengujian bendahara
      const newPayment2 = {
        memberId: memberId,
        paymentDate: '2025-08-12',
        month: '2025-08',
        amount: 60000,
        receiptNumber: 'TEST-003'
      };

      const createResponse2 = await axios.post(`${BASE_URL}/api/payments`, newPayment2, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      const testPaymentId2 = createResponse2.data.payment.id;
      console.log('      Pembayaran baru dibuat untuk pengujian delete bendahara:', testPaymentId2);

      const response2 = await axios.delete(`${BASE_URL}/api/delete/payments/${testPaymentId2}`, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      console.log('   ✅ DELETE pembayaran oleh bendahara: Berhasil - Status:', response2.status);
      console.log('      Pesan:', response2.data.message);
    } catch (error) {
      console.log('   ❌ DELETE pembayaran oleh bendahara: Gagal -', error.response?.data?.message || error.message);
    }

    // Test DELETE oleh ketua (seharusnya berhasil)
    console.log('\n   3. Menguji DELETE /api/delete/payments/:id (oleh ketua - seharusnya berhasil)');
    try {
      // Buat pembayaran baru lagi untuk pengujian ketua
      const newPayment3 = {
        memberId: memberId,
        paymentDate: '2025-08-13',
        month: '2025-08',
        amount: 65000,
        receiptNumber: 'TEST-004'
      };

      const createResponse3 = await axios.post(`${BASE_URL}/api/payments`, newPayment3, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      const testPaymentId3 = createResponse3.data.payment.id;
      console.log('      Pembayaran baru dibuat untuk pengujian delete ketua:', testPaymentId3);

      const response3 = await axios.delete(`${BASE_URL}/api/delete/payments/${testPaymentId3}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('   ✅ DELETE pembayaran oleh ketua: Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
    } catch (error) {
      console.log('   ❌ DELETE pembayaran oleh ketua: Gagal -', error.response?.data?.message || error.message);
    }
  }
}

async function testExpenseDeleteAccessControl(tokens) {
  console.log('\n💰 Testing pembatasan akses DELETE Modul Pengeluaran...');

  // Buat pengeluaran baru untuk pengujian
  let testExpenseId = null;
  try {
    const newExpense = {
      date: '2025-08-11',
      category: 'alat_tulis',
      amount: 80000,
      description: 'Testing delete access control'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, {
      headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
    });
    testExpenseId = createResponse.data.expense.id;
    console.log('   ✅ Pengeluaran baru dibuat untuk pengujian akses:', testExpenseId);
  } catch (error) {
    console.log('   ❌ Gagal membuat pengeluaran untuk pengujian akses:', error.message);
    return;
  }

  if (testExpenseId) {
    // Test DELETE oleh sekretaris (seharusnya gagal)
    console.log('\n   1. Menguji DELETE /api/delete/expenses/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/expenses/${testExpenseId}`, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` }
      });
      console.log('   ❌ DELETE pengeluaran oleh sekretaris: Seharusnya gagal tapi berhasil - Status:', response.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE pengeluaran oleh sekretaris: Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE pengeluaran oleh sekretaris: Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE oleh bendahara (seharusnya berhasil)
    console.log('\n   2. Menguji DELETE /api/delete/expenses/:id (oleh bendahara - seharusnya berhasil)');
    try {
      // Buat pengeluaran baru lagi untuk pengujian bendahara
      const newExpense2 = {
        date: '2025-08-12',
        category: 'kain_kafan',
        amount: 225000,
        description: 'Testing delete access control 2'
      };

      const createResponse2 = await axios.post(`${BASE_URL}/api/expenses`, newExpense2, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      const testExpenseId2 = createResponse2.data.expense.id;
      console.log('      Pengeluaran baru dibuat untuk pengujian delete bendahara:', testExpenseId2);

      const response2 = await axios.delete(`${BASE_URL}/api/delete/expenses/${testExpenseId2}`, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      console.log('   ✅ DELETE pengeluaran oleh bendahara: Berhasil - Status:', response2.status);
      console.log('      Pesan:', response2.data.message);
    } catch (error) {
      console.log('   ❌ DELETE pengeluaran oleh bendahara: Gagal -', error.response?.data?.message || error.message);
    }

    // Test DELETE oleh ketua (seharusnya berhasil)
    console.log('\n   3. Menguji DELETE /api/delete/expenses/:id (oleh ketua - seharusnya berhasil)');
    try {
      // Buat pengeluaran baru lagi untuk pengujian ketua
      const newExpense3 = {
        date: '2025-08-13',
        category: 'transportasi',
        amount: 175000,
        description: 'Testing delete access control 3'
      };

      const createResponse3 = await axios.post(`${BASE_URL}/api/expenses`, newExpense3, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` }
      });
      const testExpenseId3 = createResponse3.data.expense.id;
      console.log('      Pengeluaran baru dibuat untuk pengujian delete ketua:', testExpenseId3);

      const response3 = await axios.delete(`${BASE_URL}/api/delete/expenses/${testExpenseId3}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      console.log('   ✅ DELETE pengeluaran oleh ketua: Berhasil - Status:', response3.status);
      console.log('      Pesan:', response3.data.message);
    } catch (error) {
      console.log('   ❌ DELETE pengeluaran oleh ketua: Gagal -', error.response?.data?.message || error.message);
    }
  }
}

// Jalankan pengujian
testDeleteAccessControl();