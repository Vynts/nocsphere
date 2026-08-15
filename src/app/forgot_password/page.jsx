'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // ⚠️ GANTI ENDPOINT BACKEND SEBENARNYA ⚠️
      const res = await fetch('http://localhost:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Email tidak terdaftar atau gagal mengirim email.');
      }

      setSuccessMsg('Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk/spam.');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noc-login-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4">
      <link rel="stylesheet" href="/css/login_page.css" />

      <div className="login-container position-relative" style={{ maxWidth: '480px' }}>
        {/* TOMBOL KEMBALI KE LOGIN ADMIN */}
        <Link
          href="/admin/login"
          className="position-absolute top-0 start-0 m-4 text-white text-decoration-none z-3"
          aria-label="Kembali ke Login"
          title="Kembali ke Login"
        >
          <i className="bi bi-arrow-left fs-4 fw-bold opacity-75"></i>
        </Link>

        <div className="p-4 p-md-5">
          <div className="text-center mb-4 pt-3">
            <img
              src="/img/nocsphere.png"
              alt="NocSphere Network"
              style={{ height: '38px', objectFit: 'contain' }}
            />
            <h5 className="text-white fw-bold mt-3 mb-1">Lupa Password Admin</h5>
            <p className="text-secondary small mb-0">
              Masukkan email terdaftar untuk menerima intruksi reset password
            </p>
          </div>

          {/* ALERT NOTIFIKASI */}
          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3 border-0 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 small mb-3 border-0 text-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label className="form-label text-white-50 small fw-semibold">
                Email Admin Terdaftar <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control form-control-noc"
                placeholder="admin@nocsphere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-noc-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Mengirim Email...' : 'Kirim Link Reset'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link href="/login_admin" className="text-secondary small text-decoration-none">
              Ingat password? <span className="text-info fw-semibold">Kembali ke Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}