// src/components/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const PaymentForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    memberId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    amount: '',
    receiptNumber: ''
  });
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
    if (isEdit && id) {
      fetchPayment();
    }
  }, [isEdit, id]);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/api/members');
      setMembers(response.data.members || []);
    } catch (err) {
      setError('Gagal memuat data anggota: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching members:', err);
    }
  };

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/payments/${id}`);
      const payment = response.data;
      
      setFormData({
        memberId: payment.member_id || '',
        paymentDate: payment.payment_date?.split('T')[0] || '',
        month: payment.month || '',
        amount: payment.amount || '',
        receiptNumber: payment.receipt_number || ''
      });
    } catch (err) {
      setError('Gagal memuat data pembayaran: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.memberId) {
      setError('Anggota harus dipilih');
      return false;
    }

    if (!formData.paymentDate) {
      setError('Tanggal pembayaran harus diisi');
      return false;
    }

    if (!formData.month) {
      setError('Bulan harus diisi');
      return false;
    }

    if (!formData.amount) {
      setError('Jumlah pembayaran harus diisi');
      return false;
    }

    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setError('Jumlah pembayaran harus berupa angka positif');
      return false;
    }

    return true;
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
        // Update existing payment
        const response = await api.put(`/api/payments/${id}`, {
          memberId: formData.memberId,
          paymentDate: formData.paymentDate,
          month: formData.month,
          amount: parseFloat(formData.amount),
          receiptNumber: formData.receiptNumber
        });

        alert('Pembayaran berhasil diperbarui');
      } else {
        // Create new payment
        const response = await api.post('/api/payments', {
          memberId: formData.memberId,
          paymentDate: formData.paymentDate,
          month: formData.month,
          amount: parseFloat(formData.amount),
          receiptNumber: formData.receiptNumber
        });

        alert('Pembayaran berhasil ditambahkan');
      }

      navigate('/payments');
    } catch (err) {
      setError('Gagal menyimpan data pembayaran: ' + (err.response?.data?.message || err.message));
      console.error('Error saving payment:', err);
    } finally {
      setLoading(false);
    }
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
                {isEdit ? 'Edit Pembayaran' : 'Tambah Pembayaran Baru'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {isEdit 
                  ? 'Perbarui informasi pembayaran iuran anggota RKM' 
                  : 'Tambahkan pembayaran iuran baru ke sistem RKM'}
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
                to="/payments"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Kembali
              </Link>
            </div>
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
              <div className="sm:col-span-6">
                <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
                  Anggota
                </label>
                <select
                  name="memberId"
                  id="memberId"
                  value={formData.memberId}
                  onChange={handleInputChange}
                  required
                  disabled={isEdit}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Pilih Anggota</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.member_number}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                  Tanggal Pembayaran
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  id="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                  Bulan
                </label>
                <input
                  type="month"
                  name="month"
                  id="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Jumlah Pembayaran (Rp)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  min="0"
                  step="1000"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700">
                  Nomor Bukti Pembayaran
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  id="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                to="/payments"
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

export default PaymentForm;