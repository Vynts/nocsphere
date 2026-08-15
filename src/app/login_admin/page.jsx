'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Harap isi Email dan Password.');
      setLoading(false);
      return;
    }

    try {
      // ⚠️ GANTI URL INI SESUAI ENDPOINT BACKEND KAMU ⚠️
      const API_URL = 'http://localhost:8000/api/auth/login'; 

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      // Tangani jika respon HTTP tidak OK (misal Status 422 Validation Error atau 401 Unauthenticated)
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal, periksa email dan password Anda.');
      }

      // 1. Simpan Token ke LocalStorage (bisa digunakan untuk API Request berikutnya)
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type || 'bearer');
        localStorage.setItem('user_level', data.level || '');
      }

      // 2. Redirect sesuai respon API ('redirect_to') atau ke /admin/dashboard jika kosong
      const targetRoute = data.redirect_to || '/admin/dashboard';
      router.push(targetRoute);

    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan pada jaringan/server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noc-login-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4">
      <link rel="stylesheet" href="/css/login_page.css" />

      <div className="login-container position-relative">
        
        {/* TOMBOL KEMBALI KE BERANDA */}
        <Link
          href="/"
          className="position-absolute top-0 start-0 m-4 text-white text-decoration-none z-3"
          aria-label="Kembali ke Beranda"
          title="Kembali ke Beranda"
        >
          <i className="bi bi-arrow-left fs-4 fw-bold opacity-75 custom-hover-opacity"></i>
        </Link>
        
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
                alt="NocSphere Admin Illustration" 
              />
            </div>
          </div>

          {/* KOLOM KANAN: FORM LOGIN ADMIN */}
          <div className="col-12 col-lg-6">
            <div className="login-form-side pt-5 pt-lg-4">
              
              {/* LOGO & TITLE */}
              <div className="text-center text-lg-start mb-4">
                <img 
                  src="/img/nocsphere.png" 
                  alt="NocSphere Network" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
                <div className="d-flex align-items-center gap-2 mt-3 mb-1 justify-content-center justify-content-lg-start">
                  <h5 className="text-white fw-bold mb-0">Portal Admin NOC</h5>
                  
                </div>
                <p className="text-secondary small mb-0">Masukkan kredensial administrator untuk akses sistem. 
                 <a href="/forgot_password" className="text-info text-decoration-none m-2">
                    Lupa Password?
                 </a>
                </p>
              </div>

              {/* ERROR ALERT */}
              {errorMsg && (
                <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3 border-0 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                  {errorMsg}
                </div>
              )}

              {/* FORM ADMIN */}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-white-50 small fw-semibold">
                    Email Admin <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-noc"
                    placeholder="Contoh: admin@nocsphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white-50 small fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-noc pe-5"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-white-50 text-decoration-none pe-3"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-noc-primary mb-3"
                  disabled={loading}
                >
                  {loading ? 'Memeriksa Akses...' : 'Masuk Dashboard Admin'}
                </button>
              </form>

              <div className="text-center my-3">
                <span className="text-secondary small">kendala akses admin?</span>
              </div>

              {/* TOMBOL BANTUAN */}
              <a
                href="https://wa.me/628123456789?text=Halo%20Super%20Admin,%20saya%20terkunci%20/lupa%20akses%20Portal%20Admin%20NocSphere"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tanya-admin-login"
              >
                <div className="d-flex align-items-center gap-2">
                  <span>Hubungi Tim Nocsphere</span>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}