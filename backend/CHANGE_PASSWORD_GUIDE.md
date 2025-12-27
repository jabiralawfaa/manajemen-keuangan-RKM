# Sistem Perubahan Sandi (Change Password) untuk RKM Admin

## Endpoint API

### 1. Mengganti Password Sendiri
- **URL**: `/api/change-password/change-password`
- **Method**: `PUT`
- **Authentication**: Diperlukan (token JWT)
- **Role**: Semua role

#### Request Body:
```json
{
  "currentPassword": "password_lama",
  "newPassword": "password_baru",
  "confirmNewPassword": "konfirmasi_password_baru"
}
```

#### Validasi:
- Semua field wajib diisi
- Password baru minimal 6 karakter
- Password baru dan konfirmasi harus cocok
- Password saat ini harus benar

#### Response Sukses:
```json
{
  "message": "Password berhasil diubah",
  "user": {
    "id": 2,
    "username": "bendahara1",
    "role": "bendahara",
    "name": "Ahmad Hidayat",
    "phone": "081234567894"
  }
}
```

#### Response Error:
```json
{
  "message": "Error message"
}
```

### 2. Mereset Password User Lain (Hanya Ketua)
- **URL**: `/api/change-password/reset-password/:userId`
- **Method**: `PUT`
- **Authentication**: Diperlukan (token JWT)
- **Role**: Hanya ketua

#### Path Parameter:
- `userId`: ID user yang akan direset passwordnya

#### Request Body:
```json
{
  "newPassword": "password_baru"
}
```

#### Validasi:
- Hanya ketua yang bisa mengakses endpoint ini
- Password baru minimal 6 karakter
- User target harus ada

#### Response Sukses:
```json
{
  "message": "Password berhasil direset"
}
```

#### Response Error:
```json
{
  "message": "Error message"
}
```

## Implementasi Teknis

### 1. File-file yang Dibuat
- `routes/changePassword.js` - Route untuk perubahan password
- `services/passwordService.js` - Service untuk logika perubahan password
- `utils/helpers/passwordValidator.js` - Helper untuk validasi password

### 2. Fitur Utama
- Perubahan password sendiri dengan verifikasi password lama
- Reset password user lain oleh ketua
- Validasi password (minimal 6 karakter)
- Konfirmasi password untuk mencegah kesalahan ketik
- Hash password menggunakan bcrypt

### 3. Validasi Password
Saat ini sistem hanya memvalidasi:
- Minimal 6 karakter
- Konfirmasi password harus cocok
- Password lama harus benar (untuk perubahan sendiri)

## Contoh Penggunaan

### Mengganti Password Sendiri
```bash
curl -X PUT http://localhost:5000/api/change-password/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456",
    "confirmNewPassword": "newpassword456"
  }'
```

### Mereset Password User Lain (oleh Ketua)
```bash
curl -X PUT http://localhost:5000/api/change-password/reset-password/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer KETUA_JWT_TOKEN" \
  -d '{
    "newPassword": "resetpassword789"
  }'
```

## Security Measures
- Password di-hash menggunakan bcrypt
- Akses terbatas berdasarkan role
- Validasi input yang ketat
- Verifikasi password lama sebelum mengganti

## Catatan
- Sistem ini memastikan bahwa hanya pengguna yang sah dapat mengganti password mereka sendiri
- Hanya ketua yang memiliki wewenang untuk mereset password user lain
- Semua perubahan password dilakukan secara aman dengan hashing