// services/passwordService.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const { validatePassword, isPasswordMatch } = require('../utils/helpers/passwordValidator');

class PasswordService {
  /**
   * Mengganti password user
   * @param {number} userId - ID user
   * @param {string} currentPassword - Password saat ini
   * @param {string} newPassword - Password baru
   * @param {string} confirmNewPassword - Konfirmasi password baru
   * @returns {Promise<Object>} - Hasil operasi
   */
  static async changePassword(userId, currentPassword, newPassword, confirmNewPassword) {
    try {
      // Validasi input
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new Error('Semua field wajib diisi: currentPassword, newPassword, confirmNewPassword');
      }

      // Validasi password baru
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Validasi konfirmasi password
      if (!isPasswordMatch(newPassword, confirmNewPassword)) {
        throw new Error('Password baru dan konfirmasi password tidak cocok');
      }

      // Ambil user dari database
      const userResult = await pool.query('SELECT id, password FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Verifikasi password saat ini
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error('Password saat ini salah');
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password di database
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

      return {
        success: true,
        message: 'Password berhasil diubah'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Mereset password user (hanya bisa dilakukan oleh ketua)
   * @param {number} adminId - ID admin (ketua)
   * @param {number} targetUserId - ID user yang akan direset passwordnya
   * @param {string} newPassword - Password baru
   * @returns {Promise<Object>} - Hasil operasi
   */
  static async resetPassword(adminId, targetUserId, newPassword) {
    try {
      // Validasi input
      if (!adminId || !targetUserId || !newPassword) {
        throw new Error('Semua field wajib diisi: adminId, targetUserId, newPassword');
      }

      // Validasi password baru
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Ambil admin dari database
      const adminResult = await pool.query('SELECT id, role FROM users WHERE id = $1', [adminId]);
      const admin = adminResult.rows[0];

      if (!admin || admin.role !== 'ketua') {
        throw new Error('Hanya ketua yang dapat mereset password user lain');
      }

      // Cek apakah user target ada
      const targetUserResult = await pool.query('SELECT id FROM users WHERE id = $1', [targetUserId]);
      const targetUser = targetUserResult.rows[0];

      if (!targetUser) {
        throw new Error('User target tidak ditemukan');
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password di database
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, targetUserId]);

      return {
        success: true,
        message: 'Password berhasil direset'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = PasswordService;