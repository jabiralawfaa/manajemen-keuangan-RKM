const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Private (hanya untuk ketua)
router.post('/register', auth, async (req, res) => {
  try {
    // Hanya ketua yang bisa register user baru
    if (req.user.role !== 'ketua') {
      return res.status(403).json({ message: 'Akses ditolak, hanya ketua yang bisa menambahkan user' });
    }

    const { username, password, role, name, phone } = req.body;

    // Validasi input
    if (!username || !password || !role || !name || !phone) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah user sudah ada
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      name,
      phone
    });

    res.status(201).json({
      message: 'User berhasil dibuat',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    // Cek apakah user ada
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Buat token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', auth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      name: req.user.name,
      phone: req.user.phone
    }
  });
});

module.exports = router;