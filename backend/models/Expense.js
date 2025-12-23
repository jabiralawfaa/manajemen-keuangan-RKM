const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Tanggal pengeluaran wajib diisi']
  },
  category: {
    type: String,
    required: [true, 'Kategori pengeluaran wajib diisi'],
    enum: {
      values: ['kain_kafan', 'memandikan', 'transportasi', 'alat_tulis', 'lain_lain'],
      message: 'Kategori harus salah satu dari: kain_kafan, memandikan, transportasi, alat_tulis, lain_lain'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Jumlah pengeluaran wajib diisi'],
    min: [0, 'Jumlah pengeluaran tidak boleh negatif']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi pengeluaran wajib diisi'],
    trim: true
  },
  proofImage: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID pembuat wajib diisi']
  },
  syncStatus: {
    type: String,
    enum: {
      values: ['pending', 'synced', 'failed'],
      message: 'Status sync harus salah satu dari: pending, synced, failed'
    },
    default: 'pending'
  },
  offlineId: {
    type: String,
    default: null
  }
}, {
  timestamps: true // createdAt dan updatedAt
});

module.exports = mongoose.model('Expense', expenseSchema);