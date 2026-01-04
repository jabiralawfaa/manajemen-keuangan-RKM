// tests/test-post-endpoints-comprehensive.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'bendahara1', password: 'Newpassword456', role: 'bendahara' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' }
];

async function testComprehensivePostEndpoints() {
  console.log('🧪 Memulai pengujian endpoint POST komprehensif...');

  // Ambil token untuk user ketua karena beberapa endpoint hanya bisa diakses oleh ketua
  let adminToken = null;
  let bendaharaToken = null;
  let sekretarisToken = null;

  try {
    // Login untuk mendapatkan token admin
    console.log('🔑 Melakukan login admin untuk mendapatkan token...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[0].username,
      password: TEST_USERS[0].password
    });
    adminToken = adminLoginResponse.data.token;
    console.log('✅ Login admin berhasil');

    // Login untuk mendapatkan token bendahara
    console.log('🔑 Melakukan login bendahara untuk mendapatkan token...');
    const bendaharaLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[1].username,
      password: TEST_USERS[1].password
    });
    bendaharaToken = bendaharaLoginResponse.data.token;
    console.log('✅ Login bendahara berhasil');

    // Login untuk mendapatkan token sekretaris
    console.log('🔑 Melakukan login sekretaris untuk mendapatkan token...');
    const sekretarisLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[2].username,
      password: TEST_USERS[2].password
    });
    sekretarisToken = sekretarisLoginResponse.data.token;
    console.log('✅ Login sekretaris berhasil');

    // 1. Test POST /api/members (hanya sekretaris dan ketua)
    console.log('\n📋 1. Menguji endpoint: POST /api/members');
    try {
      const newMember = {
        registrationDate: '2025-04-01',
        memberNumber: 'RKM-2025-005',
        name: 'Susi Susanti',
        phone: '081234567890',
        rtRw: '005/006',
        dusun: 'Dusun Badminton',
        desa: 'Sukamaju',
        kecamatan: 'Sukajaya',
        kabupaten: 'Bandung',
        dependentsCount: 2,
        status: 'active'
      };

      const membersResponse = await axios.post(`${BASE_URL}/api/members`, newMember, {
        headers: {
          'Authorization': `Bearer ${sekretarisToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ POST /api/members (oleh sekretaris): Berhasil - Status:', membersResponse.status);
      console.log('   Pesan:', membersResponse.data.message);
      console.log('   ID Anggota Baru:', membersResponse.data.member.id);
    } catch (error) {
      console.log('❌ POST /api/members: Gagal -', error.message);
    }

    // 2. Test POST /api/payments (hanya bendahara dan ketua)
    console.log('\n💳 2. Menguji endpoint: POST /api/payments');
    try {
      // Ambil ID anggota yang ada
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { 
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        } 
      });
      
      let memberId = null;
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        memberId = membersResponse.data.members[0].id;
      }

      if (memberId) {
        const newPayment = {
          memberId: memberId,
          paymentDate: '2025-04-15',
          month: '2025-04',
          amount: 55000,
          receiptNumber: 'INV-006'
        };

        const paymentsResponse = await axios.post(`${BASE_URL}/api/payments`, newPayment, { 
          headers: { 
            'Authorization': `Bearer ${bendaharaToken}`,
            'Content-Type': 'application/json'
          } 
        });
        console.log('✅ POST /api/payments (oleh bendahara): Berhasil - Status:', paymentsResponse.status);
        console.log('   Pesan:', paymentsResponse.data.message);
        console.log('   ID Pembayaran Baru:', paymentsResponse.data.payment.id);
      } else {
        console.log('⚠️  Tidak ada anggota untuk membuat pembayaran');
      }
    } catch (error) {
      console.log('❌ POST /api/payments: Gagal -', error.message);
    }

    // 3. Test POST /api/expenses (hanya bendahara dan ketua)
    console.log('\n💰 3. Menguji endpoint: POST /api/expenses');
    try {
      const newExpense = {
        date: '2025-04-20',
        category: 'alat_tulis',
        amount: 150000,
        description: 'Pembelian perlengkapan kantor'
      };

      const expensesResponse = await axios.post(`${BASE_URL}/api/expenses`, newExpense, { 
        headers: { 
          'Authorization': `Bearer ${bendaharaToken}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('✅ POST /api/expenses (oleh bendahara): Berhasil - Status:', expensesResponse.status);
      console.log('   Pesan:', expensesResponse.data.message);
      console.log('   ID Pengeluaran Baru:', expensesResponse.data.expense.id);
    } catch (error) {
      console.log('❌ POST /api/expenses: Gagal -', error.message);
    }

    // 4. Test POST /api/auth/register (hanya ketua)
    console.log('\n👤 4. Menguji endpoint: POST /api/auth/register (oleh ketua)');
    try {
      const newUser = {
        username: 'pegawai_baru2',
        password: 'passwordbaru456',
        role: 'sekretaris',
        name: 'Pegawai Baru Dua',
        phone: '081234567900'
      };

      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, newUser, { 
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('✅ POST /api/auth/register (oleh ketua): Berhasil - Status:', registerResponse.status);
      console.log('   Pesan:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.user.id);
    } catch (error) {
      console.log('❌ POST /api/auth/register: Gagal -', error.message);
    }

    // 5. Test POST /api/auth/register (oleh bukan ketua - seharusnya gagal)
    console.log('\n👤 5. Menguji endpoint: POST /api/auth/register (oleh bukan ketua - seharusnya gagal)');
    try {
      const newUser2 = {
        username: 'pegawai_baru3',
        password: 'passwordbaru789',
        role: 'bendahara',
        name: 'Pegawai Baru Tiga',
        phone: '081234567901'
      };

      const registerResponse2 = await axios.post(`${BASE_URL}/api/auth/register`, newUser2, { 
        headers: { 
          'Authorization': `Bearer ${bendaharaToken}`,
          'Content-Type': 'application/json'
        } 
      });
      console.log('❌ POST /api/auth/register (oleh bukan ketua): Seharusnya gagal tapi berhasil - Status:', registerResponse2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ POST /api/auth/register (oleh bukan ketua): Ditolak dengan benar - Status:', error.response.status);
        console.log('   Pesan:', error.response.data.message);
      } else {
        console.log('❌ POST /api/auth/register (oleh bukan ketua): Error tak terduga -', error.message);
      }
    }

    // 6. Test POST /api/members (oleh bukan sekretaris/ketua - seharusnya gagal)
    console.log('\n📋 6. Menguji endpoint: POST /api/members (oleh bukan sekretaris/ketua - seharusnya gagal)');
    try {
      const newMember2 = {
        registrationDate: '2025-05-01',
        memberNumber: 'RKM-2025-006',
        name: 'Budi Setiawan',
        phone: '081234567902',
        rtRw: '006/007',
        dusun: 'Dusun Mawar',
        desa: 'Sukamulya',
        kecamatan: 'Sukaresik',
        kabupaten: 'Garut',
        dependentsCount: 4,
        status: 'active'
      };

      const membersResponse2 = await axios.post(`${BASE_URL}/api/members`, newMember2, {
        headers: {
          'Authorization': `Bearer ${bendaharaToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ POST /api/members (oleh bukan sekretaris/ketua): Seharusnya gagal tapi berhasil - Status:', membersResponse2.status);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ POST /api/members (oleh bukan sekretaris/ketua): Ditolak dengan benar - Status:', error.response.status);
        console.log('   Pesan:', error.response.data.message);
      } else {
        console.log('❌ POST /api/members (oleh bukan sekretaris/ketua): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    // 7. Test POST /api/payments (oleh bukan bendahara/ketua - seharusnya gagal)
    console.log('\n💳 7. Menguji endpoint: POST /api/payments (oleh bukan bendahara/ketua - seharusnya gagal)');
    try {
      // Ambil ID anggota yang ada
      const membersResponse = await axios.get(`${BASE_URL}/api/members`, { 
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        } 
      });
      
      let memberId = null;
      if (membersResponse.data.members && membersResponse.data.members.length > 0) {
        memberId = membersResponse.data.members[0].id;
      }

      if (memberId) {
        const newPayment2 = {
          memberId: memberId,
          paymentDate: '2025-05-15',
          month: '2025-05',
          amount: 60000,
          receiptNumber: 'INV-007'
        };

        const paymentsResponse2 = await axios.post(`${BASE_URL}/api/payments`, newPayment2, { 
          headers: { 
            'Authorization': `Bearer ${sekretarisToken}`,
            'Content-Type': 'application/json'
          } 
        });
        console.log('❌ POST /api/payments (oleh bukan bendahara/ketua): Seharusnya gagal tapi berhasil - Status:', paymentsResponse2.status);
      } else {
        console.log('⚠️  Tidak ada anggota untuk membuat pembayaran');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ POST /api/payments (oleh bukan bendahara/ketua): Ditolak dengan benar - Status:', error.response.status);
        console.log('   Pesan:', error.response.data.message);
      } else {
        console.log('❌ POST /api/payments (oleh bukan bendahara/ketua): Error tak terduga -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Pengujian endpoint POST komprehensif selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testComprehensivePostEndpoints();

module.exports = { testComprehensivePostEndpoints };