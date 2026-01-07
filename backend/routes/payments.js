const express = require('express');
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, month, memberId } = req.query;
    const offset = (page - 1) * limit;

    // Buat filter berdasarkan bulan dan memberId jika disediakan
    let query = 'SELECT p.*, m.name, m.member_number FROM payments p LEFT JOIN members m ON p.member_id = m.id WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (month) {
      paramCount++;
      query += ` AND p.month = $${paramCount}`;
      params.push(month);
    }

    if (memberId) {
      paramCount++;
      query += ` AND p.member_id = $${paramCount}`;
      params.push(memberId);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const paymentsResult = await pool.query(query, params);

    // Hitung total pembayaran
    let countQuery = 'SELECT COUNT(*) as total FROM payments p LEFT JOIN members m ON p.member_id = m.id WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (month) {
      countParamCount++;
      countQuery += ` AND p.month = $${countParamCount}`;
      countParams.push(month);
    }

    if (memberId) {
      countParamCount++;
      countQuery += ` AND p.member_id = $${countParamCount}`;
      countParams.push(memberId);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      payments: paymentsResult.rows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private (bendahara, ketua)
router.post('/', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const {
      memberId,
      paymentDate,
      month,
      amount,
      receiptNumber
    } = req.body;

    // Validasi input
    if (!memberId || !paymentDate || !month || !amount || !receiptNumber) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah anggota ada
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    // Cek apakah nomor bukti pembayaran sudah digunakan
    const checkQuery = 'SELECT * FROM payments WHERE receipt_number = $1';
    const checkResult = await pool.query(checkQuery, [receiptNumber]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Nomor bukti pembayaran sudah digunakan' });
    }

    const payment = await Payment.create({
      memberId,
      paymentDate,
      month,
      amount,
      receiptNumber,
      syncStatus: 'synced' // Default status saat dibuat
    });

    // Cek apakah jumlah pembayaran merupakan kelipatan 20000
    const amountValue = parseFloat(amount);
    if (amountValue % 20000 === 0) {
      const multiple = Math.floor(amountValue / 20000);

      // Kurangi tanggungan anggota sebanyak kelipatan 20000
      const newDependentsCount = Math.max(0, member.dependents_count - multiple);

      // Update jumlah tanggungan anggota
      await pool.query(
        'UPDATE members SET dependents_count = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newDependentsCount, memberId]
      );
    }

    res.status(201).json({
      message: 'Pembayaran berhasil ditambahkan',
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private (bendahara, ketua)
router.put('/:id', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const {
      memberId,
      paymentDate,
      month,
      amount,
      receiptNumber,
      syncStatus
    } = req.body;

    const payment = await Payment.update(
      req.params.id,
      {
        memberId,
        paymentDate,
        month,
        amount,
        receiptNumber,
        syncStatus
      }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    res.json({
      message: 'Pembayaran berhasil diperbarui',
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (ketua)
router.delete('/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const payment = await Payment.remove(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    res.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;