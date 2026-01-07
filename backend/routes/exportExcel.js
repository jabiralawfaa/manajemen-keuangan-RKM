// routes/exportExcel.js
const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const { pool } = require('../config/db');
const ExcelJS = require('exceljs');
const router = express.Router();

// @desc    Export members to Excel
// @route   GET /api/export/members
// @access  Private (ketua, sekretaris)
router.get('/members', auth, checkRole(['ketua', 'sekretaris']), async (req, res) => {
  try {
    const { search, status } = req.query;
    
    // Buat query untuk mengambil data anggota
    let query = 'SELECT * FROM members WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR member_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    const members = result.rows;
    
    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Anggota RKM');

    // Definisikan kolom header
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Tanggal Pendaftaran', key: 'registration_date', width: 15 },
      { header: 'Nomor Anggota', key: 'member_number', width: 15 },
      { header: 'Nama', key: 'name', width: 25 },
      { header: 'No HP', key: 'phone', width: 15 },
      { header: 'RT/RW', key: 'rt_rw', width: 10 },
      { header: 'Dusun', key: 'dusun', width: 20 },
      { header: 'Desa', key: 'desa', width: 20 },
      { header: 'Kecamatan', key: 'kecamatan', width: 20 },
      { header: 'Kabupaten', key: 'kabupaten', width: 20 },
      { header: 'Jumlah Tanggungan', key: 'dependents_count', width: 15 },
      { header: 'Status', key: 'status', width: 10 }
    ];

    // Styling header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Tambahkan data anggota ke worksheet
    members.forEach((member, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        registration_date: new Date(member.registration_date).toLocaleDateString('id-ID'),
        member_number: member.member_number,
        name: member.name,
        phone: member.phone,
        rt_rw: member.rt_rw,
        dusun: member.dusun,
        desa: member.desa,
        kecamatan: member.kecamatan,
        kabupaten: member.kabupaten,
        dependents_count: member.dependents_count,
        status: member.status
      });

      // Styling untuk jumlah uang
      const dependentsCountCell = row.getCell('dependents_count');
      dependentsCountCell.numFmt = '#,##0';

      // Styling untuk baris data
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=daftar_anggota_rkm_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    // Kirim file Excel sebagai response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error saat ekspor Excel anggota:', error);
    res.status(500).json({ message: 'Server error saat ekspor Excel' });
  }
});

// @desc    Export payments to Excel
// @route   GET /api/export/payments
// @access  Private (ketua, bendahara)
router.get('/payments', auth, checkRole(['ketua', 'bendahara']), async (req, res) => {
  try {
    const { month, year, memberId } = req.query;
    
    // Buat query untuk mengambil data pembayaran
    let query = `
      SELECT p.*, m.name, m.member_number 
      FROM payments p 
      LEFT JOIN members m ON p.member_id = m.id 
      WHERE 1=1
    `;
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
    
    if (memberId) {
      paramCount++;
      query += ` AND p.member_id = $${paramCount}`;
      params.push(parseInt(memberId));
    }
    
    query += ' ORDER BY p.payment_date DESC';
    
    const result = await pool.query(query, params);
    const payments = result.rows;
    
    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Pemasukan RKM');

    // Definisikan kolom header
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Tanggal Pembayaran', key: 'payment_date', width: 15 },
      { header: 'Nama Anggota', key: 'name', width: 25 },
      { header: 'Nomor Anggota', key: 'member_number', width: 15 },
      { header: 'Bulan', key: 'month', width: 10 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Nomor Bukti Pembayaran', key: 'receipt_number', width: 20 }
    ];

    // Styling header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Tambahkan data pembayaran ke worksheet
    payments.forEach((payment, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        payment_date: new Date(payment.payment_date).toLocaleDateString('id-ID'),
        name: payment.name,
        member_number: payment.member_number,
        month: payment.month,
        amount: parseFloat(payment.amount),
        receipt_number: payment.receipt_number
      });

      // Styling untuk jumlah uang
      const amountCell = row.getCell('amount');
      amountCell.numFmt = '#,##0.00';

      // Styling untuk baris data
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=daftar_pemasukan_rkm_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    // Kirim file Excel sebagai response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error saat ekspor Excel pembayaran:', error);
    res.status(500).json({ message: 'Server error saat ekspor Excel' });
  }
});

// @desc    Export expenses to Excel
// @route   GET /api/export/expenses
// @access  Private (ketua, bendahara)
router.get('/expenses', auth, checkRole(['ketua', 'bendahara']), async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    
    // Buat query untuk mengambil data pengeluaran
    let query = `
      SELECT e.*, u.name as created_by_name 
      FROM expenses e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE 1=1
    `;
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
    const expenses = result.rows;
    
    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Pengeluaran RKM');

    // Kategori labels
    const categoryLabels = {
      'kain_kafan': 'Kain Kafan',
      'memandikan': 'Memandikan',
      'transportasi': 'Transportasi',
      'alat_tulis': 'Alat Tulis',
      'lain_lain': 'Lain-lain'
    };

    // Definisikan kolom header
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'date', width: 15 },
      { header: 'Kategori', key: 'category', width: 15 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Deskripsi', key: 'description', width: 30 },
      { header: 'Dibuat Oleh', key: 'created_by_name', width: 20 }
    ];

    // Styling header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Tambahkan data pengeluaran ke worksheet
    expenses.forEach((expense, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        date: new Date(expense.date).toLocaleDateString('id-ID'),
        category: categoryLabels[expense.category] || expense.category,
        amount: parseFloat(expense.amount),
        description: expense.description,
        created_by_name: expense.created_by_name
      });

      // Styling untuk jumlah uang
      const amountCell = row.getCell('amount');
      amountCell.numFmt = '#,##0.00';

      // Styling untuk baris data
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=daftar_pengeluaran_rkm_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    // Kirim file Excel sebagai response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error saat ekspor Excel pengeluaran:', error);
    res.status(500).json({ message: 'Server error saat ekspor Excel' });
  }
});

module.exports = router;