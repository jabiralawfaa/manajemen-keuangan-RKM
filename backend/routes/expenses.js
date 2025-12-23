const express = require('express');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    
    // Buat filter berdasarkan kategori dan rentang tanggal jika disediakan
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    const expenses = await Expense.find(filter)
      .populate('createdBy', 'name username role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });
    
    const total = await Expense.countDocuments(filter);
    
    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('createdBy', 'name username role');
    
    if (!expense) {
      return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private (bendahara, ketua)
router.post('/', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const {
      date,
      category,
      amount,
      description
    } = req.body;

    // Validasi input
    if (!date || !category || !amount || !description) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const expense = new Expense({
      date,
      category,
      amount,
      description,
      createdBy: req.user._id // Set createdBy ke user yang sedang login
    });

    await expense.save();

    res.status(201).json({
      message: 'Pengeluaran berhasil ditambahkan',
      expense: await expense.populate('createdBy', 'name username role')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private (bendahara, ketua)
router.put('/:id', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name username role');

    if (!expense) {
      return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
    }

    res.json({
      message: 'Pengeluaran berhasil diperbarui',
      expense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (ketua)
router.delete('/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
    }

    res.json({ message: 'Pengeluaran berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;