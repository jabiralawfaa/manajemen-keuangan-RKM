const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  registrationDate: {
    type: Date,
    required: [true, 'Tanggal daftar wajib diisi']
  },
  kkNumber: {
    type: String,
    required: [true, 'Nomor KK wajib diisi'],
    trim: true
  },
  memberNumber: {
    type: String,
    required: [true, 'Nomor anggota wajib diisi'],
    unique: true,
    trim: true
  },
  headName: {
    type: String,
    required: [true, 'Nama Kepala Keluarga wajib diisi'],
    trim: true
  },
  wifeName: {
    type: String,
    required: [true, 'Nama Istri wajib diisi'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Nomor HP wajib diisi'],
    match: [/^\d{10,13}$/, 'Format nomor HP tidak valid']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Alamat jalan wajib diisi'],
      trim: true
    },
    kelurahan: {
      type: String,
      required: [true, 'Kelurahan wajib diisi'],
      trim: true
    },
    kecamatan: {
      type: String,
      required: [true, 'Kecamatan wajib diisi'],
      trim: true
    },
    kabupaten: {
      type: String,
      required: [true, 'Kabupaten wajib diisi'],
      trim: true
    }
  },
  beneficiaryName: {
    type: String,
    required: [true, 'Nama tertanggung wajib diisi'],
    trim: true
  },
  dependentsCount: {
    type: Number,
    required: [true, 'Jumlah tanggungan wajib diisi'],
    min: [0, 'Jumlah tanggungan tidak boleh negatif']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: 'Status harus salah satu dari: active, inactive'
    },
    default: 'active'
  }
}, {
  timestamps: true // createdAt dan updatedAt
});

module.exports = mongoose.model('Member', memberSchema);