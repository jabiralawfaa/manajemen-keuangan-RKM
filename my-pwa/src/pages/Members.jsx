// src/pages/Members.jsx
import React from 'react';
import MembersList from '../components/MembersList';

const Members = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Anggota</h1>
        <MembersList />
      </div>
    </div>
  );
};

export default Members;