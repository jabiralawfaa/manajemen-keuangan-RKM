// routes/deleteMembers.js
const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Delete member
// @route   DELETE /api/delete/members/:id
// @access  Private (ketua)
router.delete('/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const memberId = req.params.id;

    // Cek apakah anggota ada
    const memberResult = await pool.query('SELECT id FROM members WHERE id = $1', [memberId]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    // Hapus anggota
    await pool.query('DELETE FROM members WHERE id = $1', [memberId]);

    res.json({ message: 'Anggota berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus anggota:', error.message);
    res.status(500).json({ message: 'Server error saat menghapus anggota' });
  }
});

module.exports = router;