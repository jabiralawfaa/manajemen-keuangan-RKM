// tests/test-post-endpoints.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

async function testPostEndpoints() {
  console.log('🧪 Memulai pengujian endpoint POST...');

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

    // 1. Test POST /api/members
    console.log('\n📋 1. Menguji endpoint: POST /api/members');
    try {
      const newMember = {
        registrationDate: '2025-03-01',
        kkNumber: '5555666677778888',
        memberNumber: 'RKM-2025-004',
        headName: 'Joko Widodo',
        wifeName: 'Iriana Joko',
        phone: '081234567898',
        street: 'Jl. Raya No. 456',
        kelurahan: 'Sukajadi',
        kecamatan: 'Sukun',
        kabupaten: 'Malang',
        beneficiaryName: 'Joko Widodo',
        dependentsCount: 3,
        status: 'active'
      };

      const membersResponse = await axios.post(`${BASE_URL}/api/members`, newMember, { headers });
      console.log('✅ POST /api/members: Berhasil - Status:', membersResponse.status);
      console.log('   Pesan:', membersResponse.data.message);
      console.log('   ID Anggota Baru:', membersResponse.data.member.id);
    } catch (error) {
      console.log('❌ POST /api/members: Gagal -', error.message);
    }

    // 2. Test POST /api/payments
    console.log('\n💳 2. Menguji endpoint: POST /api/payments');
    try {
      // Ambil ID anggota yang baru dibuat atau dari daftar
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { headers });
      let memberId = null;
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        memberId = membersResponse.data.members[0].id;
      }

      if (memberId) {
        const newPayment = {
          memberId: memberId,
          paymentDate: '2025-03-15',
          month: '2025-03',
          amount: 50000,
          receiptNumber: 'INV-005'
        };

        const paymentsResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, { headers });
        console.log('✅ POST /api/payments: Berhasil - Status:', paymentsResponse.status);
        console.log('   Pesan:', paymentsResponse.data.message);
        console.log('   ID Pembayaran Baru:', paymentsResponse.data.payment.id);
      } else {
        console.log('⚠️  Tidak ada anggota untuk membuat pembayaran');
      }
    } catch (error) {
      console.log('❌ POST /api/payments: Gagal -', error.message);
    }

    // 3. Test POST /api/expenses
    console.log('\n💰 3. Menguji endpoint: POST /api/expenses');
    try {
      const newExpense = {
        date: '2025-03-20',
        category: 'transportasi',
        amount: 200000,
        description: 'Transportasi rapat pengurus'
      };

      const expensesResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, { headers });
      console.log('✅ POST /api/expenses: Berhasil - Status:', expensesResponse.status);
      console.log('   Pesan:', expensesResponse.data.message);
      console.log('   ID Pengeluaran Baru:', expensesResponse.data.expense.id);
    } catch (error) {
      console.log('❌ POST /api/expenses: Gagal -', error.message);
    }

    // 4. Test POST /api/auth/register (hanya bisa dilakukan oleh ketua)
    console.log('\n👤 4. Menguji endpoint: POST /api/auth/register');
    try {
      const newUser = {
        username: 'pegawai_baru',
        password: 'passwordbaru123',
        role: 'sekretaris',
        name: 'Pegawai Baru',
        phone: '081234567899'
      };

      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, newUser, { headers });
      console.log('✅ POST /api/auth/register: Berhasil - Status:', registerResponse.status);
      console.log('   Pesan:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.user.id);
    } catch (error) {
      console.log('❌ POST /api/auth/register: Gagal -', error.message);
    }

    console.log('\n🎉 Pengujian endpoint POST selesai!');
    console.log('\n✅ Semua endpoint POST yang dibutuhkan berdasarkan SRS telah diuji:');
    console.log('   - Modul Manajemen Anggota (RF-MA-001)');
    console.log('   - Modul Keuangan - Pemasukan (RF-KP-001)');
    console.log('   - Modul Keuangan - Pengeluaran (RF-KG-001)');
    console.log('   - Modul Otentikasi (User Management)');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testPostEndpoints();

module.exports = { testPostEndpoints };