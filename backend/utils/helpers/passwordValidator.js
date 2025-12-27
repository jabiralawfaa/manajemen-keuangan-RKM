// utils/helpers/passwordValidator.js
/**
 * Fungsi untuk memvalidasi password
 * @param {string} password - Password yang akan divalidasi
 * @returns {Object} - Hasil validasi
 */
const validatePassword = (password) => {
  const errors = [];

  // Validasi panjang password
  if (password.length < 6) {
    errors.push('Password minimal 6 karakter');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Fungsi untuk memvalidasi apakah dua password cocok
 * @param {string} password1 - Password pertama
 * @param {string} password2 - Password kedua
 * @returns {boolean} - Apakah password cocok
 */
const isPasswordMatch = (password1, password2) => {
  return password1 === password2;
};

module.exports = {
  validatePassword,
  isPasswordMatch
};