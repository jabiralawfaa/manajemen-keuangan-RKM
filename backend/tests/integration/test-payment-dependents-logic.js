// tests/integration/test-payment-dependents-logic.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' }
];

let tokens = {};
let testData = {
  memberId: null,
  initialDependentsCount: null
};

async function testPaymentDependentsLogic() {
  console.log('🧪 Menguji logika pengurangan tanggungan berdasarkan pembayaran kelipatan 20.000');
  console.log('='.repeat(70));

  try {
    // Login untuk mendapatkan token
    console.log('\n🔑 Melakukan login admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USERS[0].username,
      password: TEST_USERS[0].password
    });
    tokens.admin = loginResponse.data.token;
    console.log('✅ Login admin berhasil');

    // Ambil anggota pertama untuk pengujian
    console.log('\n👥 Mengambil data anggota untuk pengujian...');
    const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
      headers: { 'Authorization': `Bearer ${tokens.admin}` }
    });

    if (membersResponse.data.members && membersResponse.data.members.length > 0) {
      testData.memberId = membersResponse.data.members[0].id;
      testData.initialDependentsCount = membersResponse.data.members[0].dependents_count;
      console.log(`✅ Anggota ditemukan: ${membersResponse.data.members[0].name}`);
      console.log(`   Tanggungan awal: ${testData.initialDependentsCount}`);
    } else {
      console.log('❌ Tidak ada anggota untuk diuji');
      return;
    }

    // Test 1: Pembayaran kelipatan 20.000 (seharusnya mengurangi tanggungan)
    console.log('\n📋 Test 1: Pembayaran kelipatan 20.000 (Rp 40.000) - seharusnya mengurangi tanggungan sebanyak 2');
    try {
      const paymentData = {
        memberId: testData.memberId,
        paymentDate: new Date().toISOString().split('T')[0],
        month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        amount: 40000, // Ini adalah kelipatan 20.000 (2x)
        receiptNumber: `TEST-${Date.now()}`
      };

      const paymentResponse = await axios.post(`${BASE_URL}/api/payments`, paymentData, {
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Pembayaran berhasil dibuat:', paymentResponse.data.message);
      
      // Ambil data anggota setelah pembayaran untuk melihat perubahan tanggungan
      const updatedMemberResponse = await axios.get(`${BASE_URL}/api/members/${testData.memberId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      
      const expectedDependents = Math.max(0, testData.initialDependentsCount - 2); // 2 karena 40000/20000 = 2
      const actualDependents = updatedMemberResponse.data.dependents_count;
      
      console.log(`   Tanggungan sebelum: ${testData.initialDependentsCount}`);
      console.log(`   Tanggungan sesudah: ${actualDependents}`);
      console.log(`   Pengurangan yang diharapkan: 2`);
      
      if (actualDependents === expectedDependents) {
        console.log('✅ Test 1 BERHASIL: Tanggungan berkurang sesuai dengan kelipatan 20.000');
      } else {
        console.log(`❌ Test 1 GAGAL: Tanggungan seharusnya ${expectedDependents} tapi sekarang ${actualDependents}`);
      }
    } catch (error) {
      console.log('❌ Test 1 GAGAL:', error.response?.data?.message || error.message);
    }

    // Test 2: Pembayaran bukan kelipatan 20.000 (seharusnya tidak mengurangi tanggungan)
    console.log('\n📋 Test 2: Pembayaran bukan kelipatan 20.000 (Rp 25.000) - seharusnya tidak mengurangi tanggungan');
    try {
      const paymentData2 = {
        memberId: testData.memberId,
        paymentDate: new Date().toISOString().split('T')[0],
        month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        amount: 25000, // Bukan kelipatan 20.000
        receiptNumber: `TEST-${Date.now()}2`
      };

      const paymentResponse2 = await axios.post(`${BASE_URL}/api/payments`, paymentData2, {
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Pembayaran kedua berhasil dibuat:', paymentResponse2.data.message);
      
      // Ambil data anggota setelah pembayaran kedua
      const updatedMemberResponse2 = await axios.get(`${BASE_URL}/api/members/${testData.memberId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      
      const expectedDependents2 = Math.max(0, testData.initialDependentsCount - 2); // Tetap sama karena 25000 bukan kelipatan 20.000
      const actualDependents2 = updatedMemberResponse2.data.dependents_count;

      console.log(`   Tanggungan setelah pembayaran kedua: ${actualDependents2}`);
      console.log(`   Pengurangan yang diharapkan: 0 (tidak ada perubahan dari sebelumnya)`);

      if (actualDependents2 === expectedDependents2) {
        console.log('✅ Test 2 BERHASIL: Tanggungan tidak berubah karena pembayaran bukan kelipatan 20.000');
      } else {
        console.log(`❌ Test 2 GAGAL: Tanggungan seharusnya ${expectedDependents2} tapi sekarang ${actualDependents2}`);
      }
    } catch (error) {
      console.log('❌ Test 2 GAGAL:', error.response?.data?.message || error.message);
    }

    // Test 3: Pembayaran kelipatan 20.000 dengan jumlah besar
    console.log('\n📋 Test 3: Pembayaran kelipatan 20.000 dengan jumlah besar (Rp 100.000) - seharusnya mengurangi tanggungan sebanyak 5');
    try {
      const paymentData3 = {
        memberId: testData.memberId,
        paymentDate: new Date().toISOString().split('T')[0],
        month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        amount: 100000, // Ini adalah kelipatan 20.000 (5x)
        receiptNumber: `TEST-${Date.now()}3`
      };

      const paymentResponse3 = await axios.post(`${BASE_URL}/api/payments`, paymentData3, {
        headers: { 
          'Authorization': `Bearer ${tokens.admin}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Pembayaran ketiga berhasil dibuat:', paymentResponse3.data.message);
      
      // Ambil data anggota setelah pembayaran ketiga
      const updatedMemberResponse3 = await axios.get(`${BASE_URL}/api/members/${testData.memberId}`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` }
      });
      
      const expectedDependents3 = Math.max(0, testData.initialDependentsCount - 2 - 5); // 2 dari test 1, 5 dari test 3 (test 2 tidak mengurangi apapun)
      const actualDependents3 = updatedMemberResponse3.data.dependents_count;

      console.log(`   Tanggungan setelah pembayaran ketiga: ${actualDependents3}`);
      console.log(`   Pengurangan total yang diharapkan: 7 (2+5)`);

      if (actualDependents3 === expectedDependents3) {
        console.log('✅ Test 3 BERHASIL: Tanggungan berkurang sesuai dengan kelipatan 20.000');
      } else {
        console.log(`❌ Test 3 GAGAL: Tanggungan seharusnya ${expectedDependents3} tapi sekarang ${actualDependents3}`);
      }
    } catch (error) {
      console.log('❌ Test 3 GAGAL:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Pengujian logika pengurangan tanggungan selesai!');
    console.log('='.repeat(70));
  } catch (error) {
    console.error('❌ Error dalam pengujian:', error.message);
  }
}

// Jalankan pengujian
testPaymentDependentsLogic();

module.exports = { testPaymentDependentsLogic };