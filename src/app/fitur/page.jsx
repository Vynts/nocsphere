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

  const fiturKanan = [
    {
      title: "TERPERCAYA DAN TERUJI",
      desc: "Sudah dipercaya dan digunakan oleh ribuan perusahaan skala kecil dan besar dari seluruh wilayah Indonesia untuk menjaga reliabilitas billing.",
      icon: "bi-shield-check",
      color: "#0d6efd",
    },
    {
      title: "RESOURCE MIKROTIK RINGAN",
      desc: "Karena data tersimpan di Database Cloud Radius, Resources MikroTik Anda menjadi jauh lebih ringan dan memperpanjang umur hardware.",
      icon: "bi-cpu",
      color: "#20c997",
    },
    {
      title: "INTEGRASI OLT & ONU",
      desc: "Fitur Management OLT EPON dan GPON yang terintegrasi langsung dengan aplikasi untuk memantau redaman (optical power) secara realtime.",
      icon: "bi-diagram-3",
      color: "#0dcaf0",
    },
    {
      title: "TIKET SUPPORT",
      desc: "Fitur tiket yang aman memudahkan Anda dalam memantau suatu proses troubleshooting atau kendala teknis tim lapangan.",
      icon: "bi-ticket-perforated",
      color: "#ffc107",
    },
    {
      title: "DATA LEBIH AMAN",
      desc: "Data pelanggan tetap aman ketika mikroTik rusak, cukup hubungkan mikroTik pengganti ke server radius kami tanpa setup ulang.",
      icon: "bi-database-check",
      color: "#6f42c1",
    },
    {
      title: "INVOICE OTOMATIS",
      desc: "Tersedia fitur invoice otomatis dan invoice manual untuk pembuatan billing pelanggan terisolir maupun masa tenggang.",
      icon: "bi-file-earmark-bar-graph",
      color: "#fd7e14",
    },
  ];

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
                href="#"
              >
                <i className="bi bi-hexagon-fill text-primary me-1"></i>
                NocSphere
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
                  Fitur Unggulan Kami
                </span>
              </h1>
              <p className="text-secondary" style={{ maxWidth: "700px" }}>
                NocSphere menyediakan berbagai fitur canggih untuk memudahkan
                manajemen jaringan Internet Service Provider Anda.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow-1 py-5 position-relative">
        <div className="container py-4">
          {/* Judul Atas */}
          <div className="text-center mb-5 pb-2">
            <span
              className="badge text-bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill px-3 py-1.5 text-uppercase fw-bold mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              CORE MANAGEMENT SYSTEM
            </span>
            <h5
              className="fw-black fw-bold tracking-wide mb-2"
              style={{ fontSize: "1.6rem", letterSpacing: "1px" }}
            >
              MANAJEMEN UTAMA
            </h5>
            <p
              className="text-secondary small mx-auto"
              style={{ maxWidth: "550px" }}
            >
              Fokus pada efisiensi pengontrolan user PPPoE MikroTik dan
              otomatisasi billing tanpa membebani resource router Anda.
            </p>
            <div
              className="mx-auto mt-3"
              style={{
                width: "40px",
                height: "3px",
                backgroundColor: "#0d6efd",
              }}
            ></div>
          </div>

          {/* Layout Baru: Grid Card Modern (3 Kolom Sejajar) */}
          <div className="row g-4 justify-content-center">
            {/* Card Fitur 1 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="p-4 rounded-4 border border-secondary border-opacity-10 h-100 d-flex flex-column"
                style={{
                  backgroundColor: "rgba(11, 17, 32)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i
                    className="bi bi-cpu-fill fs-5"
                    style={{ color: "#0d6efd" }}
                  ></i>

                  <h5 className="fw-bold mb-0 text-white fs-6 tracking-wide">
                    OPTIMASI API LOAD MINIM
                  </h5>
                </div>
                <p className="text-secondary small mb-0 lh-base">
                  Arsitektur core kami didesain khusus melakukan caching query
                  data penagihan. Sinkronisasi berkala menjaga CPU load MikroTik
                  Anda tetap rendah dan stabil walau mengelola ribuan secret
                  PPPoE aktif.
                </p>
              </div>
            </div>

            {/* Card Fitur 2 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="p-4 rounded-4 border border-secondary border-opacity-10 h-100 d-flex flex-column"
                style={{
                  backgroundColor: "rgba(11, 17, 32)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i
                    className="bi bi-shield-lock-fill fs-5"
                    style={{ color: "#dc3545" }}
                  ></i>
                  <h5 className="fw-bold mb-0 text-white fs-6 tracking-wide">
                    ISOLIR OTOMATIS REAL-TIME
                  </h5>
                </div>
                <p className="text-secondary small mb-0 lh-base">
                  Sistem billing otomatis memantau masa aktif profile PPPoE
                  pelanggan. Ketika melewati tanggal jatuh tempo, user langsung
                  dialihkan ke profile isolir secara otomatis saat itu juga
                  tanpa lag penundaan.
                </p>
              </div>
            </div>

            {/* Card Fitur 3 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="p-4 rounded-4 border border-secondary border-opacity-10 h-100 d-flex flex-column"
                style={{
                  backgroundColor: "rgba(11, 17, 32)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i
                    className="bi bi-lightning-charge-fill fs-5"
                    style={{ color: "#20c997" }}
                  ></i>
                  <h5 className="fw-bold mb-0 text-white fs-6 tracking-wide">
                    OPEN ISOLIR INSTAN VIA VA/QRIS
                  </h5>
                </div>
                <p className="text-secondary small mb-0 lh-base">
                  Terintegrasi penuh dengan payment gateway otomatis. Begitu
                  pembayaran Virtual Account atau QRIS selesai, sistem langsung
                  melepas status isolir dan mengembalikan profile PPPoE
                  pelanggan ke normal.
                </p>
              </div>
            </div>
          </div>

          {/* ================= FASILITAS PENDUKUNG INTEGRASI ================= */}
          <div className="text-center mt-5 pt-5 mb-4">
            <h2 className="fw-bold fw-bold mb-2" style={{ fontSize: "1.6rem" }}>
              INFRASTRUKTUR UTAMA
            </h2>
            <div
              className="mx-auto mt-2"
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: "#0d6efd",
              }}
            ></div>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-4">
              <div
                className="p-4 rounded-4 border border-secondary border-opacity-10 text-center h-100"
                style={{ backgroundColor: "rgba(11, 17, 32)" }}
              >
                <div
                  className="mx-auto p-3 rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <i className="bi bi-hdd-network text-white fs-4"></i>
                </div>
                <h5 className="fw-bold text-white mb-2 fs-6">
                  SINKRONISASI CLOUD SECURE
                </h5>
                <p
                  className="text-secondary small mb-0"
                  style={{ fontSize: "12px" }}
                >
                  Menghubungkan remote API MikroTik Anda secara aman menggunakan
                  protokol enkripsi cloud radius standar enterprise.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="p-4 rounded-4 border border-secondary border-opacity-10 text-center h-100"
                style={{ backgroundColor: "rgba(11, 17, 32)" }}
              >
                <div
                  className="mx-auto p-3 rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <i className="bi bi-whatsapp text-white fs-4"></i>
                </div>
                <h5 className="fw-bold text-white mb-2 fs-6">
                  NOTIFIKASI REMINDER WHATSAPP
                </h5>
                <p
                  className="text-secondary small mb-0"
                  style={{ fontSize: "12px" }}
                >
                  Mengirimkan rincian tagihan invoice bulanan dan peringatan
                  isolir otomatis langsung ke chat nomor WhatsApp pelanggan.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="p-4 rounded-4 border border-secondary border-opacity-10 text-center h-100"
                style={{
                  backgroundColor: "rgba(11, 17, 32)",
                  borderColor: "rgba(13, 110, 253, 0.2)",
                }}
              >
                <div
                  className="mx-auto p-3 rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(13, 110, 253, 0.15)",
                  }}
                >
                  <i className="bi bi-arrow-clockwise text-primary fs-4"></i>
                </div>
                <h5 className="fw-bold text-white mb-2 fs-6">
                  BACKUP DATA USER PPPoE
                </h5>
                <p
                  className="text-secondary small mb-0"
                  style={{ fontSize: "12px" }}
                >
                  Data profil billing dan list secret pelanggan tersimpan di
                  database eksternal kami secara berkala, aman dari resiko
                  router rusak.
                </p>
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
                href="#"
              >
                <i className="bi bi-hexagon-fill text-primary me-2"></i>{" "}
                NocSphere
              </a>
              <p
                className="text-white-50 small lh-lg mb-3"
                style={{ maxWidth: "350px" }}
              >
                NocSphere provides high-performing billing management systems
                with unmatched reliability and automated isolation features.
              </p>
              <p className="fw-bold small mb-1">
                PT NocSphere Inovasi Teknologi
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
