const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Import model untuk membuat tabel
const { createUsersTable } = require('./models/User');
const { createMembersTable } = require('./models/Member');
const { createPaymentsTable } = require('./models/Payment');
const { createExpensesTable } = require('./models/Expense');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/change-password', require('./routes/changePassword'));
app.use('/api/reports', require('./routes/financialReports'));

// Routes untuk operasi DELETE
app.use('/api/delete/members', require('./routes/deleteMembers'));
app.use('/api/delete/payments', require('./routes/deletePayments'));
app.use('/api/delete/expenses', require('./routes/deleteExpenses'));

// Route dasar
app.get('/', (req, res) => {
  res.send('API RKM Admin berjalan...');
});

// Koneksi ke database, buat tabel-tabel, lalu jalankan server
connectDB().then(async () => {
  console.log('Membuat tabel-tabel database...');
  await createUsersTable();
  await createMembersTable();
  await createPaymentsTable();
  await createExpensesTable();
  console.log('Tabel-tabel berhasil dibuat');

  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}).catch((error) => {
  console.error('Gagal terhubung ke database:', error);
});