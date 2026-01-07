// src/pages/Expenses.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ExpensesList from '../components/ExpensesList';

const Expenses = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengeluaran</h1>
          <div className="flex space-x-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Home
            </Link>
            <Link
              to="/finance"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Kembali ke Keuangan
            </Link>
          </div>
        </div>
        
        <ExpensesList />
        
        {(user?.role === 'ketua' || user?.role === 'bendahara') && (
          <div className="mt-6">
            <Link
              to="/expenses/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Tambah Pengeluaran Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;