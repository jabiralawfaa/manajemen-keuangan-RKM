const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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

// Route dasar
app.get('/', (req, res) => {
  res.send('API RKM Admin berjalan...');
});

// Koneksi ke database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rkm_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Terhubung ke MongoDB');
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Kesalahan koneksi ke MongoDB:', error);
});