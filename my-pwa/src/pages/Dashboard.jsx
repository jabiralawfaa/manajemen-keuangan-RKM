// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard RKM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Selamat datang, <span className="font-medium">{user?.name || user?.username}</span> ({user?.role})
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sistem Administrasi RKM</h2>
              <p className="text-gray-600 mb-6">
                Selamat datang di sistem administrasi Rukun Kematian Muslim. Gunakan menu navigasi untuk mengakses berbagai fitur.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Menu Cards */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Manajemen Anggota</h3>
                  <p className="text-blue-700">Kelola data anggota RKM</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                  <h3 className="text-lg font-medium text-green-900 mb-2">Keuangan</h3>
                  <p className="text-green-700">Pencatatan pemasukan dan pengeluaran</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-medium text-purple-900 mb-2">Laporan</h3>
                  <p className="text-purple-700">Laporan keuangan dan administrasi</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <h4 className="text-lg font-medium text-yellow-900 mb-2">Informasi Pengguna</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                  <div><span className="font-medium">Username:</span> {user?.username}</div>
                  <div><span className="font-medium">Role:</span> {user?.role}</div>
                  <div><span className="font-medium">Nama:</span> {user?.name}</div>
                  <div><span className="font-medium">Telepon:</span> {user?.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;