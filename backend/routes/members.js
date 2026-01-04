const express = require('express');
const Member = require('../models/Member');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all members
// @route   GET /api/members
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * limit;

    // Buat filter berdasarkan status dan search jika disediakan
    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (search) {
      filters.search = search;
    }

    const members = await Member.findByFilters(filters, parseInt(limit), parseInt(offset), sortBy, sortOrder);
    const total = await Member.countByFilters(filters);

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

// @desc    Get members with detailed filters
// @route   GET /api/members/search
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      registrationDateFrom,
      registrationDateTo
    } = req.query;

    const offset = (page - 1) * limit;

    // Buat filter berdasarkan semua parameter yang tersedia
    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (search) {
      filters.search = search;
    }
    if (registrationDateFrom) {
      filters.registrationDateFrom = registrationDateFrom;
    }
    if (registrationDateTo) {
      filters.registrationDateTo = registrationDateTo;
    }

    const members = await Member.findByFiltersWithDates(filters, parseInt(limit), parseInt(offset), sortBy, sortOrder);
    const total = await Member.countByFiltersWithDates(filters);

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
// @access  Private (sekretaris, ketua)
router.post('/', auth, checkRole(['sekretaris', 'ketua']), async (req, res) => {
  try {
    const {
      registrationDate,
      memberNumber,
      name,
      phone,
      rtRw,
      dusun,
      desa,
      kecamatan,
      kabupaten,
      dependentsCount,
      status = 'active'
    } = req.body;

    // Validasi input
    if (!registrationDate || !memberNumber || !name || !phone || !rtRw || !dusun || !desa || !kecamatan || !kabupaten || dependentsCount === undefined) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah nomor anggota sudah digunakan
    const existingMember = await Member.findByMemberNumber(memberNumber);
    if (existingMember) {
      return res.status(400).json({ message: 'Nomor anggota sudah digunakan' });
    }

    const member = await Member.create({
      registrationDate,
      memberNumber,
      name,
      phone,
      rtRw,
      dusun,
      desa,
      kecamatan,
      kabupaten,
      dependentsCount,
      status
    });

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
    const {
      registrationDate,
      memberNumber,
      name,
      phone,
      rtRw,
      dusun,
      desa,
      kecamatan,
      kabupaten,
      dependentsCount,
      status
    } = req.body;

    const member = await Member.update(
      req.params.id,
      {
        registrationDate,
        memberNumber,
        name,
        phone,
        rtRw,
        dusun,
        desa,
        kecamatan,
        kabupaten,
        dependentsCount,
        status
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
    const member = await Member.remove(req.params.id);

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