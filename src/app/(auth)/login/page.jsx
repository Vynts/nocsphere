"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; 

export default function LoginPage() {
  const router = useRouter();
  
  // State untuk mengatur tampilan form: "login" | "register" | "forgot"
  const [view, setView] = useState("login");
  
  // State Input Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // State Status & Error
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Jalur Handler Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Username atau Password Salah!");
      }

      if (result.status === "success") {
        localStorage.setItem("nocsphere_token", result.access_token);
        localStorage.setItem("user_level", result.level);

        const decodedToken = jwtDecode(result.access_token);
        const tenantSlug = result.tenant; 

        router.push(`/${tenantSlug}/dashboard`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Jalur Handler Daftar (Register)
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          full_name: fullName, 
          company_name: companyName, 
          email: email, 
          password: password 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal melakukan pendaftaran.");
      }

      setSuccessMessage("Pendaftaran berhasil! Silakan login menggunakan akun baru Anda.");
      setView("login"); 
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Jalur Handler Lupa Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.detail || "Email tidak ditemukan.");
      }

      setSuccessMessage("Instruksi reset sandi telah dikirim ke email Anda.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (targetView) => {
    setView(targetView);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
        padding: "20px",
      }}
    >
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          maxWidth: "1000px",
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="row g-0">
          
          {/* ================= SISI KIRI: VISUAL LAYOUT ART (CLEAN SOLID) ================= */}
          <div 
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative"
            style={{
              background: "linear-gradient(145deg, #081f5d 0%, #0f172a 100%)",
              minHeight: "600px"
            }}
          >
            {/* Titik-titik background pattern sudah dihapus sepenuhnya di sini agar terlihat lebih rapi */}

            <div className="d-flex align-items-center gap-2 position-relative z-1">
              <img className="me-2" src="/img/nocsphere.png" alt="NocSphere Logo" width="150" />
            </div>

            <div className="my-auto position-relative z-1">
              <h1 className="fw-extrabold mb-3 display-6 text-white" style={{ letterSpacing: "-1px" }}>
                Cloud Radius & <br/>Smart Billing Platform.
              </h1>
              <p className="text-white-50 lead fs-6" style={{ maxWidth: "380px", lineHeight: "1.6" }}>
                Kelola infrastruktur PPPoE, monitoring interkoneksi API MikroTik, dan otomatisasi isolir jaringan dalam satu panel terpusat.
              </p>
            </div>

            <div className="text-white-50 small position-relative z-1">
              &copy; {new Date().getFullYear()} NocSphere. All rights reserved.
            </div>
          </div>

          {/* ================= SISI KANAN: FORM DINAMIS ================= */}
          <div className="col-lg-6 d-flex align-items-center bg-white">
            <div className="card-body p-4 p-sm-5 mx-md-3">
              
              <div className="d-flex d-lg-none align-items-center gap-2 mb-4 text-primary">
                <i className="bi bi-hexagon-fill fs-4"></i>
                <span className="fw-bold text-dark">NocSphere</span>
              </div>

              {error && (
                <div className="alert alert-danger small py-2.5 border-0 rounded-3 mb-4 d-flex align-items-center gap-2" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                  <i className="bi bi-exclamation-triangle-fill fs-6"></i>
                  <div>{error}</div>
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success small py-2.5 border-0 rounded-3 mb-4 d-flex align-items-center gap-2" style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}>
                  <i className="bi bi-check-circle-fill fs-6"></i>
                  <div>{successMessage}</div>
                </div>
              )}

              {/* ================= FORM 1: LOGIN ================= */}
              {view === "login" && (
                <>
                  <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.5px" }}>Log in</h2>
                  <p className="text-muted small mb-4">Masukkan kredensial akun untuk mengakses dashboard panel Anda.</p>

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label text-dark fw-medium small mb-1.5">Alamat Email</label>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-envelope position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="nama@perusahaan.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1.5">
                        <label className="form-label text-dark fw-medium small mb-0">Kata Sandi</label>
                        <a href="#" onClick={(e) => { e.preventDefault(); switchView("forgot"); }} className="text-decoration-none small fw-medium text-primary">Lupa Password?</a>
                      </div>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-lock position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary-noc w-100 fw-bold my-2" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                      {loading ? "Menghubungkan..." : "Masuk ke Dashboard"}
                    </button>
                  </form>
                  <p className="text-center text-muted small mt-4 mb-0">
                    Belum punya akun perusahaan?{" "}
                    <a href="#" onClick={(e) => { e.preventDefault(); switchView("register"); }} className="text-decoration-none fw-semibold text-primary">Daftar Sekarang</a>
                  </p>
                </>
              )}

              {/* ================= FORM 2: REGISTER (DAFTAR AKUN) ================= */}
              {view === "register" && (
                <>
                  <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.5px" }}>Daftar Akun Baru</h2>
                  <p className="text-muted small mb-4">Mulai kelola billing infrastruktur RT/RW Net & ISP Anda sekarang.</p>

                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label text-dark fw-medium small mb-1.5">Nama Lengkap</label>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-person position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Masukkan nama lengkap Anda"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-dark fw-medium small mb-1.5">Nama Perusahaan / Brand ISP</label>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-building position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Rhantech Media Net"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-dark fw-medium small mb-1.5">Alamat Email Aktif</label>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-envelope position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="nama@perusahaan.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium small mb-1.5">Buat Kata Sandi</label>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-lock position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Minimal 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary-noc w-100 fw-bold mb-2" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                      {loading ? "Memproses Registrasi..." : "Buat Akun Perusahaan"}
                    </button>
                  </form>
                  <p className="text-center text-muted small mt-3 mb-0">
                    Sudah memiliki akun?{" "}
                    <a href="#" onClick={(e) => { e.preventDefault(); switchView("login"); }} className="text-decoration-none fw-semibold text-primary">Silakan Login</a>
                  </p>
                </>
              )}

              {/* ================= FORM 3: LUPA PASSWORD ================= */}
              {view === "forgot" && (
                <>
                  <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "28px", letterSpacing: "-0.5px" }}>Lupa Kata Sandi?</h2>
                  <p className="text-muted small mb-4">Jangan khawatir, kami akan mengirimkan link reset sandi aman ke email Anda.</p>

                  <form onSubmit={handleForgotPassword}>
                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium small mb-1.5">Masukkan Email Terdaftar</label>
                      <div className="position-relative d-flex align-items-center">
                        <i className="bi bi-envelope position-absolute text-muted start-0 ms-3"></i>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="nama@perusahaan.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary-noc w-100 fw-bold mb-3" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                      {loading ? "Mengirim Permintaan..." : "Kirim Link Reset Sandi"}
                    </button>

                    <button 
                      type="button" 
                      onClick={() => switchView("login")} 
                      className="btn btn-link text-decoration-none text-muted w-100 small d-flex align-items-center justify-content-center gap-1 p-0"
                    >
                      <i className="bi bi-arrow-left"></i> Kembali ke Halaman Login
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        .form-control {
          padding-left: 42px !important;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          height: 48px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #334155;
        }
        .form-control:focus {
          background-color: #ffffff !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }
        .form-control + i {
          pointer-events: none;
        }
        .btn-primary-noc {
          background: linear-gradient(90deg, #1e3a8a 0%, #1e40af 100%);
          color: white;
          height: 48px;
          border-radius: 8px;
          border: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);
        }
        .btn-primary-noc:hover {
          opacity: 0.95;
          transform: translateY(-0.5px);
        }
        .fw-extrabold { font-weight: 800; }
      `}</style>
    </div>
  );
}