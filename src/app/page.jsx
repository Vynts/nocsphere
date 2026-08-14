// src/app/(auth)/page.jsx
'use client';

import React, { useState, useEffect } from 'react';

const promoCardsData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    alt: 'Promo Banner 1',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    alt: 'Promo Banner 2',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    alt: 'Promo Banner 3',
  },
];

const wifiPackagesData = [
  {
    id: 'pkg-1',
    name: 'Paket Home Basic',
    speed: '10 Mbps',
    price: 'Rp 150.000',
    period: '/bulan',
    features: [
      'Unlimited Tanpa FUP',
      'Cocok untuk 1 - 3 Perangkat',
      'Koneksi Stabil & Fiber Optic',
      'Gratis Biaya Pemeliharaan',
      'Dukungan Layanan Pelanggan',
    ],
    buttonText: 'Pilih Paket',
    popular: false,
  },
  {
    id: 'pkg-2',
    name: 'Paket Home Family',
    speed: '20 Mbps',
    price: 'Rp 250.000',
    period: '/bulan',
    features: [
      'Unlimited Tanpa FUP',
      'Cocok untuk 4 - 8 Perangkat',
      'Streaming HD & Gaming Lancar',
      'Prioritas Router Bandwidth',
      'Gratis Biaya Pemeliharaan',
      'Dukungan Pelanggan 24/7',
    ],
    buttonText: 'Pilih Paket',
    popular: true,
  },
  {
    id: 'pkg-3',
    name: 'Paket Business Pro',
    speed: '50 Mbps',
    price: 'Rp 500.000',
    period: '/bulan',
    features: [
      'Unlimited Tanpa FUP',
      'Cocok untuk Usaha / Kantor / Cafe',
      'Bandwidth Simetris (Upload/Download)',
      'IP Publik (Opsional)',
      'Prioritas Perbaikan Gangguan',
    ],
    buttonText: 'Hubungi Kami',
    popular: false,
  },
];

export default function NocsphereLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State untuk Slider (Per 2 detik)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Duplikasi data gambar agar animasi looping tidak terputus
  const extendedPromoCards = [...promoCardsData, ...promoCardsData];

  // Handling Scroll & Refresh State
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    const timeoutId = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect Timer Geser Slider Setiap 2 Detik
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleTransitionEnd = () => {
    if (currentIndex >= promoCardsData.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="noc-page-wrapper d-flex flex-column min-vh-100 position-relative">

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/628123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="noc-floating-wa-btn"
        aria-label="Tanya Admin"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.17-.478 1.338-.94.166-.462.166-.856.116-.94-.05-.083-.182-.133-.38-.232" />
        </svg>
        <span>Tanya Admin</span>
      </a>

      {/* NAVBAR FIXED */}
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top noc-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="/img/nocsphere.png"
              alt="NocSphere Logo"
              className="noc-logo-img"
            />
          </a>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              <li className="nav-item noc-nav-item">
                <a className="nav-link active" href="#home">Home</a>
              </li>
              <li className="nav-item noc-nav-item">
                <a className="nav-link" href="#paket">Paket Internet</a>
              </li>
              <li className="nav-item noc-nav-item">
                <a className="nav-link" href="#bantuan">Bantuan</a>
              </li>
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <a className="btn btn-nav-login shadow-sm w-100 w-lg-auto" href="/login">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO HEADER (JUDUL SUDAH DIBREAK DENGAN <br />) */}
      <header id="home" className="hero-section-with-bg">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 text-center">
              <h1 className="fw-bold text-white mb-3 hero-title">
                <span>PORTAL LAYANAN INTERNET &amp; </span>
                <span>PEMBAYARAN WIFI ONLINE</span>
              </h1>
              <p className="text-muted-custom hero-subtitle mx-auto mb-0">
                Layanan internet ultra-cepat unlimited tanpa FUP. Nikmati kemudahan cek tagihan bulanan dan pembayaran otomatis instan.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* FORM CEK ID & SLIDER */}
      <section id="pembayaran" className="pb-2">
        <div className="container">
          <div className="payment-search-container mb-4">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-3 mb-lg-0">
                <h5 className="text-white fw-bold mb-1 fs-6 fs-md-5">
                  Cek Tagihan Pelanggan
                </h5>
                <p className="text-muted-custom mb-0 small">
                  Masukkan ID Pelanggan Anda untuk melihat rincian tagihan dan memilih metode pembayaran.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="input-group payment-input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan ID Pelanggan (contoh: ID-10293)"
                    aria-label="ID Pelanggan"
                  />
                  <button className="btn btn-search-noc" type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                    <span>Cari</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="step-slider-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="step-slider-track"
              style={{
                transform: `translateX(calc(-${currentIndex} * (var(--noc-card-width) + var(--noc-card-gap))))`,
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedPromoCards.map((card, idx) => (
                <div key={idx} className="promo-img-card">
                  <img src={card.image} alt={card.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAKET INTERNET (CARD SUDAH LEBIH KONTRAS & MEMENONJOL) */}
      <section id="paket" className="full-packages-section">
        <div className="container">
          <div className="text-center mb-4 mb-md-5">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-2">
              PILIHAN TERBAIK
            </span>
            <h2 className="fw-bold text-dark fs-3 fs-md-2">Pilihan Paket Internet</h2>
            <p className="text-secondary small">
              Pilihan paket langganan internet unlimited sesuai kebutuhan rumah atau bisnis Anda.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {wifiPackagesData.map((plan) => (
              <div key={plan.id} className="col-lg-4 col-md-6">
                <div className={`card h-100 noc-card-price-light position-relative ${plan.popular ? 'border-primary' : ''}`}>
                  {plan.popular && (
                    <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary px-3 py-2 text-uppercase fs-7 shadow-sm">
                      Terfavorit
                    </span>
                  )}
                  <div className="card-header text-center">
                    <h5 className="text-dark fw-bold mb-0">{plan.name}</h5>
                    <span className="badge bg-primary-subtle text-primary mt-2 px-3 py-1 fw-semibold">{plan.speed}</span>
                  </div>
                  <div className="card-body d-flex flex-column text-center p-4">
                    <h3 className="card-title text-dark fw-bold my-2 fs-3">
                      {plan.price}
                      <span className="fs-6 text-secondary fw-normal">{plan.period}</span>
                    </h3>
                    <hr className="my-3 opacity-25" />
                    <ul className="price-feature-list-light text-start flex-grow-1">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex}>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#pembayaran"
                      className={`btn mt-4 rounded-pill py-2 fw-semibold ${
                        plan.popular ? 'btn-primary shadow-sm' : 'btn-outline-primary'
                      }`}
                    >
                      {plan.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="bantuan" className="noc-footer mt-auto">
        <div className="footer-glow-bg"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6">
              <a className="d-inline-block mb-3" href="#">
                <img
                  src="/img/nocsphere.png"
                  alt="NocSphere Logo"
                  className="noc-footer-logo-img"
                />
              </a>
              <p className="text-muted-custom small mb-0">
                Penyedia layanan jaringan internet cepat, stabil, dan terjangkau untuk kebutuhan rumah serta tempat usaha Anda.
              </p>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white fw-semibold mb-3 fs-6">Layanan</h6>
              <ul className="list-unstyled small mb-0">
                <li className="mb-2">
                  <a href="#pembayaran" className="text-muted-custom text-decoration-none footer-link-item">Cek Tagihan</a>
                </li>
                <li className="mb-2">
                  <a href="#paket" className="text-muted-custom text-decoration-none footer-link-item">Paket Wifi</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white fw-semibold mb-3 fs-6">Bantuan</h6>
              <ul className="list-unstyled small mb-0">
                <li className="mb-2">
                  <a href="#" className="text-muted-custom text-decoration-none footer-link-item">Lapor Gangguan</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted-custom text-decoration-none footer-link-item">Panduan Bayar</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted-custom text-decoration-none footer-link-item">Kontak Admin</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6 className="text-white fw-semibold mb-3 fs-6">Layanan Pelanggan</h6>
              <p className="text-muted-custom small mb-0">
                Ada kendala dengan jaringan wifi Anda atau ingin bantuan pasang baru? Hubungi tim support kami melalui tombol melayang di pojok kanan bawah.
              </p>
            </div>
          </div>

          <div className="animated-footer-divider"></div>

          <div className="row align-items-center gy-3">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-muted-custom small mb-0">
                &copy; {new Date().getFullYear()} Nocsphere Network. All rights reserved.
              </p>
            </div>
            
            <div className="col-md-6 text-center text-md-end">
              <a 
                href="https://nocsphere.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="integrated-link-badge"
              >
                <span className="integrated-text-style">
                  Integrated with <span>nocsphere.id</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}