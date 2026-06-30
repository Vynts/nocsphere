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
                href="#"
              >
                <i className="bi bi-hexagon-fill text-primary me-1"></i>
                Nocsphere  
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
                    <a className="nav-link text-white-50" href="/fitur">
                      Fitur Billing
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="/tentang">
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
                Membawa Manajemen MikroTik <br />
                <span
                  className="text-transparent bg-clip-text bg-gradient"
                  style={{
                    backgroundImage: "linear-gradient(45deg, #0d6efd, #0dcaf0)",
                  }}
                >
                  ke Tingkat Enterprise
                </span>
              </h1>
              <p className="text-secondary" style={{ maxWidth: "700px" }}>
                Nocsphere  lahir sebagai solusi otomasi billing berkinerja
                tinggi, menjembatani kendali infrastruktur jaringan MikroTik
                berskala besar dengan fleksibilitas integrasi modern.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <span className="text-primary text-uppercase small fw-bold tracking-wider">
              Enterprise Billing System
            </span>
            <h2 className="fw-bold mt-2 mb-4">
              Kendali Penuh Tanpa Batas Tanpa API Latency
            </h2>
            <p className="text-secondary">
              Kami memahami tantangan ISP, RT/RW Net, dan jaringan korporasi
              dalam mengelola ribuan akun PPPoE dan Hotspot secara simultan.
              Nocsphere   dikembangkan secara spesifik untuk meminimalkan beban
              query API pada RouterOS Anda menggunakan arsitektur caching data
              yang efisien dan andal.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-sm-6">
                <div
                  className="product-card p-4 d-flex flex-column h-100 border-dark"
                  style={{ backgroundColor: "#0c0e1a" }}
                >
                  <i className="bi bi-rocket-takeoff text-primary fs-2 mb-2 d-block"></i>
                  <h5 className="fw-bold text-white">Ultra-Low API Load</h5>
                  <p className="text-secondary small mb-0">
                    Query RouterOS yang optimal menjaga kestabilan CPU core
                    MikroTik Anda tetap aman.
                  </p>
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className="product-card p-4 d-flex flex-column h-100 border-dark"
                  style={{ backgroundColor: "#0c0e1a" }}
                >
                  <i className="bi bi-cursor-fill text-primary fs-2 mb-2 d-block"></i>
                  <h5 className="fw-bold text-white">Multi-Gateway Integration</h5>
                  <p className="text-secondary small mb-0">
                    Otomatisasi isolir pelanggan dengan integrasi payment
                    gateway real-time dan notifikasi instan WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-5 position-relative overflow-hidden">
        {/* Aksen Background Dot Halus agar tidak terasa kosong */}
        <div
          className="position-absolute top-50 start-50 translate-middle opacity-10 pointer-events-none d-none d-md-block"
          style={{
            width: "600px",
            height: "300px",
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        ></div>

        <div className="container position-relative z-1">
          <div className="text-center mb-5">
            <span className="text-primary text-uppercase small fw-bold tracking-wider">
              The Team
            </span>
            <h2 className="fw-bold mt-1">Behind Nocsphere  </h2>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Alvinza Erza Faradhika */}
            <div className="col-md-6 col-lg-5">
              <div className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100 transition-all shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Alvinza Erza Farandhika</h4>
                    <span className="text-primary small fw-semibold">
                      Founder & Developer
                    </span>
                  </div>
                  {/* Sosmed Icon Minimalis */}
                  <div className="d-flex text-secondary fs-5">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-reset opacity-50 hover-opacity-100 transition-all"
                    >
                      <i className="bi bi-github m-1"></i>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-reset opacity-50 hover-opacity-100 transition-all"
                    >
                      <i className="bi bi-linkedin m-1"></i>
                    </a>
                  </div>
                </div>
                <hr className="border-secondary border-opacity-10 my-3" />
                <p className="text-secondary small mb-0 lh-base">
                  Fokus pada pengembangan arsitektur core sistem, otomatisasi
                  billing, manajemen sinkronisasi data real-time, dan optimasi
                  performa API RouterOS MikroTik.
                </p>
              </div>
            </div>

            {/* Rufi Tomisila */}
            <div className="col-md-6 col-lg-5">
              <div className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100 transition-all shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Rufi Tomisila</h4>
                    <span className="text-info small fw-semibold">
                      Frontend UI/UX Designer
                    </span>
                  </div>
                  {/* Sosmed Icon Minimalis */}
                  <div className="d-flex text-secondary fs-5">
                    <a
                      href="#"
                      className="text-reset opacity-50 hover-opacity-100 transition-all"
                    >
                      <i className="bi bi-github m-1"></i>
                    </a>
                    <a
                      href="#"
                      className="text-reset opacity-50 hover-opacity-100 transition-all"
                    >
                      <i className="bi bi-linkedin m-1"></i>
                    </a>
                  </div>
                </div>
                <hr className="border-secondary border-opacity-10 my-3" />
                <p className="text-secondary small mb-0 lh-base">
                  Bertanggung jawab penuh dalam perancangan antarmuka pengguna
                  yang intuitif, optimalisasi kenyamanan komponen UX, dan
                  visualisasi bagan dashboard NOC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WATERMARK SECTION */}
      <section className="footer-watermark-container bg-dark-custom py-5">
        <div className="py-4">
          <div className="footer-watermark-text text-nowrap">Nocsphere  </div>
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
                Nocsphere  
              </a>
              <p
                className="text-white-50 small lh-lg mb-3"
                style={{ maxWidth: "350px" }}
              >
                Nocsphere  provides high-performing billing management systems
                with unmatched reliability and automated isolation features.
              </p>
              <p className="fw-bold small mb-1">
                PT Nocsphere  Inovasi Teknologi
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
              &copy; 2026 Nocsphere  . All rights reserved.
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
