# Panduan Instalasi dan Konfigurasi MongoDB

## Instalasi MongoDB

### 1. Instalasi MongoDB secara lokal

#### Ubuntu/Debian:
```bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Buat list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package
sudo apt-get update

# Instal MongoDB
sudo apt-get install -y mongodb-org

# Mulai dan aktifkan MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS:
```bash
# Gunakan Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Windows:
- Download installer dari [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Jalankan installer dan ikuti instruksi

### 2. Alternatif: Gunakan MongoDB Atlas (Cloud)

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Buat project baru
3. Buat cluster (gunakan opsi gratis)
4. Tambahkan IP Anda ke IP Access List
5. Buat database user
6. Dapatkan connection string dan ganti `<password>` dengan password Anda
7. Tambahkan connection string ke file `.env` sebagai `MONGODB_URI`

Contoh:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/rkm_db?retryWrites=true&w=majority
```

## Konfigurasi untuk Development

### File .env
Pastikan Anda memiliki file `.env` di direktori backend dengan konfigurasi berikut:

```
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rkm_db
# Atau jika menggunakan MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/rkm_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Menjalankan Aplikasi

### Backend
1. Pastikan MongoDB sudah berjalan
2. Di direktori `backend`:
   ```bash
   npm install
   npm run dev
   ```

### Frontend
1. Di direktori `frontend`:
   ```bash
   npm install
   npm run dev
   ```

## Alternatif Development Tanpa MongoDB Lokal

Jika Anda belum ingin menginstal MongoDB lokal, Anda bisa:

1. Gunakan MongoDB Atlas (rekomendasi untuk development awal)
2. Gunakan MongoDB mock untuk development awal (npm install mongodb-memory-server --save-dev)
3. Gunakan database alternatif seperti JSON file untuk development awal

## Troubleshooting

### Error: "MongoNetworkError: failed to connect"
- Pastikan MongoDB service sedang berjalan
- Cek apakah port 27017 tidak digunakan oleh aplikasi lain
- Pastikan connection string di .env benar

### Error: "EACCES: permission denied"
- Pada Linux/macOS, mungkin perlu menjalankan MongoDB dengan sudo
- Atau cek permission folder data MongoDB

### Error: "MongoServerSelectionError"
- Pastikan MongoDB benar-benar terinstall dan berjalan
- Cek firewall dan koneksi jaringan jika menggunakan MongoDB Atlas