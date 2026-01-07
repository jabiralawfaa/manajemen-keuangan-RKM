// src/pages/Finance.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Finance = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Keuangan</h1>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pemasukan Card */}
          <Link to="/payments" className="bg-blue-50 rounded-lg p-6 border border-blue-100 hover:bg-blue-100 transition-colors">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Pemasukan</h2>
            <p className="text-blue-700 mb-4">Kelola pembayaran iuran anggota RKM</p>
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Lihat Daftar Pemasukan
              </div>
            </div>
          </Link>

          {/* Pengeluaran Card */}
          <Link to="/expenses" className="bg-green-50 rounded-lg p-6 border border-green-100 hover:bg-green-100 transition-colors">
            <h2 className="text-xl font-semibold text-green-900 mb-2">Pengeluaran</h2>
            <p className="text-green-700 mb-4">Kelola pengeluaran operasional RKM</p>
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                Lihat Daftar Pengeluaran
              </div>
            </div>
          </Link>
        </div>
        
        {/* Tambah Data Buttons - hanya untuk bendahara dan ketua */}
        {(user?.role === 'ketua' || user?.role === 'bendahara') && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/payments/new" className="bg-indigo-50 rounded-lg p-6 border border-indigo-100 hover:bg-indigo-100 transition-colors">
              <h3 className="text-lg font-medium text-indigo-900 mb-2">Tambah Pemasukan Baru</h3>
              <p className="text-indigo-700">Catat pembayaran iuran dari anggota</p>
            </Link>
            
            <Link to="/expenses/new" className="bg-indigo-50 rounded-lg p-6 border border-indigo-100 hover:bg-indigo-100 transition-colors">
              <h3 className="text-lg font-medium text-indigo-900 mb-2">Tambah Pengeluaran Baru</h3>
              <p className="text-indigo-700">Catat pengeluaran operasional RKM</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;