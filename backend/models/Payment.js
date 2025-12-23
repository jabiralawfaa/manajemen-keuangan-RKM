const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'ID anggota wajib diisi']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Tanggal pembayaran wajib diisi']
  },
  month: {
    type: String,
    required: [true, 'Bulan pembayaran wajib diisi'],
    match: [/^\d{4}-\d{2}$/, 'Format bulan harus YYYY-MM']
  },
  amount: {
    type: Number,
    required: [true, 'Jumlah pembayaran wajib diisi'],
    min: [0, 'Jumlah pembayaran tidak boleh negatif']
  },
  receiptNumber: {
    type: String,
    required: [true, 'Nomor bukti pembayaran wajib diisi'],
    unique: true,
    trim: true
  },
  proofImage: {
    type: String,
    default: null
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

module.exports = mongoose.model('Payment', paymentSchema);