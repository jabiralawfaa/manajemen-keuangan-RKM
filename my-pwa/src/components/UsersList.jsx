// src/components/UsersList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (selectedRole !== 'all') {
        params.role = selectedRole;
      }
      
      const response = await api.get('/api/users', { params });
      setUsers(response.data.users || []);
    } catch (err) {
      setError('Gagal memuat daftar pengguna: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Jika bukan ketua, tampilkan pesan akses ditolak
  if (user?.role !== 'ketua') {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-red-900">Akses Ditolak</h3>
          <p className="mt-2 text-sm text-red-600">
            Anda tidak memiliki akses ke fitur manajemen pengguna. Hanya ketua yang dapat mengakses fitur ini.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }

    try {
      await api.delete(`/api/delete/users/${userId}`);
      // Refresh daftar setelah penghapusan
      fetchUsers();
    } catch (err) {
      setError('Gagal menghapus pengguna: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Daftar Pengguna RKM</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Kelola akun pengguna sistem Rukun Kematian Muslim
        </p>
      </div>
      
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchUsers();
            }}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64 sm:text-sm border-gray-300 rounded-md p-2"
          />

          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              fetchUsers();
            }}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md p-2"
          >
            <option value="all">Semua Role</option>
            <option value="ketua">Ketua</option>
            <option value="bendahara">Bendahara</option>
            <option value="sekretaris">Sekretaris</option>
          </select>
        </div>
        
        <button
          onClick={() => window.location.href = '/users/new'}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Tambah Pengguna
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telepon
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((userItem, index) => (
                <tr key={userItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {userItem.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userItem.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      userItem.role === 'ketua' ? 'bg-purple-100 text-purple-800' :
                      userItem.role === 'bendahara' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userItem.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.location.href = `/users/${userItem.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => window.location.href = `/users/edit/${userItem.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(userItem.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data pengguna
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;