// src/pages/AddUser.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserRegistrationForm from '../components/UserRegistrationForm';

const AddUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Jika bukan ketua, redirect ke dashboard
  if (user?.role !== 'ketua') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Pengguna Baru</h1>
        <UserRegistrationForm />
      </div>
    </div>
  );
};

export default AddUser;