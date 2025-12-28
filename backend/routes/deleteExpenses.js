// routes/deleteExpenses.js
const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Delete expense
// @route   DELETE /api/delete/expenses/:id
// @access  Private (bendahara, ketua)
router.delete('/:id', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Cek apakah pengeluaran ada
    const expenseResult = await pool.query('SELECT id FROM expenses WHERE id = $1', [expenseId]);
    if (expenseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
    }

    // Hapus pengeluaran
    await pool.query('DELETE FROM expenses WHERE id = $1', [expenseId]);

    res.json({ message: 'Pengeluaran berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus pengeluaran:', error.message);
    res.status(500).json({ message: 'Server error saat menghapus pengeluaran' });
  }
});

module.exports = router;