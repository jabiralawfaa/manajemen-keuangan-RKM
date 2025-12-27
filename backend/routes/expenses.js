const express = require('express');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Buat query berdasarkan kategori dan rentang tanggal jika disediakan
    let query = 'SELECT e.*, u.name as created_by_name FROM expenses e LEFT JOIN users u ON e.created_by = u.id WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND e.category = $${paramCount}`;
      params.push(category);
    }

    if (startDate) {
      paramCount++;
      query += ` AND e.date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND e.date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` ORDER BY e.date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const expensesResult = await pool.query(query, params);

    // Hitung total pengeluaran
    let countQuery = 'SELECT COUNT(*) as total FROM expenses e LEFT JOIN users u ON e.created_by = u.id WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND e.category = $${countParamCount}`;
      countParams.push(category);
    }

    if (startDate) {
      countParamCount++;
      countQuery += ` AND e.date >= $${countParamCount}`;
      countParams.push(startDate);
    }

    if (endDate) {
      countParamCount++;
      countQuery += ` AND e.date <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      expenses: expensesResult.rows,
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
    const expense = await Expense.findById(req.params.id);

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

    const expense = await Expense.create({
      date,
      category,
      amount,
      description,
      createdBy: req.user.id, // Set createdBy ke user yang sedang login
      syncStatus: 'synced' // Default status saat dibuat
    });

    res.status(201).json({
      message: 'Pengeluaran berhasil ditambahkan',
      expense
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
    const {
      date,
      category,
      amount,
      description,
      syncStatus
    } = req.body;

    const expense = await Expense.update(
      req.params.id,
      {
        date,
        category,
        amount,
        description,
        syncStatus
      }
    );

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
    const expense = await Expense.remove(req.params.id);

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