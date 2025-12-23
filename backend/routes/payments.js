const express = require('express');
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, month, memberId } = req.query;
    
    // Buat filter berdasarkan bulan dan memberId jika disediakan
    const filter = {};
    if (month) {
      filter.month = month;
    }
    if (memberId) {
      filter.memberId = memberId;
    }
    
    const payments = await Payment.find(filter)
      .populate('memberId', 'headName kkNumber memberNumber')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ paymentDate: -1 });
    
    const total = await Payment.countDocuments(filter);
    
    res.json({
      payments,
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
    const payment = await Payment.findById(req.params.id).populate('memberId', 'headName kkNumber memberNumber');
    
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
    const existingPayment = await Payment.findOne({ receiptNumber });
    if (existingPayment) {
      return res.status(400).json({ message: 'Nomor bukti pembayaran sudah digunakan' });
    }

    const payment = new Payment({
      memberId,
      paymentDate,
      month,
      amount,
      receiptNumber
    });

    await payment.save();

    // Update status anggota jika diperlukan
    // (logika bisa ditambahkan sesuai kebutuhan)

    res.status(201).json({
      message: 'Pembayaran berhasil ditambahkan',
      payment: await payment.populate('memberId', 'headName kkNumber memberNumber')
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
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('memberId', 'headName kkNumber memberNumber');

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
    const payment = await Payment.findByIdAndDelete(req.params.id);

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