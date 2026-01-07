// routes/financialReports.js
const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const router = express.Router();

// @desc    Get financial summary report
// @route   GET /api/reports/summary
// @access  Private (bendahara, ketua)
router.get('/summary', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Query untuk mendapatkan ringkasan keuangan
    let query = `
      SELECT 
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE 1=1`;
    
    if (startDate) {
      query += ` AND payment_date >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND payment_date <= '${endDate}'`;
    }
    query += `) AS total_income,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE 1=1`;
    
    if (startDate) {
      query += ` AND date >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND date <= '${endDate}'`;
    }
    query += `) AS total_expenses,
      (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE 1=1`;
    
    if (startDate) {
      query += ` AND payment_date >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND payment_date <= '${endDate}'`;
    }
    query += `) - (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE 1=1`;
    
    if (startDate) {
      query += ` AND date >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND date <= '${endDate}'`;
    }
    query += `) AS net_balance`;

    const result = await pool.query(query);
    
    res.json({
      startDate: startDate || 'awal',
      endDate: endDate || 'sekarang',
      summary: result.rows[0]
    });
  } catch (error) {
    console.error('Error saat mengambil laporan ringkasan keuangan:', error);
    res.status(500).json({ message: 'Server error saat mengambil laporan ringkasan keuangan' });
  }
});

// @desc    Get income report by month/year
// @route   GET /api/reports/income
// @access  Private (bendahara, ketua)
router.get('/income', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = 'SELECT p.*, m.name, m.member_number FROM payments p LEFT JOIN members m ON p.member_id = m.id WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (month) {
      paramCount++;
      query += ` AND p.month = $${paramCount}`;
      params.push(month);
    }
    
    if (year) {
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM p.payment_date) = $${paramCount}`;
      params.push(parseInt(year));
    }

    query += ' ORDER BY p.payment_date DESC';

    const result = await pool.query(query, params);
    
    res.json({
      period: `${year || 'all'}-${month || 'all'}`,
      totalIncome: result.rows.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
      payments: result.rows
    });
  } catch (error) {
    console.error('Error saat mengambil laporan pemasukan:', error);
    res.status(500).json({ message: 'Server error saat mengambil laporan pemasukan' });
  }
});

// @desc    Get expense report by category
// @route   GET /api/reports/expenses
// @access  Private (bendahara, ketua)
router.get('/expenses', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

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

    query += ' ORDER BY e.date DESC';

    const result = await pool.query(query, params);
    
    res.json({
      category: category || 'all',
      totalExpenses: result.rows.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0),
      expenses: result.rows
    });
  } catch (error) {
    console.error('Error saat mengambil laporan pengeluaran:', error);
    res.status(500).json({ message: 'Server error saat mengambil laporan pengeluaran' });
  }
});

// @desc    Get income vs expense comparison
// @route   GET /api/reports/comparison
// @access  Private (bendahara, ketua)
router.get('/comparison', auth, checkRole(['bendahara', 'ketua']), async (req, res) => {
  try {
    const { month, year } = req.query;

    // Query untuk mendapatkan perbandingan pemasukan dan pengeluaran
    let incomeQuery = 'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE 1=1';
    let expenseQuery = 'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE 1=1';
    
    const params = [];
    let paramCount = 0;

    if (month) {
      paramCount++;
      incomeQuery += ` AND month = $${paramCount}`;
      expenseQuery += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
      params.push(month);
    }
    
    if (year) {
      paramCount++;
      incomeQuery += ` AND EXTRACT(YEAR FROM payment_date) = $${paramCount}`;
      expenseQuery += ` AND EXTRACT(YEAR FROM date) = $${paramCount}`;
      params.push(parseInt(year));
    }

    const incomeResult = await pool.query(incomeQuery, params);
    const expenseResult = await pool.query(expenseQuery, params);

    res.json({
      period: `${year || 'all'}-${month || 'all'}`,
      totalIncome: parseFloat(incomeResult.rows[0].total),
      totalExpenses: parseFloat(expenseResult.rows[0].total),
      netBalance: parseFloat(incomeResult.rows[0].total) - parseFloat(expenseResult.rows[0].total)
    });
  } catch (error) {
    console.error('Error saat mengambil perbandingan keuangan:', error);
    res.status(500).json({ message: 'Server error saat mengambil perbandingan keuangan' });
  }
});

module.exports = router;