// src/pages/Users.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UsersList from '../components/UsersList';

const Users = () => {
  const { user } = useAuth();

  // Jika bukan ketua, tampilkan pesan akses ditolak
  if (user?.role !== 'ketua') {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-red-900">Akses Ditolak</h3>
          <p className="mt-2 text-sm text-red-600">
            Anda tidak memiliki akses ke fitur manajemen pengguna. Hanya ketua yang dapat mengakses fitur ini.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Pengguna</h1>
        <UsersList />
      </div>
    </div>
  );
};

export default Users;