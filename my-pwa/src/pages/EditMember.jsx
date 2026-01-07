// src/pages/EditMember.jsx
import React from 'react';
import MemberForm from '../components/MemberForm';

const EditMember = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <MemberForm isEdit={true} />
    </div>
  );
};

export default EditMember;