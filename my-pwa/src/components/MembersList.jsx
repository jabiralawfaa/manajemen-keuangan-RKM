// src/components/MembersList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const { user } = useAuth();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMembers();
  }, [currentPage, searchTerm, selectedStatus]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const response = await api.get('/api/members', { params });
      
      setMembers(response.data.members || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError('Gagal memuat data anggota: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      return;
    }

    try {
      await api.delete(`/api/delete/members/${id}`);
      // Refresh data setelah penghapusan
      fetchMembers();
    } catch (err) {
      alert('Gagal menghapus anggota: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateDependentsCount = async (memberId, newCount) => {
    if (newCount < 0) return; // Prevent negative counts

    try {
      // Get current member data
      const response = await api.get(`/api/members/${memberId}`);
      const currentMember = response.data;

      // Prepare update payload with correct field names
      const updatePayload = {
        registrationDate: currentMember.registration_date.split('T')[0],
        memberNumber: currentMember.member_number,
        name: currentMember.name,
        phone: currentMember.phone,
        rtRw: currentMember.rt_rw,
        dusun: currentMember.dusun,
        desa: currentMember.desa,
        kecamatan: currentMember.kecamatan,
        kabupaten: currentMember.kabupaten,
        dependentsCount: newCount,
        status: currentMember.status
      };

      // Update with new dependents count
      await api.put(`/api/members/${memberId}`, updatePayload);

      // Refresh the list to reflect the change
      fetchMembers();
    } catch (err) {
      alert('Gagal memperbarui jumlah tanggungan: ' + (err.response?.data?.message || err.message));
      console.error('Error updating dependents count:', err);
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:space-y-4 sm:space-x-4">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Daftar Anggota RKM</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Kelola data anggota Rukun Kematian Muslim
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Home
            </button>
            {(user?.role === 'ketua' || user?.role === 'sekretaris') && (
              <button
                onClick={async () => {
                  try {
                    // Download Excel file dengan otentikasi
                    const response = await api.get('/api/export/members', {
                      params: {
                        search: searchTerm || undefined,
                        status: selectedStatus !== 'all' ? selectedStatus : undefined
                      },
                      responseType: 'blob' // Important for file downloads
                    });

                    // Create a temporary link to download the file
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `daftar_anggota_rkm_${new Date().toISOString().slice(0, 10)}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error('Error downloading Excel:', error);
                    alert('Gagal mengunduh file Excel: ' + (error.response?.data?.message || error.message));
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export Excel
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari anggota..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64 sm:text-sm border-gray-300 rounded-md p-2"
          />
          
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md p-2"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
        
        {user?.role === 'ketua' || user?.role === 'sekretaris' ? (
          <button
            onClick={() => window.location.href = '/members/new'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tambah Anggota
          </button>
        ) : null}
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
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Anggota
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telepon
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alamat
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggungan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.member_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a
                      href={`https://wa.me/${member.phone.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-900 hover:underline"
                      onClick={(e) => {
                        // Format pesan WhatsApp
                        const message = `assalamualaikum wr wb, izin mengingatkan kepada ${member.name} dengan nomor anggota ${member.member_number} tanggungan RKM (Rukun Kematian Muslim) anda masih ${member.dependents_count}\nwassalamualaikum wr wb`;

                        // Encode pesan untuk URL
                        const encodedMessage = encodeURIComponent(message);

                        // Update href dengan pesan
                        e.currentTarget.href = `https://wa.me/${member.phone.replace(/^0/, '62')}?text=${encodedMessage}`;
                      }}
                    >
                      {member.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{member.rt_rw}</div>
                    <div>{member.dusun}</div>
                    <div>{member.desa}, {member.kecamatan}, {member.kabupaten}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateDependentsCount(member.id, member.dependents_count - 1)}
                        disabled={member.dependents_count <= 0}
                        className="bg-gray-200 rounded-l-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm">
                        {member.dependents_count}
                      </span>
                      <button
                        onClick={() => updateDependentsCount(member.id, member.dependents_count + 1)}
                        className="bg-gray-200 rounded-r-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.location.href = `/members/${member.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Lihat
                      </button>
                      
                      {(user?.role === 'ketua' || user?.role === 'sekretaris') && (
                        <>
                          <button
                            onClick={() => window.location.href = `/members/edit/${member.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data anggota
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> ke{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, members.length + (currentPage - 1) * itemsPerPage)}
                </span>{' '}
                dari <span className="font-medium">{members.length + (currentPage - 1) * itemsPerPage}</span> hasil
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &lt;
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="px-4 py-4 bg-gray-50 sm:px-6">
        <div className="flex justify-end">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersList;