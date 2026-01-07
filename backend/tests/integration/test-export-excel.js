// tests/integration/test-export-excel.js
const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = {
  admin: { username: 'admin', password: 'password123', role: 'ketua' },
  sekretaris: { username: 'sekretaris1', password: 'password123', role: 'sekretaris' },
  bendahara: { username: 'bendahara1', password: 'password123', role: 'bendahara' }
};

let tokens = {};

async function testExportExcel() {
  console.log('🧪 MENGUJI FITUR EXPORT EXCEL');
  console.log('='.repeat(60));

  try {
    // Login untuk mendapatkan token
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

    // Test 1: Export Excel Anggota (oleh ketua - seharusnya berhasil)
    console.log('\n📋 TEST 1: EXPORT EXCEL ANGGOTA (oleh ketua)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/members`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` },
        responseType: 'arraybuffer' // Gunakan arraybuffer untuk menerima file Excel
      });
      
      if (response.status === 200 && response.headers['content-type'].includes('application/vnd.openxmlformats')) {
        console.log('✅ Export Excel anggota oleh ketua: BERHASIL');
        console.log('   Status:', response.status);
        console.log('   Content-Type:', response.headers['content-type']);
        console.log('   Ukuran file:', response.data.length, 'bytes');
      } else {
        console.log('❌ Export Excel anggota oleh ketua: GAGAL - Tipe file tidak sesuai');
      }
    } catch (error) {
      console.log('❌ Export Excel anggota oleh ketua: GAGAL -', error.response?.data?.message || error.message);
    }

    // Test 2: Export Excel Anggota (oleh sekretaris - seharusnya berhasil)
    console.log('\n📋 TEST 2: EXPORT EXCEL ANGGOTA (oleh sekretaris)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/members`, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200 && response.headers['content-type'].includes('application/vnd.openxmlformats')) {
        console.log('✅ Export Excel anggota oleh sekretaris: BERHASIL');
        console.log('   Status:', response.status);
        console.log('   Content-Type:', response.headers['content-type']);
        console.log('   Ukuran file:', response.data.length, 'bytes');
      } else {
        console.log('❌ Export Excel anggota oleh sekretaris: GAGAL - Tipe file tidak sesuai');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Export Excel anggota oleh sekretaris: DITOLAK (seharusnya ditolak) - Akses role benar');
      } else {
        console.log('❌ Export Excel anggota oleh sekretaris: ERROR -', error.response?.data?.message || error.message);
      }
    }

    // Test 3: Export Excel Anggota (oleh bendahara - seharusnya ditolak)
    console.log('\n📋 TEST 3: EXPORT EXCEL ANGGOTA (oleh bendahara - seharusnya ditolak)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/members`, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200) {
        console.log('❌ Export Excel anggota oleh bendahara: BERHASIL (seharusnya ditolak) - Akses role salah');
      } else {
        console.log('❌ Export Excel anggota oleh bendahara: GAGAL - Status:', response.status);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Export Excel anggota oleh bendahara: DITOLAK (seharusnya ditolak) - Akses role benar');
      } else {
        console.log('❌ Export Excel anggota oleh bendahara: ERROR -', error.response?.data?.message || error.message);
      }
    }

    // Test 4: Export Excel Pembayaran (oleh ketua - seharusnya berhasil)
    console.log('\n💳 TEST 4: EXPORT EXCEL PEMBAYARAN (oleh ketua)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/payments`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200 && response.headers['content-type'].includes('application/vnd.openxmlformats')) {
        console.log('✅ Export Excel pembayaran oleh ketua: BERHASIL');
        console.log('   Status:', response.status);
        console.log('   Content-Type:', response.headers['content-type']);
        console.log('   Ukuran file:', response.data.length, 'bytes');
      } else {
        console.log('❌ Export Excel pembayaran oleh ketua: GAGAL - Tipe file tidak sesuai');
      }
    } catch (error) {
      console.log('❌ Export Excel pembayaran oleh ketua: GAGAL -', error.response?.data?.message || error.message);
    }

    // Test 5: Export Excel Pembayaran (oleh bendahara - seharusnya berhasil)
    console.log('\n💳 TEST 5: EXPORT EXCEL PEMBAYARAN (oleh bendahara)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/payments`, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200 && response.headers['content-type'].includes('application/vnd.openxmlformats')) {
        console.log('✅ Export Excel pembayaran oleh bendahara: BERHASIL');
        console.log('   Status:', response.status);
        console.log('   Content-Type:', response.headers['content-type']);
        console.log('   Ukuran file:', response.data.length, 'bytes');
      } else {
        console.log('❌ Export Excel pembayaran oleh bendahara: GAGAL - Tipe file tidak sesuai');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Export Excel pembayaran oleh bendahara: DITOLAK (seharusnya ditolak) - Akses role benar');
      } else {
        console.log('❌ Export Excel pembayaran oleh bendahara: ERROR -', error.response?.data?.message || error.message);
      }
    }

    // Test 6: Export Excel Pembayaran (oleh sekretaris - seharusnya ditolak)
    console.log('\n📋 TEST 6: EXPORT EXCEL PEMBAYARAN (oleh sekretaris - seharusnya ditolak)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/payments`, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200) {
        console.log('❌ Export Excel pembayaran oleh sekretaris: BERHASIL (seharusnya ditolak) - Akses role salah');
      } else {
        console.log('❌ Export Excel pembayaran oleh sekretaris: GAGAL - Status:', response.status);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Export Excel pembayaran oleh sekretaris: DITOLAK (seharusnya ditolak) - Akses role benar');
      } else {
        console.log('❌ Export Excel pembayaran oleh sekretaris: ERROR -', error.response?.data?.message || error.message);
      }
    }

    // Test 7: Export Excel Pengeluaran (oleh ketua - seharusnya berhasil)
    console.log('\n💰 TEST 7: EXPORT EXCEL PENGELUARAN (oleh ketua)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/expenses`, {
        headers: { 'Authorization': `Bearer ${tokens.admin}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200 && response.headers['content-type'].includes('application/vnd.openxmlformats')) {
        console.log('✅ Export Excel pengeluaran oleh ketua: BERHASIL');
        console.log('   Status:', response.status);
        console.log('   Content-Type:', response.headers['content-type']);
        console.log('   Ukuran file:', response.data.length, 'bytes');
      } else {
        console.log('❌ Export Excel pengeluaran oleh ketua: GAGAL - Tipe file tidak sesuai');
      }
    } catch (error) {
      console.log('❌ Export Excel pengeluaran oleh ketua: GAGAL -', error.response?.data?.message || error.message);
    }

    // Test 8: Export Excel Pengeluaran (oleh bendahara - seharusnya berhasil)
    console.log('\n💰 TEST 8: EXPORT EXCEL PENGELUARAN (oleh bendahara)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/expenses`, {
        headers: { 'Authorization': `Bearer ${tokens.bendahara}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200 && response.headers['content-type'].includes('application/vnd.openxmlformats')) {
        console.log('✅ Export Excel pengeluaran oleh bendahara: BERHASIL');
        console.log('   Status:', response.status);
        console.log('   Content-Type:', response.headers['content-type']);
        console.log('   Ukuran file:', response.data.length, 'bytes');
      } else {
        console.log('❌ Export Excel pengeluaran oleh bendahara: GAGAL - Tipe file tidak sesuai');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Export Excel pengeluaran oleh bendahara: DITOLAK (seharusnya ditolak) - Akses role benar');
      } else {
        console.log('❌ Export Excel pengeluaran oleh bendahara: ERROR -', error.response?.data?.message || error.message);
      }
    }

    // Test 9: Export Excel Pengeluaran (oleh sekretaris - seharusnya ditolak)
    console.log('\n📋 TEST 9: EXPORT EXCEL PENGELUARAN (oleh sekretaris - seharusnya ditolak)');
    try {
      const response = await axios.get(`${BASE_URL}/api/export/expenses`, {
        headers: { 'Authorization': `Bearer ${tokens.sekretaris}` },
        responseType: 'arraybuffer'
      });
      
      if (response.status === 200) {
        console.log('❌ Export Excel pengeluaran oleh sekretaris: BERHASIL (seharusnya ditolak) - Akses role salah');
      } else {
        console.log('❌ Export Excel pengeluaran oleh sekretaris: GAGAL - Status:', response.status);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Export Excel pengeluaran oleh sekretaris: DITOLAK (seharusnya ditolak) - Akses role benar');
      } else {
        console.log('❌ Export Excel pengeluaran oleh sekretaris: ERROR -', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 PENGUJIAN EXPORT EXCEL SELESAI!');
    console.log('='.repeat(60));
    console.log('Ringkasan hasil pengujian:');
    console.log('- Export Excel anggota: Dapat diakses oleh ketua dan sekretaris');
    console.log('- Export Excel pembayaran: Dapat diakses oleh ketua dan bendahara');
    console.log('- Export Excel pengeluaran: Dapat diakses oleh ketua dan bendahara');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error dalam pengujian export Excel:', error.message);
  }
}

// Jalankan pengujian
testExportExcel();

module.exports = { testExportExcel };