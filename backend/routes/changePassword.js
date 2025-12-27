// routes/changePassword.js
const express = require('express');
const { auth } = require('../middleware/auth');
const PasswordService = require('../services/passwordService');
const router = express.Router();

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: 'Semua field wajib diisi: currentPassword, newPassword, confirmNewPassword'
      });
    }

    // Validasi panjang password baru
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password baru minimal 6 karakter'
      });
    }

    // Validasi konfirmasi password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: 'Password baru dan konfirmasi password tidak cocok'
      });
    }

    // Gunakan service untuk mengganti password
    const result = await PasswordService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
      confirmNewPassword
    );

    if (result.success) {
      res.json({
        message: result.message,
        user: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role,
          name: req.user.name,
          phone: req.user.phone
        }
      });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error saat mengganti password:', error);
    res.status(500).json({ message: 'Server error saat mengganti password' });
  }
});

// @desc    Reset user password (hanya untuk ketua)
// @route   PUT /api/auth/reset-password/:userId
// @access  Private (hanya ketua)
router.put('/reset-password/:userId', auth, async (req, res) => {
  try {
    // Hanya ketua yang bisa mereset password
    if (req.user.role !== 'ketua') {
      return res.status(403).json({ message: 'Hanya ketua yang bisa mereset password user lain' });
    }

    const { newPassword } = req.body;
    const { userId } = req.params;

    if (!newPassword) {
      return res.status(400).json({ message: 'Password baru wajib diisi' });
    }

    // Validasi panjang password baru
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    // Gunakan service untuk mereset password
    const result = await PasswordService.resetPassword(
      req.user.id,
      parseInt(userId),
      newPassword
    );

    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error saat mereset password:', error);
    res.status(500).json({ message: 'Server error saat mereset password' });
  }
});

module.exports = router;