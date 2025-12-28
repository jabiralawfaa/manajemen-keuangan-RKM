// tests/getEndpoints.test.js
const { test } = require('node:test');
const { equal, ok } = require('node:assert');
const { spawn } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');

// Konfigurasi dasar
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  username: 'admin',
  password: 'password123'
};

let authToken = null;
let testServer = null;

// Fungsi untuk menunggu beberapa detik
const sleep = promisify(setTimeout);

// Setup sebelum testing
test.beforeEach(async () => {
  // Menjalankan server backend
  testServer = spawn('node', ['index.js'], {
    cwd: __dirname + '/../',
    stdio: 'pipe'
  });

  // Tunggu beberapa detik agar server siap
  await sleep(5000);

  // Login untuk mendapatkan token
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: TEST_USER.username,
      password: TEST_USER.password
    });
    
    authToken = loginResponse.data.token;
  } catch (error) {
    console.error('Error during login:', error.message);
    throw error;
  }
});

// Cleanup setelah testing
test.afterEach(() => {
  if (testServer) {
    testServer.kill();
  }
});

// Test endpoint GET untuk modul manajemen anggota
test('GET /api/members - Harus bisa mengambil daftar anggota', async () => {
  const response = await axios.get(`${BASE_URL}/api/members`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  equal(response.status, 200);
  ok(Array.isArray(response.data.members) || typeof response.data.members === 'object');
  ok(response.data.hasOwnProperty('totalPages'));
  ok(response.data.hasOwnProperty('currentPage'));
  ok(response.data.hasOwnProperty('total'));
});

// Test endpoint GET untuk detail anggota
test('GET /api/members/:id - Harus bisa mengambil detail anggota', async () => {
  // Ambil satu anggota untuk testing
  const membersResponse = await axios.get(`${BASE_URL}/api/members`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (membersResponse.data.members && membersResponse.data.members.length > 0) {
    const memberId = membersResponse.data.members[0].id;
    const response = await axios.get(`${BASE_URL}/api/members/${memberId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    equal(response.status, 200);
    ok(response.data.hasOwnProperty('id'));
    ok(response.data.hasOwnProperty('head_name'));
  }
});

// Test endpoint GET untuk modul pembayaran
test('GET /api/payments - Harus bisa mengambil daftar pembayaran', async () => {
  const response = await axios.get(`${BASE_URL}/api/payments`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  equal(response.status, 200);
  ok(Array.isArray(response.data.payments) || typeof response.data.payments === 'object');
  ok(response.data.hasOwnProperty('totalPages'));
  ok(response.data.hasOwnProperty('currentPage'));
  ok(response.data.hasOwnProperty('total'));
});

// Test endpoint GET untuk detail pembayaran
test('GET /api/payments/:id - Harus bisa mengambil detail pembayaran', async () => {
  // Ambil satu pembayaran untuk testing
  const paymentsResponse = await axios.get(`${BASE_URL}/api/payments`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
    const paymentId = paymentsResponse.data.payments[0].id;
    const response = await axios.get(`${BASE_URL}/api/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    equal(response.status, 200);
    ok(response.data.hasOwnProperty('id'));
    ok(response.data.hasOwnProperty('amount'));
  }
});

// Test endpoint GET untuk modul pengeluaran
test('GET /api/expenses - Harus bisa mengambil daftar pengeluaran', async () => {
  const response = await axios.get(`${BASE_URL}/api/expenses`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  equal(response.status, 200);
  ok(Array.isArray(response.data.expenses) || typeof response.data.expenses === 'object');
  ok(response.data.hasOwnProperty('totalPages'));
  ok(response.data.hasOwnProperty('currentPage'));
  ok(response.data.hasOwnProperty('total'));
});

// Test endpoint GET untuk detail pengeluaran
test('GET /api/expenses/:id - Harus bisa mengambil detail pengeluaran', async () => {
  // Ambil satu pengeluaran untuk testing
  const expensesResponse = await axios.get(`${BASE_URL}/api/expenses`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (expensesResponse.data.expenses && expensesResponse.data.expenses.length > 0) {
    const expenseId = expensesResponse.data.expenses[0].id;
    const response = await axios.get(`${BASE_URL}/api/expenses/${expenseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    equal(response.status, 200);
    ok(response.data.hasOwnProperty('id'));
    ok(response.data.hasOwnProperty('amount'));
  }
});

// Test endpoint GET untuk profil user
test('GET /api/auth/profile - Harus bisa mengambil profil user', async () => {
  const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  equal(response.status, 200);
  ok(response.data.hasOwnProperty('user'));
  ok(response.data.user.hasOwnProperty('id'));
  ok(response.data.user.hasOwnProperty('username'));
  ok(response.data.user.hasOwnProperty('role'));
});

console.log('Testing endpoints GET telah dibuat. Jalankan dengan perintah: node --test tests/getEndpoints.test.js');