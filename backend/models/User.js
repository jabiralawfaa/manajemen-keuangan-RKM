const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true,
    minlength: [3, 'Username minimal 3 karakter'],
    maxlength: [30, 'Username maksimal 30 karakter']
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  role: {
    type: String,
    required: [true, 'Role wajib diisi'],
    enum: {
      values: ['ketua', 'bendahara', 'sekretaris'],
      message: 'Role harus salah satu dari: ketua, bendahara, sekretaris'
    }
  },
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Nomor HP wajib diisi'],
    match: [/^\d{10,13}$/, 'Format nomor HP tidak valid']
  },
  syncToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true // createdAt dan updatedAt
});

module.exports = mongoose.model('User', userSchema);