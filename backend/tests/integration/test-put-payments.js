// tests/test-put-payments.js
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'Newpassword123', role: 'ketua' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  { username: 'bendahara1', password: 'Newpassword456', role: 'bendahara' }
];

async function testPutPayments() {
  console.log('🧪 Menguji endpoint PUT Modul Keuangan - Pemasukan...');

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
        console.log(`✅ ID Pembayaran ditemukan: ${paymentId}, Jumlah: ${paymentOriginalData.amount}`);
      } else {
        console.log('⚠️  Tidak ada pembayaran untuk diupdate');
        return;
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID pembayaran:', error.message);
      return;
    }

    // Ambil ID anggota untuk pengujian update
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
      } else {
        console.log('⚠️  Tidak ada anggota untuk pengujian pembayaran');
        return;
      }
    } catch (error) {
      console.log('❌ Gagal mengambil ID anggota:', error.message);
      return;
    }

    // Test PUT /api/payments/:id (oleh bendahara - seharusnya berhasil)
    console.log('\n   1. Menguji PUT /api/payments/:id (oleh bendahara)');
    try {
      const updatedPayment = {
        memberId: memberId,
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
    } catch (error) {
      console.log('   ❌ PUT /api/payments/:id (oleh bendahara): Gagal -', error.response?.data?.message || error.message);
    }

    // Test PUT /api/payments/:id (oleh sekretaris - seharusnya gagal)
    console.log('\n   2. Menguji PUT /api/payments/:id (oleh sekretaris - seharusnya gagal)');
    try {
      const updatedPayment2 = {
        memberId: memberId,
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
      const updatedPayment3 = {
        memberId: memberId,
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
    } catch (error) {
      console.log('   ❌ PUT /api/payments/:id (oleh ketua): Gagal -', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Pengujian endpoint PUT Modul Keuangan - Pemasukan selesai!');
  } catch (error) {
    console.error('❌ Error saat melakukan pengujian:', error.message);
  }
}

// Jalankan pengujian
testPutPayments();

module.exports = { testPutPayments };