"use client";
import React, { useState, useEffect } from "react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Jika di-scroll lebih dari 20px, aktifkan background
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HEADER SECTION */}
      <header
        className="bg-dark-custom text-white pt-2 pb-5 position-relative"
        style={{
          background: "linear-gradient(180deg, #060913 0%, #0b1120 100%)",
        }}
      >
        <div className="container">
          <nav
            className={`navbar navbar-expand-lg navbar-dark fixed-top py-3 transition-all`}
            style={{
              // Mengatur perubahan background & efek blur saat di-scroll
              backgroundColor: isScrolled
                ? "rgba(6, 9, 19, 0.85)"
                : "transparent",
              backdropFilter: isScrolled ? "blur(10px)" : "none",
              WebkitBackdropFilter: isScrolled ? "blur(10px)" : "none",
              borderBottom: isScrolled
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid transparent",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <div className="container">
              <a
                className="navbar-brand fw-bold d-flex align-items-center"
                href="/"
              >
                <img className="me-2" src="/img/nocsphere.png" alt="NocSphere Logo" width="100" />
              </a>

              <button
                className="navbar-toggler border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse justify-content-center"
                id="navbarNav"
              >
                <ul className="navbar-nav gap-2 gap-lg-3 text-center my-3 my-lg-0">
                  <li className="nav-item">
                    <a className="nav-link text-white-50" href="/">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="/fitur">
                      Fitur Billing
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-white-50" href="/tentang">
                      Tentang Kami
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-white-50" href="/harga">
                      Harga Paket
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-white-50" href="/docs">
                      Docs
                    </a>
                  </li>
                </ul>
                <div className="d-lg-none d-grid gap-2 mt-3">
                  <a
                    href="/login"
                    className="btn btn-light rounded-pill fw-bold"
                  >
                    Login
                  </a>
                </div>
              </div>

              <a
                href="/login"
                className="btn btn-sm btn-light rounded-pill px-4 fw-bold d-none d-lg-inline-block"
              >
                Login
              </a>
            </div>
          </nav>

          <div className="container">
            <div className="py-5 my-5">
              <h1 className="display-4 fw-bold mb-3 tracking-tight my-5">
                <span
                  className="text-transparent bg-clip-text bg-gradient"
                  style={{
                    backgroundImage: "linear-gradient(45deg, #0d6efd, #0dcaf0)",
                  }}
                >
                  Prioritas Klien & Update Selamanya
                </span>
              </h1>
              <p className="text-secondary" style={{ maxWidth: "700px" }}>
                Nocsphere berdedikasi penuh mengoptimalkan manajemen PPPoE
                MikroTik Anda. Nikmati pembaruan fitur dan performa secara
                berkala secara otomatis—selalu dengan harga langganan yang tetap
                sama tanpa biaya tambahan.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow-1 py-5 mt-5 pt-5">
        <div className="container py-4">
          {/* LAYOUT SPLIT: Komitmen Klien vs Core Fitur */}
          <div className="row g-5 align-items-center">
            {/* SISI KIRI: Komitmen & Prioritas Utama (Teks Besar & Padat) */}
            <div className="col-12 col-lg-6">
              <span
                className="text-primary fw-bold text-uppercase d-block mb-2"
                style={{ fontSize: "12px", letterSpacing: "1.5px" }}
              >
                KAMI MENDENGAR ANDA
              </span>
              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "2.5rem",
                  lineHeight: "1.2",
                  letterSpacing: "-0.5px",
                }}
              >
                Klien Selalu Prioritas,
                <br />
                Update Terus Tanpa Biaya Tambahan
              </h1>
              <p
                className="text-secondary mb-3"
                style={{ fontSize: "15px", lineHeight: "1.6" }}
              >
                Di Nocsphere, kenyamanan dan stabilitas bisnis RT/RW Net atau
                ISP Anda adalah prioritas nomor satu kami. Kami terus melakukan
                pengembangan, perbaikan performa, dan penambahan fitur-fitur
                baru secara berkala untuk memastikan integrasi PPPoE Anda selalu
                berjalan optimal mengikuti perkembangan teknologi RouterOS.
              </p>
              <p
                className="text-secondary"
                style={{ fontSize: "15px", lineHeight: "1.6" }}
              >
                Kabar terbaiknya? Anda tidak perlu mengkhawatirkan biaya
                tambahan di masa depan. Cukup berlangganan dengan{" "}
                <strong>harga tetap yang sama</strong>, dan Anda otomatis
                langsung menikmati seluruh update sistem terbaru kami tanpa
                biaya *upgrade* tersembunyi apa pun.
              </p>
            </div>

            {/* SISI KANAN: Grid Core Fitur PPPoE Management */}
            <div className="col-12 col-lg-6">
              <div className="row g-3">
                {/* Fitur 1 */}
                <div className="col-12 col-sm-6">
                  <div
                    className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100"
                    style={{ backgroundColor: "#0b1120" }}
                  >
                    <div className="text-primary mb-3">
                      <i className="bi bi-rocket-takeoff fs-3"></i>
                    </div>
                    <h5
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Ultra-Low API Load
                    </h5>
                    <p
                      className="text-secondary small mb-0"
                      style={{ fontSize: "12.5px", lineHeight: "1.5" }}
                    >
                      Arsitektur optimasi query data menjaga kestabilan resource
                      CPU router MikroTik Anda tetap ringan.
                    </p>
                  </div>
                </div>

                {/* Fitur 2 */}
                <div className="col-12 col-sm-6">
                  <div
                    className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100"
                    style={{ backgroundColor: "#0b1120" }}
                  >
                    <div className="text-primary mb-3">
                      <i className="bi bi-shield-lock fs-3"></i>
                    </div>
                    <h5
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Isolir Otomatis Real-Time
                    </h5>
                    <p
                      className="text-secondary small mb-0"
                      style={{ fontSize: "12.5px", lineHeight: "1.5" }}
                    >
                      Memindahkan profil secret pelanggan PPPoE yang menunggak
                      ke mode terisolir tepat waktu secara otomatis.
                    </p>
                  </div>
                </div>

                {/* Fitur 3 */}
                <div className="col-12 col-sm-6">
                  <div
                    className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100"
                    style={{ backgroundColor: "#0b1120" }}
                  >
                    <div className="text-primary mb-3">
                      <i className="bi bi-lightning-charge fs-3"></i>
                    </div>
                    <h5
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Buka Isolir Instan
                    </h5>
                    <p
                      className="text-secondary small mb-0"
                      style={{ fontSize: "12.5px", lineHeight: "1.5" }}
                    >
                      Integrasi payment gateway membuat status isolir terlepas
                      sedetik setelah pembayaran QRIS/VA sukses.
                    </p>
                  </div>
                </div>

                {/* Fitur 4 */}
                <div className="col-12 col-sm-6">
                  <div
                    className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100"
                    style={{ backgroundColor: "#0b1120" }}
                  >
                    <div className="text-primary mb-3">
                      <i className="bi bi-whatsapp fs-3"></i>
                    </div>
                    <h5
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      WhatsApp Reminder
                    </h5>
                    <p
                      className="text-secondary small mb-0"
                      style={{ fontSize: "12.5px", lineHeight: "1.5" }}
                    >
                      Notifikasi invoice otomatis langsung terkirim ke chat
                      pelanggan sebelum masa jatuh tempo tiba.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION: VIDEO DEMO (UKURAN BESAR) ================= */}
          <div className="row justify-content-center mt-5 pt-4">
            <div className="col-12 col-md-12 col-lg-12">
              <div
                className="ratio ratio-16x9 overflow-hidden shadow-lg"
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/OlmuFRINnGg?si=1tWbuOW5gLYweetD"
                  title="NocsphereDemo Video"
                  allowFullScreen
                  style={{ borderRadius: "16px" }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* WATERMARK SECTION */}
      <section className="footer-watermark-container bg-dark-custom py-5">
        <div className="py-4">
          <div className="footer-watermark-text text-nowrap">nocsphere</div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer
        className="bg-dark-custom text-white pt-5 pb-4 border-top border-secondary border-opacity-10 position-relative"
        style={{ minHeight: "450px" }}
      >
        <div className="container overflow-hidden">
          <div
            className="row g-4 mb-5 text-start position-relative"
            style={{ zIndex: 2 }}
          >
            <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
              <a
                className="navbar-brand fw-bold d-flex align-items-center mb-3 text-white fs-5"
                href="/"
              >
                <img className="me-2" src="/img/nocsphere.png" alt="NocSphere Logo" width="100" />
              </a>
              <p
                className="text-white-50 small lh-lg mb-3"
                style={{ maxWidth: "350px" }}
              >
                Nocsphereprovides high-performing billing management systems
                with unmatched reliability and automated isolation features.
              </p>
              <p className="fw-bold small mb-1">
                PT Nocsphere Inovasi Teknologi
              </p>
              <p className="text-white-50 small mb-3">
                Serving the best web billing management community
              </p>

              <div className="d-flex gap-2">
                <span className="badge bg-secondary bg-opacity-10 text-white-50 border border-secondary border-opacity-20 px-2 py-1.5 small">
                  Stripe Verified
                </span>
                <span className="badge bg-secondary bg-opacity-10 text-white-50 border border-secondary border-opacity-20 px-2 py-1.5 small">
                  PCI Compliant
                </span>
              </div>
            </div>

            <div className="col-lg-8 col-md-12">
              <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 g-4">
                <div>
                  <h6 className="fw-bold footer-heading text-uppercase mb-3">
                    Solutions
                  </h6>
                  <div className="d-flex flex-column">
                    <a href="#" className="footer-link-custom">
                      PPPoE Accounts
                    </a>
                    <a href="#" className="footer-link-custom">
                      Hotspot Voucher
                    </a>
                    <a href="#" className="footer-link-custom">
                      Multi Router API
                    </a>
                    <a href="#" className="footer-link-custom">
                      Payment Gateway
                    </a>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold footer-heading text-uppercase mb-3">
                    Legal
                  </h6>
                  <div className="d-flex flex-column">
                    <a href="#" className="footer-link-custom">
                      Fair Use
                    </a>
                    <a href="#" className="footer-link-custom">
                      Terms
                    </a>
                    <a href="#" className="footer-link-custom">
                      Privacy
                    </a>
                    <a href="#" className="footer-link-custom">
                      SLA
                    </a>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold footer-heading text-uppercase mb-3">
                    Services
                  </h6>
                  <div className="d-flex flex-column">
                    <a href="#" className="footer-link-custom">
                      Client Area
                    </a>
                    <a href="#" className="footer-link-custom">
                      Status
                    </a>
                    <a href="#" className="footer-link-custom">
                      Discord
                    </a>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold footer-heading text-uppercase mb-3">
                    Resources
                  </h6>
                  <div className="d-flex flex-column">
                    <a href="#" className="footer-link-custom">
                      Documentation
                    </a>
                    <a href="#" className="footer-link-custom">
                      MikroTik MIB API
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-secondary border-opacity-10 my-4" />

          <div
            className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 position-relative"
            style={{ zIndex: 2 }}
          >
            <span className="text-white-50 small">
              &copy; 2026 NocSphere. All rights reserved.
            </span>
            <div className="d-flex gap-3 fs-5 social-links">
              <a href="#">
                <i className="fa-brands fa-discord"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
