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
                    <a className="nav-link text-white-50" href="/tentang">
                      Tentang Kami
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="/harga">
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
                Harga yang kami tawarkan <br />
                <span
                  className="text-transparent bg-clip-text bg-gradient"
                  style={{
                    backgroundImage: "linear-gradient(45deg, #0d6efd, #0dcaf0)",
                  }}
                >
                  Untuk Nocsphere
                </span>
              </h1>
              <p className="text-secondary" style={{ maxWidth: "700px" }}>
                Nocsphere lahir sebagai solusi otomasi billing berkinerja
                tinggi, menjembatani kendali infrastruktur jaringan MikroTik
                berskala besar dengan fleksibilitas integrasi modern.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SOLUTIONS SECTION */}
      <section className="py-5 position-relative">
        <div className="container py-4">
          {/* Judul Atas */}
          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase d-block mb-2"
              style={{ fontSize: "11px", letterSpacing: "1px" }}
            >
              SOLUTIONS
            </span>
            <h2 className="fw-bold mb-2" style={{ fontSize: "2.2rem" }}>
              Our Billing Management
            </h2>
            <p className="text-secondary small">
              Pilih paket langganan cloud radius terbaik yang sesuai dengan
              skala jaringan PPPoE Anda.
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

          {/* Grid Paket 3 Kolom Semetris */}
          <div className="row g-4 justify-content-center">
            {/* 1. Paket Starter */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100 d-flex flex-column"
                style={{
                  backgroundColor: "rgb(11, 17, 32, 0.95)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <h4
                  className="fw-bold text-white mb-1"
                  style={{ fontSize: "1.2rem" }}
                >
                  Nocsphere Lite <span style={{ fontSize: "15px" }}>v1.0</span>
                </h4>
                <span className="text-secondary small d-block mb-3">
                  Starting at
                </span>

                <h3
                  className="fw-black text-white mb-4"
                  style={{ fontSize: "2rem" }}
                >
                  Rp 150.000{" "}
                  <span
                    className="text-secondary fw-normal"
                    style={{ fontSize: "13px" }}
                  >
                    / month
                  </span>
                </h3>

                <ul
                  className="list-unstyled d-flex flex-column gap-2.5 flex-grow-1 mb-4"
                  style={{ fontSize: "13.5px" }}
                >
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i> 3
                    Router Mikrotik
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    1.500 Secret
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-x-lg"></i> Free VPN
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Network Maps
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Sistem Isolasi Otomatis
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Notifikasi Whatsapp
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Payment Gateway Otomatis
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Portal Member
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Member
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Customer
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Invoice
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen PPPoE
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-x-lg"></i> Bot Telegram
                  </li>
                </ul>

                <button
                  className="btn btn-outline-light w-100 rounded-pill py-2 fw-bold text-uppercase"
                  style={{
                    fontSize: "12px",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>

            {/* 2. Paket Professional (Rekomendasi / Paling Populer) */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="product-card p-4 rounded-4 border border-primary border-opacity-20 h-100 d-flex flex-column position-relative"
                style={{
                  backgroundColor: "rgb(11, 17, 32)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 10px 30px rgba(13, 110, 253, 0.05)",
                }}
              >
                {/* Badge Rekomendasi */}
                <span
                  className="position-absolute top-0 end-0 bg-primary text-white fw-bold px-3 py-1 rounded-bl-4"
                  style={{
                    fontSize: "10px",
                    borderRadius: "0 15px 0 15px",
                    letterSpacing: "0.5px",
                  }}
                >
                  POPULER
                </span>

                <h4
                  className="fw-bold text-white mb-1"
                  style={{ fontSize: "1.2rem" }}
                >
                  Nocsphere Enterprise <span style={{ fontSize: "15px" }}>v1.0</span>
                </h4>
                <span className="text-secondary small d-block mb-3">
                  Starting at
                </span>

                <h3
                  className="fw-black text-white mb-4"
                  style={{ fontSize: "2.5rem" }}
                >
                  Rp 250.000{" "}
                  <span
                    className="text-secondary fw-normal"
                    style={{ fontSize: "13px" }}
                  >
                    / month
                  </span>
                </h3>

                <ul
                  className="list-unstyled d-flex flex-column gap-2.5 flex-grow-1 mb-4"
                  style={{ fontSize: "13.5px" }}
                >
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i> 5
                    Router Mikrotik
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    2.500 Secrets
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Free VPN
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Network Maps
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Sistem Isolasi Otomatis
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Notifikasi Whatsapp
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Payment Gateway Otomatis
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Portal Member
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Member
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Customer
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Invoice
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen PPPoE
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i> Bot
                    Telegram
                  </li>
                </ul>

                <button
                  className="btn btn-primary w-100 rounded-pill py-2 fw-bold text-uppercase shadow-sm"
                  style={{ fontSize: "12px" }}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>

            {/* 3. Paket Enterprise */}
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="product-card p-4 rounded-4 border border-secondary border-opacity-10 h-100 d-flex flex-column"
                style={{
                  backgroundColor: "rgba(11, 17, 32, 0.95)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <h4
                  className="fw-bold text-white mb-1"
                  style={{ fontSize: "1.2rem" }}
                >
                  Nocsphere Local <span style={{ fontSize: "15px" }}>v1.0</span>
                </h4>
                <span className="text-secondary small d-block mb-3">
                  Starting at
                </span>

                <h3
                  className="fw-black text-white mb-4"
                  style={{ fontSize: "2rem" }}
                >
                  Rp 3.500.000{" "}
                  <span
                    className="text-secondary fw-normal"
                    style={{ fontSize: "13px" }}
                  ></span>
                </h3>

                <ul
                  className="list-unstyled d-flex flex-column gap-2.5 flex-grow-1 mb-4"
                  style={{ fontSize: "13.5px" }}
                >
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Unlimited Mikrotik
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Unlimited Secrets
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i> VPN
                    Local
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Network Maps
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Sistem Isolasi Otomatis
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Notifikasi Whatsapp
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Payment Gateway Otomatis
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Portal Member
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Member
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Customer
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen Invoice
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Manajemen PPPoE
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i> Bot
                    Telegram
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Custom Logo
                  </li>
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Maintenance
                  </li>
                </ul>

                <button
                  className="btn btn-outline-light w-100 rounded-pill py-2 fw-bold text-uppercase"
                  style={{
                    fontSize: "12px",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WATERMARK SECTION */}
      <section className="footer-watermark-container bg-dark-custom py-5">
        <div className="py-4">
          <div className="footer-watermark-text text-nowrap">Nocsphere</div>
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
                Nocsphere provides high-performing billing management systems
                with unmatched reliability and automated isolation features.
              </p>
              <p className="fw-bold small mb-1">
                PT NocsphereInovasi Teknologi
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
