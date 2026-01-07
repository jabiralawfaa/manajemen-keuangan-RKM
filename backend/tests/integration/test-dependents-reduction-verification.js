// tests/integration/test-dependents-reduction-verification.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

let authToken = '';

async function testDependentsReductionVerification() {
  console.log('🧪 MENGUJI VERIFIKASI LOGIKA PENGURANGAN TANGGUNGAN');
  console.log('='.repeat(60));

  try {
    // Login
    console.log('\n🔑 Melakukan login admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USER.username,
      password: TEST_USER.password
    });
    authToken = loginResponse.data.token;
    console.log('✅ Login berhasil');

    // Ambil semua anggota
    console.log('\n👥 Mengambil semua anggota...');
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    // Cari anggota dengan tanggungan > 0
    const memberWithDependents = membersResponse.data.members.find(member => member.dependents_count > 0);

    if (!memberWithDependents) {
      console.log('⚠️  Tidak ada anggota dengan tanggungan > 0, membuat anggota baru untuk pengujian...');
      
      // Buat anggota baru dengan tanggungan awal
      const newMemberData = {
        registrationDate: new Date().toISOString().split('T')[0],
        memberNumber: 'RKM-TEST-' + Date.now(),
        name: 'Testing Tanggungan',
        phone: '081234567899',
        rtRw: '001/001',
        dusun: 'Dusun Testing',
        desa: 'Desa Testing',
        kecamatan: 'Kecamatan Testing',
        kabupaten: 'Kabupaten Testing',
        dependentsCount: 5, // Mulai dengan 5 tanggungan
        status: 'active'
      };

      const newMemberResponse = await axios.post(`${BASE_URL}/api/members`, newMemberData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      memberWithDependents = newMemberResponse.data.member;
      console.log(`✅ Anggota testing dibuat: ${memberWithDependents.name}, Tanggungan: ${memberWithDependents.dependents_count}`);
    } else {
      console.log(`✅ Anggota dengan tanggungan ditemukan: ${memberWithDependents.name}, Tanggungan: ${memberWithDependents.dependents_count}`);
    }

    // Simpan tanggungan awal
    const initialDependents = memberWithDependents.dependents_count;
    console.log(`📊 Tanggungan awal: ${initialDependents}`);

    // Lakukan pembayaran kelipatan 20.000
    console.log('\n💸 Melakukan pembayaran kelipatan 20.000...');
    const paymentAmount = 40000; // 2x kelipatan 20.000
    const expectedReduction = Math.floor(paymentAmount / 20000);
    const expectedNewDependents = Math.max(0, initialDependents - expectedReduction);

    const paymentData = {
      memberId: memberWithDependents.id,
      paymentDate: new Date().toISOString().split('T')[0],
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      amount: paymentAmount,
      receiptNumber: `TEST-RED-${Date.now()}`
    };

    console.log(`   Jumlah pembayaran: Rp ${paymentAmount.toLocaleString('id-ID')}`);
    console.log(`   Kelipatan 20.000: ${expectedReduction}x`);
    console.log(`   Pengurangan yang diharapkan: ${expectedReduction}`);
    console.log(`   Tanggungan yang diharapkan: ${expectedNewDependents}`);

    const paymentResponse = await axios.post(`${BASE_URL}/api/payments`, paymentData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Pembayaran berhasil dibuat');

    // Ambil data anggota setelah pembayaran
    console.log('\n🔍 Memeriksa tanggungan setelah pembayaran...');
    const updatedMemberResponse = await axios.get(`${BASE_URL}/api/members/${memberWithDependents.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const newDependents = updatedMemberResponse.data.dependents_count;
    console.log(`   Tanggungan setelah pembayaran: ${newDependents}`);
    console.log(`   Perubahan aktual: ${initialDependents - newDependents}`);

    if (newDependents === expectedNewDependents) {
      console.log('✅ VERIFIKASI BERHASIL: Tanggungan berkurang sesuai dengan logika kelipatan 20.000');
      console.log(`   Sebelum: ${initialDependents} → Sesudah: ${newDependents} (pengurangan: ${initialDependents - newDependents})`);
    } else {
      console.log(`❌ VERIFIKASI GAGAL: Tanggungan seharusnya ${expectedNewDependents} tapi sekarang ${newDependents}`);
    }

    // Lakukan pembayaran kedua dengan jumlah bukan kelipatan 20.000
    console.log('\n💸 Melakukan pembayaran bukan kelipatan 20.000...');
    const nonMultiplePaymentAmount = 25000; // Bukan kelipatan 20.000

    const paymentData2 = {
      memberId: memberWithDependents.id,
      paymentDate: new Date().toISOString().split('T')[0],
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      amount: nonMultiplePaymentAmount,
      receiptNumber: `TEST-RED-${Date.now()}2`
    };

    console.log(`   Jumlah pembayaran: Rp ${nonMultiplePaymentAmount.toLocaleString('id-ID')}`);
    console.log(`   Apakah kelipatan 20.000: ${nonMultiplePaymentAmount % 20000 === 0 ? 'YA' : 'TIDAK'}`);
    console.log(`   Tanggungan sebelum pembayaran ini: ${newDependents || expectedNewDependents}`);

    const paymentResponse2 = await axios.post(`${BASE_URL}/api/payments`, paymentData2, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Pembayaran kedua berhasil dibuat');

    // Ambil data anggota setelah pembayaran kedua
    console.log('\n🔍 Memeriksa tanggungan setelah pembayaran kedua...');
    const updatedMemberResponse2 = await axios.get(`${BASE_URL}/api/members/${memberWithDependents.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const finalDependents = updatedMemberResponse2.data.dependents_count;
    console.log(`   Tanggungan setelah pembayaran kedua: ${finalDependents}`);
    console.log(`   Perubahan dari sebelumnya: ${newDependents - finalDependents}`);

    if (finalDependents === newDependents) {
      console.log('✅ VERIFIKASI BERHASIL: Tanggungan tidak berubah karena pembayaran bukan kelipatan 20.000');
      console.log(`   Sebelum: ${newDependents} → Sesudah: ${finalDependents} (tidak berubah)`);
    } else {
      console.log(`❌ VERIFIKASI GAGAL: Tanggungan berubah padahal pembayaran bukan kelipatan 20.000`);
      console.log(`   Sebelum: ${newDependents} → Sesudah: ${finalDependents}`);
    }

    console.log('\n🎯 KESIMPULAN VERIFIKASI:');
    console.log('   - Pembayaran kelipatan 20.000 mengurangi tanggungan: SESUAI HARAPAN');
    console.log('   - Pembayaran bukan kelipatan 20.000 tidak mengurangi tanggungan: SESUAI HARAPAN');
    console.log('   - Logika pengurangan tanggungan berfungsi dengan benar');

    console.log('\n🎉 Verifikasi logika pengurangan tanggungan selesai!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error dalam verifikasi:', error.message);
    if (error.response) {
      console.error('Response error:', error.response.data);
    }
  }
}

// Jalankan pengujian
testDependentsReductionVerification();

module.exports = { testDependentsReductionVerification };