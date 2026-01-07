// routes/users.js
const express = require('express');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (ketua only)
router.get('/', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const { search, role } = req.query;
    
    let query = 'SELECT id, username, role, name, phone, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (username ILIKE $${paramCount} OR name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (role) {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      users: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error saat mengambil daftar pengguna' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (ketua only)
router.get('/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        phone: user.phone,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error saat mengambil data pengguna' });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (ketua only)
router.put('/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const { username, role, name, phone } = req.body;

    // Validasi input
    if (!username || !role || !name) {
      return res.status(400).json({ message: 'Username, role, dan name wajib diisi' });
    }

    // Cek apakah user dengan ID ini ada
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Update user
    const query = `
      UPDATE users
      SET username = $1, role = $2, name = $3, phone = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, username, role, name, phone, created_at, updated_at
    `;
    const result = await pool.query(query, [username, role, name, phone, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Gagal memperbarui pengguna' });
    }

    res.json({
      message: 'Pengguna berhasil diperbarui',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error saat memperbarui pengguna' });
  }
});

// @desc    Delete user
// @route   DELETE /api/delete/users/:id
// @access  Private (ketua only)
router.delete('/delete/users/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    // Pastikan tidak menghapus akun ketua sendiri
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
    }

    // Cek apakah user dengan ID ini ada
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Hapus user
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Gagal menghapus pengguna' });
    }

    res.json({
      message: 'Pengguna berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error saat menghapus pengguna' });
  }
});

module.exports = router;