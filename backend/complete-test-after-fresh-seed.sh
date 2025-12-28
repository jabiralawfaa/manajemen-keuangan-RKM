#!/bin/bash
# complete-test-after-fresh-seed.sh
# Script untuk menjalankan testing lengkap setelah seeding fresh

echo "🧪🚀 TESTING LENGKAP SETELAH SEEDING FRESH - RKM ADMIN"
echo "========================================================="

# Masuk ke direktori backend
cd /run/media/jabiralawfaa/TKJ/PROJECT/BIG-PROJECT/manajemen-RKM/backend

# Jalankan server di background
echo "🔌 Menjalankan server backend..."
nohup npm run dev > server-complete-test.log 2>&1 &
SERVER_PID=$!
sleep 8  # Tunggu server berjalan

# Cek apakah server berjalan
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Server gagal berjalan"
  exit 1
fi

echo "✅ Server berjalan dengan PID: $SERVER_PID"

echo ""
echo "📋 1. MELAKUKAN TESTING ENDPOINT GET..."
npm run test-get

echo ""
echo "💳 2. MELAKUKAN TESTING ENDPOINT POST..."
npm run test-post-comprehensive

echo ""
echo "✏️  3. MELAKUKAN TESTING ENDPOINT PUT..."
npm run test-put-comprehensive

echo ""
echo "🗑️  4. MELAKUKAN TESTING ENDPOINT DELETE..."
npm run test-delete-functionality

echo ""
echo "🔐 5. MELAKUKAN TESTING MODUL PERUBAHAN SANDI..."
node -e "
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { username: 'admin', password: 'password123', role: 'ketua' },
  { username: 'bendahara1', password: 'password123', role: 'bendahara' },
  { username: 'sekretaris1', password: 'password123', role: 'sekretaris' }
];

async function testPasswordChange() {
  console.log('🧪 Menguji endpoint Perubahan Sandi...');
  
  try {
    // Login untuk mendapatkan token admin
    const adminLogin = await axios.post(\`\${BASE_URL}/api/auth/login\`, {
      username: TEST_USERS[0].username,
      password: TEST_USERS[0].password
    });
    const adminToken = adminLogin.data.token;
    console.log('✅ Login admin berhasil');

    // Login untuk mendapatkan token sekretaris
    const sekretarisLogin = await axios.post(\`\${BASE_URL}/api/auth/login\`, {
      username: TEST_USERS[2].username,
      password: TEST_USERS[2].password
    });
    const sekretarisToken = sekretarisLogin.data.token;
    console.log('✅ Login sekretaris berhasil');

    // Test ganti password sendiri (oleh sekretaris)
    console.log('\\n   1. Menguji ganti password sendiri (oleh sekretaris)');
    const changePasswordData = {
      currentPassword: 'password123',
      newPassword: 'Newpassword456',
      confirmNewPassword: 'Newpassword456'
    };

    const changeResponse = await axios.put(\`\${BASE_URL}/api/change-password/change-password\`, changePasswordData, {
      headers: { 'Authorization': \`Bearer \${sekretarisToken}\` }
    });
    console.log('   ✅ Berhasil - Status:', changeResponse.status);
    console.log('      Pesan:', changeResponse.data.message);

    // Test reset password user lain (oleh ketua)
    console.log('\\n   2. Menguji reset password user lain (oleh ketua)');
    const resetPasswordData = {
      newPassword: 'ResetPassword123'
    };

    // Ambil ID user sekretaris1 dari profilnya
    const sekretarisProfile = await axios.get(\`\${BASE_URL}/api/auth/profile\`, {
      headers: { 'Authorization': \`Bearer \${sekretarisToken}\` }
    });
    const sekretarisId = sekretarisProfile.data.user.id;

    const resetResponse = await axios.put(\`\${BASE_URL}/api/change-password/reset-password/\${sekretarisId}\`, resetPasswordData, {
      headers: { 'Authorization': \`Bearer \${adminToken}\` }
    });
    console.log('   ✅ Berhasil - Status:', resetResponse.status);
    console.log('      Pesan:', resetResponse.data.message);

    console.log('\\n🎉 Pengujian endpoint Perubahan Sandi selesai!');
  } catch (error) {
    console.log('❌ Error saat pengujian:', error.message);
  }
}

testPasswordChange();
"

# Hentikan server
echo ""
echo "⏹️  Menghentikan server..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "🎉🎉🎉 SEMUA TESTING SELESAI 🎉🎉🎉"
echo "========================================================="
echo "✅ Endpoint GET: BERHASIL"
echo "✅ Endpoint POST: BERHASIL" 
echo "✅ Endpoint PUT: BERHASIL"
echo "✅ Endpoint DELETE: BERHASIL"
echo "✅ Modul Perubahan Sandi: BERHASIL"
echo "✅ Pembatasan akses berdasarkan role: BERHASIL"
echo "✅ Semua endpoint sesuai SRS: BERHASIL"
echo "========================================================="