// src/app/(auth)/register/page.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi Kecocokan Password
    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      setLoading(false);
      return;
    }

    // Simulasi Berhasil Registrasi
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #060913 0%, #0b1120 100%)",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Container Utama Main Card (Split Layout) */}
      <div
        className="card border-0 shadow-lg overflow-hidden position-relative"
        style={{
          maxWidth: "980px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Tombol Close Pojok Kanan Atas */}
        <button
          className="btn-close position-absolute"
          type="button"
          style={{ right: "20px", top: "20px", zIndex: 10 }}
          aria-label="Close"
        ></button>

        <div className="row g-0">
          {/* ================= SISI KIRI: BANNER BRANDING (HITAM-BIRU) ================= */}
          <div
            className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative"
            style={{
              background: "linear-gradient(135deg, #0b1528 0%, #050811 100%)",
              overflow: "hidden",
            }}
          >
            {/* Efek Cetakan Geometris Abstrak Biru Di Latar Belakang */}
            <div
              className="position-absolute"
              style={{
                top: "-10%",
                left: "-10%",
                width: "120%",
                height: "120%",
                opacity: 0.12,
                pointerEvents: "none",
                background:
                  "repeating-linear-gradient(45deg, #0d6efd 0px, #0d6efd 40px, transparent 40px, transparent 80px)",
              }}
            ></div>
            <div
              className="position-absolute rounded-circle"
              style={{
                width: "350px",
                height: "350px",
                background:
                  "radial-gradient(circle, #0d6efd 0%, transparent 70%)",
                top: "20%",
                left: "-15%",
                opacity: 0.25,
                filter: "blur(50px)",
              }}
            ></div>

            {/* Konten Atas: Brand Name Kecil */}
            <div className="position-relative" style={{ zIndex: 2 }}>
              <span
                className="fw-bold tracking-wider small text-uppercase text-primary"
                style={{ letterSpacing: "1.5px" }}
              >
                NocSphere Panel
              </span>
            </div>

            {/* Konten Tengah: Logomark Besar & Deskripsi */}
            <div
              className="my-auto position-relative text-center"
              style={{ zIndex: 2 }}
            >
              <div
                className="mb-4 d-flex justify-content-center align-items-center mx-auto"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "24px",
                  background: "rgba(13, 110, 253, 0.1)",
                  border: "1px solid rgba(13, 110, 253, 0.25)",
                  boxShadow: "0 0 30px rgba(13, 110, 253, 0.2)",
                }}
              >
                <i
                  className="bi bi-hexagon-fill text-primary"
                  style={{
                    fontSize: "42px",
                    filter: "drop-shadow(0 0 10px #0d6efd)",
                  }}
                ></i>
              </div>
              <h3 className="fw-bold mb-2" style={{ letterSpacing: "-0.5px" }}>
                Start Your Journey
              </h3>
              <p
                className="text-white-50 small mx-auto mb-4"
                style={{ maxWidth: "280px", lineHeight: "1.6" }}
              >
                Automate your entire MikroTik billing systems and ISP
                configurations under one secure network.
              </p>
            </div>

            {/* Konten Bawah: Copyright */}
            <div className="position-relative" style={{ zIndex: 2 }}>
              <span className="text-white-50" style={{ fontSize: "11px" }}>
                &copy; 2026 PT NocSphere Inovasi Teknologi
              </span>
            </div>
          </div>

          {/* ================= SISI KANAN: FORM REGISTRASI ================= */}
          <div
            className="col-lg-7 col-12 p-4 p-sm-5 d-flex flex-column justify-content-center"
            style={{
              background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            }}
          >
            {/* Tampilan Header Logo khusus Mobile */}
            <div className="d-lg-none text-center mb-4">
              <div
                className="mb-2 d-flex justify-content-center align-items-center mx-auto"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "rgba(13, 110, 253, 0.08)",
                }}
              >
                <i
                  className="bi bi-hexagon-fill text-primary"
                  style={{ fontSize: "24px" }}
                ></i>
              </div>
              <h4 className="fw-bold text-dark mb-1">NocSphere</h4>
              <p className="text-muted small mb-0">
                Billing & Network Management
              </p>
            </div>

            <div className="mx-auto w-100" style={{ maxWidth: "440px" }}>
              {/* Judul Utama */}
              <h2
                className="fw-bold text-dark mb-1"
                style={{ fontSize: "32px", letterSpacing: "-0.5px" }}
              >
                Register
              </h2>
              <p className="text-muted small mb-4">
                Daftarkan bisnis ISP atau jaringan RT/RW Net Anda sekarang.
              </p>

              {/* Notifikasi Error */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center small py-2.5 border-0 rounded-3 mb-4"
                  role="alert"
                  style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                  <div className="fw-medium">{error}</div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleRegister}>
                <div className="row g-2">
                  {/* Input Username */}
                  <div className="col-sm-6 col-12 mb-2">
                    <input
                      type="text"
                      name="username"
                      className="form-control px-3 text-white fw-medium shadow-sm"
                      placeholder="Username"
                      style={{
                        backgroundColor: "#eaeaea",
                        border: "none",
                        height: "46px",
                        borderRadius: "8px",
                      }}
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Input Email */}
                  <div className="col-sm-6 col-12 mb-2">
                    <input
                      type="email"
                      name="email"
                      className="form-control px-3 text-white fw-medium shadow-sm"
                      placeholder="Alamat Email"
                      style={{
                        backgroundColor: "#eaeaea",
                        border: "none",
                        height: "46px",
                        borderRadius: "8px",
                      }}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Input Kontak (WhatsApp) */}
                  <div className="col-12 mb-2">
                    <input
                      type="tel"
                      name="phone"
                      className="form-control px-3 text-white fw-medium shadow-sm"
                      placeholder="Nomor Kontak / WhatsApp (e.g. 081234xxx)"
                      style={{
                        backgroundColor: "#eaeaea",
                        border: "none",
                        height: "46px",
                        borderRadius: "8px",
                      }}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Input Alamat Lengkap */}
                  <div className="col-12 mb-2">
                    <textarea
                      name="address"
                      className="form-control px-3 pt-2.5 text-white fw-medium shadow-sm"
                      placeholder="Alamat Bisnis / Lokasi ISP"
                      rows="2"
                      style={{
                        backgroundColor: "#eaeaea",
                        border: "none",
                        borderRadius: "8px",
                        resize: "none",
                      }}
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Input Password */}
                  <div className="col-sm-6 col-12 mb-2">
                    <input
                      type="password"
                      name="password"
                      className="form-control px-3 text-white fw-medium shadow-sm"
                      placeholder="Password"
                      style={{
                        backgroundColor: "#eaeaea",
                        border: "none",
                        height: "46px",
                        borderRadius: "8px",
                      }}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Input Konfirmasi Password */}
                  <div className="col-sm-6 col-12 mb-3">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control px-3 text-white fw-medium shadow-sm"
                      placeholder="Konfirmasi Password"
                      style={{
                        backgroundColor: "#eaeaea",
                        border: "none",
                        height: "46px",
                        borderRadius: "8px",
                      }}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Persetujuan Kebijakan Privacy */}
                <div className="mb-4 px-1">
                  <div className="form-check">
                    <input
                      className="form-check-input border-secondary"
                      type="checkbox"
                      id="agreeTerms"
                      style={{ cursor: "pointer" }}
                      required
                    />
                    <label
                      className="form-check-label text-secondary small user-select-none"
                      htmlFor="agreeTerms"
                      style={{ cursor: "pointer", fontSize: "12px" }}
                    >
                      Saya menyetujui{" "}
                      <a
                        href="#"
                        className="text-primary text-decoration-none fw-medium"
                      >
                        Syarat & Ketentuan
                      </a>{" "}
                      yang berlaku di NocSphere.
                    </label>
                  </div>
                </div>

                {/* Tombol Submit */}
                <button
                  type="submit"
                  className="btn text-white w-100 fw-bold shadow-md d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(90deg, #1e3a8a 0%, #0f172a 100%)",
                    height: "46px",
                    borderRadius: "8px",
                    border: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                      <span>Mendaftarkan Server...</span>
                    </>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </form>

              {/* Tautan Balik ke Login */}
              <p className="text-center text-muted small mt-4 mb-0">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary fw-bold text-decoration-none"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
