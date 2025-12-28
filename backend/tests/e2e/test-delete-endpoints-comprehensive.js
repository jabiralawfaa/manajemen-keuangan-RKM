// tests/test-delete-endpoints-comprehensive.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

async function testComprehensiveDeleteEndpoints() {
  console.log('🗑️  Memulai pengujian endpoint DELETE komprehensif...');

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

    // Test endpoint DELETE untuk masing-masing modul
    await testDeleteMembersEndpoint(tokens);
    await testDeletePaymentsEndpoint(tokens);
    await testDeleteExpensesEndpoint(tokens);

    console.log('\n🎉 Pengujian endpoint DELETE komprehensif selesai!');
    console.log('\n✅ Semua endpoint DELETE yang dibutuhkan berdasarkan SRS telah diuji:');
    console.log('   - Modul Manajemen Anggota (RF-MA-001)');
    console.log('   - Modul Keuangan - Pemasukan (RF-KP-001)');
    console.log('   - Modul Keuangan - Pengeluaran (RF-KG-001)');
    console.log('   - Pembatasan akses berdasarkan role telah diuji');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

async function testDeleteMembersEndpoint(tokens) {
  console.log('\n📋 Menguji endpoint DELETE Modul Manajemen Anggota...');

  // Buat anggota baru untuk pengujian delete
  let newMemberId = null;
  try {
    const newMember = {
      registrationDate: '2025-08-01',
      kkNumber: '9999888877776666',
      memberNumber: 'RKM-2025-005',
      headName: 'Testing Delete Anggota',
      wifeName: 'Testing Delete Istri',
      phone: '081234567905',
      street: 'Jl. Testing Delete No. 105',
      kelurahan: 'TestingKelurahan',
      kecamatan: 'TestingKecamatan',
      kabupaten: 'TestingKabupaten',
      beneficiaryName: 'Testing Delete Beneficiary',
      dependentsCount: 1,
      status: 'active'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/members`, newMember, { 
      headers: { 
        'Authorization': `Bearer ${tokens.sekretaris}`,
        'Content-Type': 'application/json'
      } 
    });
    newMemberId = createResponse.data.member.id;
    console.log('   ➕ Anggota baru dibuat untuk pengujian delete:', newMemberId);
  } catch (error) {
    console.log('   ❌ Gagal membuat anggota baru untuk pengujian delete:', error.response?.data?.message || error.message);
    return;
  }

  if (newMemberId) {
    // Test DELETE /api/delete/members/:id (oleh ketua - seharusnya berhasil)
    console.log('\n   1. Menguji DELETE /api/delete/members/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/members/${newMemberId}`, {
        headers: {
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ✅ DELETE /api/delete/members/:id (oleh ketua): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ DELETE /api/delete/members/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Buat anggota baru lagi untuk pengujian berikutnya
    let newMemberId2 = null;
    try {
      const newMember2 = {
        registrationDate: '2025-08-02',
        kkNumber: '8888777766665555',
        memberNumber: 'RKM-2025-006',
        headName: 'Testing Delete Anggota 2',
        wifeName: 'Testing Delete Istri 2',
        phone: '081234567906',
        street: 'Jl. Testing Delete No. 106',
        kelurahan: 'TestingKelurahan2',
        kecamatan: 'TestingKecamatan2',
        kabupaten: 'TestingKabupaten2',
        beneficiaryName: 'Testing Delete Beneficiary 2',
        dependentsCount: 2,
        status: 'active'
      };

      const createResponse2 = await axios.post(`${BASE_URL}/api/members`, newMember2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      newMemberId2 = createResponse2.data.member.id;
      console.log('   ➕ Anggota baru dibuat untuk pengujian delete berikutnya:', newMemberId2);
    } catch (error) {
      console.log('   ❌ Gagal membuat anggota baru untuk pengujian delete:', error.response?.data?.message || error.message);
    }

    // Test DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/members/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const response2 = await axios.delete(`${BASE_URL}/api/delete/members/${newMemberId2}`, {
        headers: {
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('   ❌ DELETE /api/delete/members/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE /api/delete/members/:id (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE /api/delete/members/:id (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE /api/delete/members/:id (oleh bendahara - seharusnya gagal)
    console.log('\n   3. Menguji DELETE /api/delete/members/:id (oleh bendahara - seharusnya gagal)');
    let newMemberId3 = null;
    try {
      const newMember3 = {
        registrationDate: '2025-08-03',
        kkNumber: '7777666655554444',
        memberNumber: 'RKM-2025-007',
        headName: 'Testing Delete Anggota 3',
        wifeName: 'Testing Delete Istri 3',
        phone: '081234567907',
        street: 'Jl. Testing Delete No. 107',
        kelurahan: 'TestingKelurahan3',
        kecamatan: 'TestingKecamatan3',
        kabupaten: 'TestingKabupaten3',
        beneficiaryName: 'Testing Delete Beneficiary 3',
        dependentsCount: 3,
        status: 'active'
      };

      const createResponse3 = await axios.post(`${BASE_URL}/api/members`, newMember3, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      newMemberId3 = createResponse3.data.member.id;
      console.log('   ➕ Anggota baru dibuat untuk pengujian delete bendahara:', newMemberId3);

      const response3 = await axios.delete(`${BASE_URL}/api/delete/members/${newMemberId3}`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ DELETE /api/delete/members/:id (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response3.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE /api/delete/members/:id (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE /api/delete/members/:id (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }
  } else {
    console.log('   ⚠️  Tidak ada anggota untuk diuji delete');
  }
}

async function testDeletePaymentsEndpoint(tokens) {
  console.log('\n💳 Menguji endpoint DELETE Modul Keuangan - Pemasukan...');

  // Ambil ID anggota untuk pengujian pembayaran
  let memberId = null;
  try {
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, { 
      headers: { 
        'Authorization': `Bearer ${tokens.admin}`,
        'Content-Type': 'application/json'
      } 
    });
    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      memberId = membersResponse.data.members[0].id;
    }
  } catch (error) {
    console.log('   ⚠️  Gagal mengambil ID anggota:', error.message);
  }

  // Buat pembayaran baru untuk pengujian delete
  let newPaymentId = null;
  if (memberId) {
    try {
      const newPayment = {
        memberId: memberId,
        paymentDate: '2025-08-15',
        month: '2025-08',
        amount: 50000,
        receiptNumber: 'INV-005'
      };

      const createResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      newPaymentId = createResponse.data.payment.id;
      console.log('   ➕ Pembayaran baru dibuat untuk pengujian delete:', newPaymentId);
    } catch (error) {
      console.log('   ❌ Gagal membuat pembayaran baru untuk pengujian delete:', error.response?.data?.message || error.message);
      return;
    }
  }

  if (newPaymentId) {
    // Test DELETE /api/delete/payments/:id (oleh ketua - seharusnya berhasil)
    console.log('\n   1. Menguji DELETE /api/delete/payments/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/payments/${newPaymentId}`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ DELETE /api/delete/payments/:id (oleh ketua): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ DELETE /api/delete/payments/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Buat pembayaran baru lagi untuk pengujian berikutnya
    let newPaymentId2 = null;
    if (memberId) {
      try {
        const newPayment2 = {
          memberId: memberId,
          paymentDate: '2025-08-16',
          month: '2025-08',
          amount: 55000,
          receiptNumber: 'INV-006'
        };

        const createResponse2 = await axios.post(`${BASE_URL}/api/payments`, newPayment2, { 
          headers: { 
            'Authorization': `Bearer ${tokens.bendahara}`,
            'Content-Type': 'application/json'
          } 
        });
        newPaymentId2 = createResponse2.data.payment.id;
        console.log('   ➕ Pembayaran baru dibuat untuk pengujian delete berikutnya:', newPaymentId2);
      } catch (error) {
        console.log('   ❌ Gagal membuat pembayaran baru untuk pengujian delete:', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE /api/delete/payments/:id (oleh bendahara - seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/payments/:id (oleh bendahara - seharusnya gagal)');
    try {
      const response2 = await axios.delete(`${BASE_URL}/api/delete/payments/${newPaymentId2}`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ DELETE /api/delete/payments/:id (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE /api/delete/payments/:id (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE /api/delete/payments/:id (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE /api/delete/payments/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   3. Menguji DELETE /api/delete/payments/:id (oleh sekretaris - seharusnya gagal)');
    let newPaymentId3 = null;
    if (memberId) {
      try {
        const newPayment3 = {
          memberId: memberId,
          paymentDate: '2025-08-17',
          month: '2025-08',
          amount: 60000,
          receiptNumber: 'INV-007'
        };

        const createResponse3 = await axios.post(`${BASE_URL}/api/payments`, newPayment3, { 
          headers: { 
            'Authorization': `Bearer ${tokens.bendahara}`,
            'Content-Type': 'application/json'
          } 
        });
        newPaymentId3 = createResponse3.data.payment.id;
        console.log('   ➕ Pembayaran baru dibuat untuk pengujian delete sekretaris:', newPaymentId3);

        const response3 = await axios.delete(`${BASE_URL}/api/delete/payments/${newPaymentId3}`, { 
          headers: { 
            'Authorization': `Bearer ${tokens.sekretaris}`,
            'Content-Type': 'application/json'
          } 
        });
        console.log('   ❌ DELETE /api/delete/payments/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response3.status);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log('   ✅ DELETE /api/delete/payments/:id (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
          console.log('      Pesan:', error.response.data.message);
        } else {
          console.log('   ❌ DELETE /api/delete/payments/:id (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
        }
      }
    }
  } else {
    console.log('   ⚠️  Tidak ada pembayaran untuk diuji delete');
  }
}

async function testDeleteExpensesEndpoint(tokens) {
  console.log('\n💰 Menguji endpoint DELETE Modul Keuangan - Pengeluaran...');

  // Buat pengeluaran baru untuk pengujian delete
  let newExpenseId = null;
  try {
    const newExpense = {
      date: '2025-08-20',
      category: 'transportasi',
      amount: 150000,
      description: 'Testing delete expense'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, { 
      headers: { 
        'Authorization': `Bearer ${tokens.bendahara}`,
        'Content-Type': 'application/json'
      } 
    });
    newExpenseId = createResponse.data.expense.id;
    console.log('   ➕ Pengeluaran baru dibuat untuk pengujian delete:', newExpenseId);
  } catch (error) {
    console.log('   ❌ Gagal membuat pengeluaran baru untuk pengujian delete:', error.response?.data?.message || error.message);
    return;
  }

  if (newExpenseId) {
    // Test DELETE /api/delete/expenses/:id (oleh ketua - seharusnya berhasil)
    console.log('\n   1. Menguji DELETE /api/delete/expenses/:id (oleh ketua)');
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/expenses/${newExpenseId}`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ✅ DELETE /api/delete/expenses/:id (oleh ketua): Berhasil - Status:', response.status);
      console.log('      Pesan:', response.data.message);
    } catch (error) {
      console.log('   ❌ DELETE /api/delete/expenses/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    // Buat pengeluaran baru lagi untuk pengujian berikutnya
    let newExpenseId2 = null;
    try {
      const newExpense2 = {
        date: '2025-08-21',
        category: 'alat_tulis',
        amount: 75000,
        description: 'Testing delete expense 2'
      };

      const createResponse2 = await axios.post(`${BASE_URL}/api/expenses`, newExpense2, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      newExpenseId2 = createResponse2.data.expense.id;
      console.log('   ➕ Pengeluaran baru dibuat untuk pengujian delete berikutnya:', newExpenseId2);
    } catch (error) {
      console.log('   ❌ Gagal membuat pengeluaran baru untuk pengujian delete:', error.response?.data?.message || error.message);
    }

    // Test DELETE /api/delete/expenses/:id (oleh bendahara - seharusnya gagal)
    console.log('\n   2. Menguji DELETE /api/delete/expenses/:id (oleh bendahara - seharusnya gagal)');
    try {
      const response2 = await axios.delete(`${BASE_URL}/api/delete/expenses/${newExpenseId2}`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ DELETE /api/delete/expenses/:id (oleh bendahara): Seharusnya gagal tapi berhasil - Status:', response2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE /api/delete/expenses/:id (oleh bendahara): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE /api/delete/expenses/:id (oleh bendahara): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // Test DELETE /api/delete/expenses/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   3. Menguji DELETE /api/delete/expenses/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const newExpense3 = {
        date: '2025-08-22',
        category: 'kain_kafan',
        amount: 200000,
        description: 'Testing delete expense 3'
      };

      const createResponse3 = await axios.post(`${BASE_URL}/api/expenses`, newExpense3, { 
        headers: { 
          'Authorization': `Bearer ${tokens.bendahara}`,
          'Content-Type': 'application/json'
        } 
      });
      const newExpenseId3 = createResponse3.data.expense.id;
      console.log('   ➕ Pengeluaran baru dibuat untuk pengujian delete sekretaris:', newExpenseId3);

      const response3 = await axios.delete(`${BASE_URL}/api/delete/expenses/${newExpenseId3}`, { 
        headers: { 
          'Authorization': `Bearer ${tokens.sekretaris}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('   ❌ DELETE /api/delete/expenses/:id (oleh sekretaris): Seharusnya gagal tapi berhasil - Status:', response3.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('   ✅ DELETE /api/delete/expenses/:id (oleh sekretaris): Ditolak dengan benar - Status:', error.response.status);
        console.log('      Pesan:', error.response.data.message);
      } else {
        console.log('   ❌ DELETE /api/delete/expenses/:id (oleh sekretaris): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }
  } else {
    console.log('   ⚠️  Tidak ada pengeluaran untuk diuji delete');
  }
}

// Jalankan pengujian
testComprehensiveDeleteEndpoints();

module.exports = { testComprehensiveDeleteEndpoints };