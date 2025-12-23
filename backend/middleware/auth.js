const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Ambil token dari header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // Dapatkan user berdasarkan ID dari token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token tidak valid, user tidak ditemukan' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Middleware untuk memeriksa role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak, role tidak sesuai' });
    }
    next();
  };
};

module.exports = { auth, checkRole };