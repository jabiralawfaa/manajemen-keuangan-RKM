// src/pages/Reports.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FinancialReports from '../components/FinancialReports';

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('financial');

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Laporan Sistem RKM</h1>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Kembali ke Dashboard
          </Link>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('financial')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'financial'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Laporan Keuangan
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Laporan Anggota
            </button>
          </nav>
        </div>

        {activeTab === 'financial' && (
          <div className="mt-6">
            <FinancialReports />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Laporan Anggota</h2>
            <p className="text-gray-600">Fitur laporan anggota akan ditampilkan di sini.</p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/members" className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:bg-blue-100 transition-colors">
                <h3 className="font-medium text-blue-900">Daftar Anggota</h3>
                <p className="text-blue-700 text-sm mt-1">Lihat semua anggota RKM</p>
              </Link>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="font-medium text-green-900">Statistik Anggota</h3>
                <p className="text-green-700 text-sm mt-1">Statistik jumlah dan distribusi anggota</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h3 className="font-medium text-purple-900">Laporan Tanggungan</h3>
                <p className="text-purple-700 text-sm mt-1">Laporan jumlah tanggungan per anggota</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;