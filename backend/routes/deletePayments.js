// routes/deletePayments.js
const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Delete payment
// @route   DELETE /api/delete/payments/:id
// @access  Private (bendahara, ketua)
router.delete('/:id', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Cek apakah pembayaran ada
    const paymentResult = await pool.query('SELECT id FROM payments WHERE id = $1', [paymentId]);
    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    // Hapus pembayaran
    await pool.query('DELETE FROM payments WHERE id = $1', [paymentId]);

    res.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus pembayaran:', error.message);
    res.status(500).json({ message: 'Server error saat menghapus pembayaran' });
  }
});

module.exports = router;