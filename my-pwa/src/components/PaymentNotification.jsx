// src/components/PaymentNotification.jsx
import React, { useState, useEffect } from 'react';

const PaymentNotification = ({ payment, member }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // Cek apakah pembayaran ini menyebabkan pengurangan tanggungan
    if (payment && member) {
      checkForDependencyReduction();
    }
  }, [payment, member]);

  const checkForDependencyReduction = () => {
    // Di sini seharusnya ada logika dari backend
    // Untuk simulasi, saya akan buat versi sederhana
    // Dalam implementasi nyata, ini akan dikirim dari backend
    
    // Misalnya, jika backend mengirimkan informasi bahwa tanggungan berkurang
    if (payment?.dependency_reduction) {
      setNotificationMessage(
        `Pembayaran ini menyebabkan pengurangan tanggungan sebanyak ${payment.dependency_reduction} karena total pembayaran mencapai kelipatan Rp 20.000.`
      );
      setShowNotification(true);
      
      // Sembunyikan notifikasi setelah 10 detik
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Pengurangan Tanggungan! </strong>
        <span className="block sm:inline">{notificationMessage}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <button 
            onClick={() => setShowNotification(false)}
            className="text-green-700 hover:text-green-900"
          >
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Tutup</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </span>
      </div>
    </div>
  );
};

export default PaymentNotification;