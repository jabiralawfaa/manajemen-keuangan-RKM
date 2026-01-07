// src/components/MemberForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const MemberForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    registrationDate: '',
    memberNumber: '',
    name: '',
    phone: '',
    rtRw: '',
    dusun: '',
    desa: '',
    kecamatan: '',
    kabupaten: '',
    dependentsCount: 0,
    status: 'active'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Jika edit, ambil data anggota
  useEffect(() => {
    if (isEdit && id) {
      fetchMember();
    } else if (!isEdit) {
      // Set default values for new member
      setFormData(prev => ({
        ...prev,
        registrationDate: new Date().toISOString().split('T')[0],
        memberNumber: generateMemberNumber()
      }));
    }
  }, [isEdit, id]);

  const generateMemberNumber = () => {
    const year = new Date().getFullYear();
    // Generate a random number or sequence - in real app you might fetch the next available number
    return `RKM-${year}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/members/${id}`);
      const member = response.data;
      
      setFormData({
        registrationDate: member.registration_date?.split('T')[0] || '',
        memberNumber: member.member_number || '',
        name: member.name || '',
        phone: member.phone || '',
        rtRw: member.rt_rw || '',
        dusun: member.dusun || '',
        desa: member.desa || '',
        kecamatan: member.kecamatan || '',
        kabupaten: member.kabupaten || '',
        dependentsCount: member.dependents_count || 0,
        status: member.status || 'active'
      });
    } catch (err) {
      setError('Gagal memuat data anggota: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isEdit) {
        // Update existing member
        await api.put(`/api/members/${id}`, {
          registrationDate: formData.registrationDate,
          memberNumber: formData.memberNumber,
          name: formData.name,
          phone: formData.phone,
          rtRw: formData.rtRw,
          dusun: formData.dusun,
          desa: formData.desa,
          kecamatan: formData.kecamatan,
          kabupaten: formData.kabupaten,
          dependentsCount: parseInt(formData.dependentsCount),
          status: formData.status
        });
        
        alert('Anggota berhasil diperbarui');
      } else {
        // Create new member
        await api.post('/api/members', {
          registrationDate: formData.registrationDate,
          memberNumber: formData.memberNumber,
          name: formData.name,
          phone: formData.phone,
          rtRw: formData.rtRw,
          dusun: formData.dusun,
          desa: formData.desa,
          kecamatan: formData.kecamatan,
          kabupaten: formData.kabupaten,
          dependentsCount: parseInt(formData.dependentsCount),
          status: formData.status
        });
        
        alert('Anggota berhasil ditambahkan');
      }
      
      navigate('/members');
    } catch (err) {
      setError('Gagal menyimpan data anggota: ' + (err.response?.data?.message || err.message));
      console.error('Error saving member:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.registrationDate) {
      setError('Tanggal pendaftaran harus diisi');
      return false;
    }
    
    if (!formData.memberNumber) {
      setError('Nomor anggota harus diisi');
      return false;
    }
    
    if (!formData.name) {
      setError('Nama harus diisi');
      return false;
    }
    
    if (!formData.phone) {
      setError('Nomor telepon harus diisi');
      return false;
    }
    
    if (!formData.rtRw) {
      setError('RT/RW harus diisi');
      return false;
    }
    
    if (!formData.dusun) {
      setError('Dusun harus diisi');
      return false;
    }
    
    if (!formData.desa) {
      setError('Desa harus diisi');
      return false;
    }
    
    if (!formData.kecamatan) {
      setError('Kecamatan harus diisi');
      return false;
    }
    
    if (!formData.kabupaten) {
      setError('Kabupaten harus diisi');
      return false;
    }
    
    if (isNaN(parseInt(formData.dependentsCount)) || parseInt(formData.dependentsCount) < 0) {
      setError('Jumlah tanggungan harus berupa angka positif');
      return false;
    }
    
    return true;
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {isEdit ? 'Edit Anggota' : 'Tambah Anggota Baru'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {isEdit
                  ? 'Perbarui informasi anggota Rukun Kematian Muslim'
                  : 'Tambahkan anggota baru ke sistem Rukun Kematian Muslim'}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Home
            </Link>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700">
                  Tanggal Pendaftaran
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  id="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="memberNumber" className="block text-sm font-medium text-gray-700">
                  Nomor Anggota
                </label>
                <input
                  type="text"
                  name="memberNumber"
                  id="memberNumber"
                  value={formData.memberNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  readOnly={!isEdit} // Prevent changing member number for existing members
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="rtRw" className="block text-sm font-medium text-gray-700">
                  RT/RW
                </label>
                <input
                  type="text"
                  name="rtRw"
                  id="rtRw"
                  value={formData.rtRw}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="dusun" className="block text-sm font-medium text-gray-700">
                  Dusun
                </label>
                <input
                  type="text"
                  name="dusun"
                  id="dusun"
                  value={formData.dusun}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="desa" className="block text-sm font-medium text-gray-700">
                  Desa
                </label>
                <input
                  type="text"
                  name="desa"
                  id="desa"
                  value={formData.desa}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700">
                  Kecamatan
                </label>
                <input
                  type="text"
                  name="kecamatan"
                  id="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="kabupaten" className="block text-sm font-medium text-gray-700">
                  Kabupaten/Kota
                </label>
                <input
                  type="text"
                  name="kabupaten"
                  id="kabupaten"
                  value={formData.kabupaten}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="dependentsCount" className="block text-sm font-medium text-gray-700">
                  Jumlah Tanggungan
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      dependentsCount: Math.max(0, parseInt(prev.dependentsCount) - 1)
                    }))}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependentsCount"
                    id="dependentsCount"
                    min="0"
                    value={formData.dependentsCount}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      dependentsCount: parseInt(prev.dependentsCount) + 1
                    }))}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                to="/members"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : isEdit ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;