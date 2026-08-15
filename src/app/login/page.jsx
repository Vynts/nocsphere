'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  const [customerId, setCustomerId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!customerId) {
      setErrorMsg('Harap isi ID Pelanggan.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const cleanId = customerId.trim().toUpperCase();
      router.push(`/pembayaran/${cleanId}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="noc-login-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4">
      <link rel="stylesheet" href="/css/login_page.css" />

      <div className="login-container position-relative">
        
        {/* TOMBOL KEMBALI KE BERANDA (Tanpa Border) */}
        <Link
          href="/"
          className="position-absolute top-0 start-0 m-4 text-white text-decoration-none z-3"
          aria-label="Kembali ke Beranda"
          title="Kembali ke Beranda"
        >
          <i className="bi bi-arrow-left fs-4 fw-bold opacity-75 custom-hover-opacity"></i>
        </Link>
        
        {/* Tambahan inline style kecil khusus untuk efek hover icon jika diperlukan, 
            atau bisa diabaikan jika sudah diatur di css. */}
        <style jsx>{`
          .custom-hover-opacity:hover {
            opacity: 1 !important;
          }
        `}</style>

        <div className="row g-0 align-items-stretch">
          
          {/* KOLOM KIRI: GAMBAR */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="login-image-side">
              <img 
                src="/img/login.webp" 
                alt="NocSphere Network Illustration" 
              />
            </div>
          </div>

          {/* KOLOM KANAN: FORM LOGIN */}
          <div className="col-12 col-lg-6">
            <div className="login-form-side pt-5 pt-lg-4">
              
              {/* LOGO NOCSPHERE */}
              <div className="text-center text-lg-start mb-4">
                <img 
                  src="/img/nocsphere.png" 
                  alt="NocSphere Network" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
                <h5 className="text-white fw-bold mt-3 mb-1">Selamat Datang Pelanggan</h5>
                <p className="text-secondary small mb-0">Masukkan ID Pelanggan & WhatsApp untuk cek tagihan</p>
              </div>

              {/* ERROR ALERT */}
              {errorMsg && (
                <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3 border-0 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                  {errorMsg}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-white-50 small fw-semibold">
                    ID Pelanggan <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-noc"
                    placeholder="Contoh: ID-10293"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white-50 small fw-semibold">Nomor WhatsApp / HP</label>
                  <input
                    type="tel"
                    className="form-control form-control-noc"
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-secondary small mt-1 mb-0">Opsional, tapi disarankan untuk memudahkan konfirmasi tagihan</p>
                </div>

                <button
                  type="submit"
                  className="btn-noc-primary mb-3"
                  disabled={loading}
                >
                  {loading ? 'Memeriksa Data...' : 'Cek Tagihan Saya'}
                </button>
              </form>

              <div className="text-center my-3">
                <span className="text-secondary small">butuh bantuan?</span>
              </div>

              {/* TOMBOL TANYA ADMIN */}
              <a
                href="https://wa.me/628123456789?text=Halo%20Admin%20NocSphere,%20saya%20lupa%20ID%20Pelanggan%20/Nomor%20Tagihan%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tanya-admin-login"
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-whatsapp fs-6 text-success"></i>
                  <span>Tanya Admin</span>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}