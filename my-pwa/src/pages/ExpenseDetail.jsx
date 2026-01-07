// src/pages/ExpenseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/api/expenses/${id}`);
      setExpense(response.data);
    } catch (err) {
      setError('Gagal memuat detail pengeluaran: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
      return;
    }

    try {
      await api.delete(`/api/delete/expenses/${id}`);
      alert('Pengeluaran berhasil dihapus');
      navigate('/expenses');
    } catch (err) {
      setError('Gagal menghapus pengeluaran: ' + (err.response?.data?.message || err.message));
    }
  };

  // Category labels
  const categoryLabels = {
    'kain_kafan': 'Kain Kafan',
    'memandikan': 'Memandikan',
    'transportasi': 'Transportasi',
    'alat_tulis': 'Alat Tulis',
    'lain_lain': 'Lain-lain'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-red-800">Error</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-red-600">{error}</p>
          <Link
            to="/expenses"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Kembali ke Daftar Pengeluaran
          </Link>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Pengeluaran Tidak Ditemukan</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p>Pengeluaran dengan ID {id} tidak ditemukan.</p>
          <Link
            to="/expenses"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Kembali ke Daftar Pengeluaran
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Detail Pengeluaran</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Informasi lengkap tentang pengeluaran Rukun Kematian Muslim
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Home
              </Link>
              <Link
                to="/finance"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
              >
                Keuangan
              </Link>
              {(user?.role === 'ketua' || user?.role === 'bendahara') && (
                <>
                  <Link
                    to={`/expenses/edit/${id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </>
              )}
              <Link
                to="/expenses"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tanggal</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(expense.date).toLocaleDateString('id-ID')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Kategori</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {categoryLabels[expense.category] || expense.category}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Jumlah</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(expense.amount)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {expense.description || '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dibuat oleh</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {expense.created_by_user?.name || expense.created_by || '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dibuat pada</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(expense.created_at).toLocaleString('id-ID')}
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="px-4 py-4 bg-gray-50 sm:px-6">
          <div className="flex justify-end space-x-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Home
            </Link>
            {(user?.role === 'ketua' || user?.role === 'bendahara') && (
              <>
                <Link
                  to={`/expenses/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </button>
              </>
            )}
            <Link
              to="/expenses"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Kembali ke Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;