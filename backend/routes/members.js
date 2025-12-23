const express = require('express');
const Member = require('../models/Member');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all members
// @route   GET /api/members
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Buat filter berdasarkan status jika disediakan
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const members = await Member.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Member.countDocuments(filter);
    
    res.json({
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get member by ID
// @route   GET /api/members/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }
    
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new member
// @route   POST /api/members
// @access  Private (sekretaris, bendahara, ketua)
router.post('/', auth, checkRole(['sekretaris', 'ketua']), async (req, res) => {
  try {
    const {
      registrationDate,
      kkNumber,
      memberNumber,
      headName,
      wifeName,
      phone,
      address,
      beneficiaryName,
      dependentsCount
    } = req.body;

    // Validasi input
    if (!registrationDate || !kkNumber || !memberNumber || !headName || !wifeName || !phone || !address || !beneficiaryName || dependentsCount === undefined) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah nomor anggota sudah digunakan
    const existingMember = await Member.findOne({ memberNumber });
    if (existingMember) {
      return res.status(400).json({ message: 'Nomor anggota sudah digunakan' });
    }

    const member = new Member({
      registrationDate,
      kkNumber,
      memberNumber,
      headName,
      wifeName,
      phone,
      address,
      beneficiaryName,
      dependentsCount
    });

    await member.save();

    res.status(201).json({
      message: 'Anggota berhasil ditambahkan',
      member
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (sekretaris, ketua)
router.put('/:id', auth, checkRole(['sekretaris', 'ketua']), async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!member) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    res.json({
      message: 'Anggota berhasil diperbarui',
      member
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (ketua)
router.delete('/:id', auth, checkRole(['ketua']), async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    res.json({ message: 'Anggota berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;