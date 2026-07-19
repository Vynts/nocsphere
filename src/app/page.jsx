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
                <img className="me-2" src="/img/nocsphere.png" alt="Logo" width="100" />
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
                    <a className="nav-link active" href="/">
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

          <div className="row py-5 my-5 justify-content-center text-center">
            <div className="col-lg-9 my-3">
              <h1 className="display-4 d-flex flex-column hero-title fw-bold mb-3" style={{ fontSize: "65px" }}>
                Best Solution for
                <span className="text-white-50">Your MikroTik Business</span>
              </h1>
              <p
                className="text-white-50 mx-auto mb-4 px-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: "800px",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  letterSpacing: "-0.01em",
                }}
              >
                Enterprise-grade billing management system to automate your ISP
                or RT/RW Net business.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 px-4">
                <a href="#" className="btn btn-custom-light">
                  Get Started{" "}
                  <i
                    className="fa-solid fa-arrow-right ms-1"
                    style={{ fontSize: "12px" }}
                  ></i>
                </a>
                <a href="#" className="btn btn-custom-outline">
                  Live Demo
                </a>
              </div>
            </div>

            <div className="row justify-content-center mt-5">
              <div className="col-12 col-md-12 col-lg-10">
                <div
                  className="ratio ratio-16x9 overflow-hidden shadow-lg"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <iframe
                    src="https://www.youtube.com/embed/OlmuFRInGg?si=1tWbuOW5gLYweetD"
                    title="NocSphere Demo Video"
                    allowFullScreen
                    style={{ borderRadius: "16px" }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOLUTIONS SECTION */}
      <section className="py-5 position-relative">
        <div className="container py-4">
          {/* Judul Atas */}
          <div className="text-center mb-5">
            <span className="text-uppercase text-muted tracking-wider small fw-bold">
              SOLUTIONS
            </span>
            <h2 className="fw-bold mt-1">Our Billing Pricelist</h2>
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
                    5.000 Secrets
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
                  Rp 3.500.000 <br />
                  <span
                    className="text-secondary fw-normal"
                    style={{ fontSize: "13px" }}
                  >Instalasi nocpshere di Server Lokal</span>
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
                  <li className="text-secondary d-flex align-items-center gap-2 my-1">
                    <i className="bi bi-check-circle-fill text-primary"></i>{" "}
                    Panduan Instalasi
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

      {/* WHY CHOOSE US SECTION */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="text-uppercase text-muted tracking-wider small fw-bold">
            Why Choose Us
          </span>
          <h2 className="fw-bold mt-1">Built for Performance</h2>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-sm-10 col-md-6">
            <div className="feature-card p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="icon-box mb-3">
                  <i className="fa-solid fa-sliders"></i>
                </div>
                <h5 className="fw-bold mb-2">Feature Rich Control Panel</h5>
                <p className="text-muted small mb-4">
                  Introducing our billing game-changer dashboard, built with
                  features that will simplify your ISP business management.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                alt="Control Panel Preview"
                className="img-fluid rounded-3 mt-2"
                style={{
                  maxHeight: "200px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          <div className="col-sm-10 col-md-6 d-flex flex-column gap-4">
            <div className="feature-card p-4">
              <div className="icon-box mb-3">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <h5 className="fw-bold mb-2">High Efficiency API Queries</h5>
              <p className="text-muted small mb-0">
                We use high-optimized asynchronous Python scripts to query
                MikroTik data, ensuring your Router CPU usage stays minimal.
              </p>
            </div>
            <div className="feature-card p-4">
              <div className="icon-box mb-3">
                <i className="fa-solid fa-eye"></i>
              </div>
              <h5 className="fw-bold mb-2">Data Transparency & Analytics</h5>
              <p className="text-muted small mb-0">
                Track exact data usage, payment reports, log files, and
                bandwidth utilization anytime without hidden summaries.
              </p>
            </div>
          </div>

          <div className="col-sm-12 col-12 mt-2">
            <div className="feature-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 w-100">
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                <div className="icon-box">
                  <i className="fa-brands fa-telegram"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Active Community</h5>
                  <p className="text-muted small mb-0">
                    We have an active community filled with enthusiastic gamers
                    and developers, we also have a 24/7 support team.
                  </p>
                </div>
              </div>
              <div className="d-grid d-md-block mt-2 mt-md-0">
                <a href="#" className="btn-join-discord text-nowrap">
                  Join Now{" "}
                  <i
                    className="fa-solid fa-arrow-right ms-2"
                    style={{ fontSize: "13px" }}
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION FAQ REFERENSI WHITE MODE (IMAGE_788718.PNG) ================= */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#ffffff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="container py-5">
          <div className="row g-4">
            {/* SISI KIRI: JUDUL UTAMA DAN SUB-TEKS (WHITE MODE) */}
            <div className="col-12 col-lg-5 text-start pe-lg-5">
              <span
                className="text-muted small fw-mono d-block mb-2"
                style={{ letterSpacing: "1px" }}
              >
                // FAQ
              </span>
              <h2
                className="fw-bold text-dark display-5 mb-3"
                style={{ letterSpacing: "-0.04em", color: "#0f172a" }}
              >
                Questions?{" "}
                <span
                  className="text-muted opacity-50"
                  style={{ fontWeight: "400" }}
                >
                  We've got answers.
                </span>
              </h2>
              <p
                className="text-secondary small"
                style={{ letterSpacing: "-0.01em" }}
              >
                For support, please open an issue on GitHub.
              </p>
            </div>

            {/* SISI KANAN: ACCORDION MINIMALIS (WHITE MODE) */}
            <div className="col-12 col-lg-7">
              <div
                className="accordion accordion-flush d-flex flex-column gap-3"
                id="faqNocSphereWhite"
              >
                {/* FAQ 1 */}
                <div className="accordion-item bg-transparent border-0">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed text-dark fw-semibold px-4 py-3 d-flex justify-content-between align-items-center w-100"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#white-1"
                      aria-expanded="false"
                      style={{
                        backgroundColor: "#f8fafc", // Abu-abu sangat muda/bersih
                        borderRadius: "12px",
                        boxShadow: "none",
                        border: "1px solid rgba(15, 23, 42, 0.05)",
                        color: "#0f172a",
                      }}
                    >
                      <span>
                        Apakah NocSphere mendukung MikroTik RouterOS v7?
                      </span>
                      <i className="bi bi-plus-lg fs-6 faq-icon ms-2 text-muted"></i>
                    </button>
                  </h2>
                  <div
                    id="white-1"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqNocSphereWhite"
                  >
                    <div
                      className="accordion-body text-secondary small px-4 pb-4 pt-2"
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "0 0 12px 12px",
                        marginTop: "-10px",
                        border: "1px solid rgba(15, 23, 42, 0.05)",
                        borderTop: "none",
                      }}
                    >
                      Yes, NocSphere is fully compatible with both RouterOS v6
                      and v7 API connections built for stability.
                    </div>
                  </div>
                </div>

                {/* FAQ 2 */}
                <div className="accordion-item bg-transparent border-0">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed text-dark fw-semibold px-4 py-3 d-flex justify-content-between align-items-center w-100"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#white-2"
                      aria-expanded="false"
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        boxShadow: "none",
                        border: "1px solid rgba(15, 23, 42, 0.05)",
                        color: "#0f172a",
                      }}
                    >
                      <span>
                        Bagaimana sistem isolasi otomatis (isolir) bekerja?
                      </span>
                      <i className="bi bi-plus-lg fs-6 faq-icon ms-2 text-muted"></i>
                    </button>
                  </h2>
                  <div
                    id="white-2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqNocSphereWhite"
                  >
                    <div
                      className="accordion-body text-secondary small px-4 pb-4 pt-2"
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "0 0 12px 12px",
                        marginTop: "-10px",
                        border: "1px solid rgba(15, 23, 42, 0.05)",
                        borderTop: "none",
                      }}
                    >
                      Sistem akan memindahkan secret/profile pelanggan yang masa
                      aktifnya habis ke address-list isolir via API secara
                      realtime.
                    </div>
                  </div>
                </div>

                {/* FAQ 3 */}
                <div className="accordion-item bg-transparent border-0">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed text-dark fw-semibold px-4 py-3 d-flex justify-content-between align-items-center w-100"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#white-3"
                      aria-expanded="false"
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        boxShadow: "none",
                        border: "1px solid rgba(15, 23, 42, 0.05)",
                        color: "#0f172a",
                      }}
                    >
                      <span>Payment gateway apa saja yang didukung?</span>
                      <i className="bi bi-plus-lg fs-6 faq-icon ms-2 text-muted"></i>
                    </button>
                  </h2>
                  <div
                    id="white-3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqNocSphereWhite"
                  >
                    <div
                      className="accordion-body text-secondary small px-4 pb-4 pt-2"
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "0 0 12px 12px",
                        marginTop: "-10px",
                        border: "1px solid rgba(15, 23, 42, 0.05)",
                        borderTop: "none",
                      }}
                    >
                      Kami mendukung penuh integrasi otomatis dengan Midtrans untuk pembayaran QRIS dan VA Bank.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animasi Putar Ikon Menjadi Silang (✕) */}
        <style jsx global>{`
          .accordion-button::after {
            display: none !important;
          }
          .accordion-button:not(.collapsed) .faq-icon {
            transform: rotate(45deg);
            color: #000 !important;
          }
          .accordion-button .faq-icon {
            transition: transform 0.2s ease-in-out;
          }
        `}</style>
      </section>

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
