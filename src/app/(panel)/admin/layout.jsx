// app/(panel)/admin/layout.jsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

// Component listener untuk mendeteksi perubahan rute
function RouteChangeListener({ onRouteComplete }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onRouteComplete();
  }, [pathname, searchParams]);

  return null;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [loading, setLoading] = useState(true);

  const isActive = (path) => pathname === path;

  // Handle loading selesai saat pertama kali mount
  useEffect(() => {
    setLoading(false);
  }, []);

  // Prevent scroll saat mobile sidebar terbuka
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const navSections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", path: "/admin/dashboard", icon: "bi-grid-1x2-fill" },
      ],
    },
    {
      title: "Network & Infrastructure",
      items: [
        { label: "Routers / NAS", path: "/admin/routers", icon: "bi-hdd-network-fill" },
        { label: "Network Maps", path: "/admin/network-maps", icon: "bi-diagram-3-fill" },
      ],
    },
    {
      title: "PPPoE Management",
      items: [
        { label: "PPPoE Active", path: "/admin/pppoe/active", icon: "bi-activity" },
        { label: "PPPoE Secret", path: "/admin/pppoe/secrets", icon: "bi-key-fill" },
        { label: "PPPoE Profile", path: "/admin/pppoe/profile", icon: "bi-boxes" },
      ],
    },
    {
      title: "Billing & Clients",
      items: [
        { label: "Pelanggan", path: "/admin/pelanggan", icon: "bi-people-fill" },
        { label: "Paket", path: "/admin/paket", icon: "bi-box-seam-fill" },
        { label: "Invoice", path: "/admin/invoices", icon: "bi-receipt-cutoff" },
        { label: "Isolir", path: "/admin/isolir", icon: "bi-person-fill-lock" },
      ],
    },
    {
      title: "Integrations",
      items: [
        { label: "WhatsApp Gateway", path: "/admin/wa-gateaway", icon: "bi-whatsapp" },
        { label: "Bot Telegram", path: "/admin/telegram-bot", icon: "bi-telegram" },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Billing Settings", path: "/admin/settings/billing", icon: "bi-gear-wide-connected" },
        { label: "Page Settings", path: "/admin/settings/page", icon: "bi-sliders" },
        { label: "Profile Settings", path: "/admin/settings/profile", icon: "bi-person-gear" },
      ],
    },
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f4f6f9" }}>
      {/* Route listener untuk mematikan loading saat berpindah page */}
      <Suspense fallback={null}>
        <RouteChangeListener onRouteComplete={() => setLoading(false)} />
      </Suspense>

      {/* ================= GLOBAL LOADING OVERLAY ================= */}
      {loading && (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "2.8rem", height: "2.8rem", borderWidth: "0.22em" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="fw-semibold text-secondary fs-6">Memuat Halaman...</span>
        </div>
      )}

      <style jsx global>{`
        html, body {
          max-width: 100vw;
          overflow-x: hidden !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .syncara-dark-item {
          color: rgba(255, 255, 255, 0.65) !important;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease-in-out;
          border-radius: 10px !important;
          background-color: transparent;
        }
        .syncara-dark-item:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          color: #ffffff !important;
        }
        .syncara-dark-item.active-syncara {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .syncara-icon-box-dark {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }
        .syncara-dark-item.active-syncara .syncara-icon-box-dark {
          background-color: #2563eb;
          color: #ffffff;
        }
        .syncara-dark-item:not(.active-syncara) .syncara-icon-box-dark {
          background-color: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }
        .mobile-dark-nav-link {
          color: rgba(255, 255, 255, 0.75) !important;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-dark-nav-link.active-mobile {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff !important;
          font-weight: 600;
          border-left: 3px solid #2563eb;
        }

        /* Desktop Layout Wrapper Rules (280px) */
        @media (min-width: 768px) {
          .admin-sidebar-desktop {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            z-index: 1000;
          }
          .admin-content-wrapper {
            margin-left: 280px;
            width: calc(100% - 280px);
          }
        }
        @media (max-width: 767.98px) {
          .admin-content-wrapper {
            width: 100%;
            margin-left: 0;
          }
        }
      `}</style>

      {/* MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 z-3 d-md-none d-flex flex-column overflow-auto no-scrollbar"
          style={{ backgroundColor: "#0a1128" }}
        >
          <div className="px-3 py-3 border-bottom border-white border-opacity-10 d-flex align-items-center justify-content-between flex-shrink-0">
            <div className="d-flex align-items-center justify-content-start">
              {!logoError ? (
                <Image
                  src="/img/nocsphere.png"
                  alt="NOCSphere Logo"
                  width={130}
                  height={30}
                  style={{ objectFit: "contain" }}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <h5 className="fw-bold mb-0 text-white text-center">NOCSphere</h5>
              )}
            </div>
            <button
              className="btn rounded-circle p-2 d-flex align-items-center justify-content-center border-0 text-white flex-shrink-0"
              style={{ width: "38px", height: "38px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <i className="bi bi-x-lg fs-6"></i>
            </button>
          </div>

          <div className="px-3 py-3 border-bottom border-white border-opacity-10 d-flex align-items-center gap-3 flex-shrink-0">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-6 flex-shrink-0"
              style={{ width: "40px", height: "40px" }}
            >
              AE
            </div>
            <div className="overflow-hidden">
              <h6 className="fw-bold mb-0 text-white text-truncate" style={{ fontSize: "14px" }}>Alvinza Erza</h6>
              <span className="text-white-50 small text-truncate d-block" style={{ fontSize: "12px" }}>alvinza@nocsphere.net</span>
            </div>
          </div>

          <div className="p-3 flex-grow-1 overflow-y-auto no-scrollbar">
            {navSections.map((section) => (
              <div key={section.title} className="mb-3">
                <div className="text-uppercase fw-bold text-white-50 px-2 mb-1" style={{ fontSize: "10px", letterSpacing: "0.8px" }}>
                  {section.title}
                </div>
                <nav className="d-flex flex-column gap-1">
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => {
                          if (pathname !== item.path) setLoading(true);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`mobile-dark-nav-link ${active ? "active-mobile" : ""}`}
                      >
                        <i className={`bi ${item.icon} fs-6`}></i>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className="d-none d-md-flex flex-column justify-content-between p-3 admin-sidebar-desktop"
        style={{ backgroundColor: "#0a1128" }}
      >
        <div className="d-flex flex-column h-100 overflow-hidden">
          <div className="pt-2 pb-3 px-2 d-flex align-items-center justify-content-center border-bottom border-white border-opacity-10 mb-3 flex-shrink-0">
            {!logoError ? (
              <Image
                src="/img/nocsphere.png"
                alt="NOCSphere Logo"
                width={170}
                height={38}
                style={{ objectFit: "contain", height: "auto" }}
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <h5 className="fw-bold mb-0 text-white text-center">NOCSphere</h5>
            )}
          </div>

          <div className="overflow-y-auto no-scrollbar flex-grow-1 pe-1">
            {navSections.map((section) => (
              <div key={section.title} className="mb-3">
                <div className="text-uppercase fw-bold text-white-50 px-3 mb-1" style={{ fontSize: "10px", letterSpacing: "0.8px" }}>
                  {section.title}
                </div>
                <nav className="nav flex-column gap-1">
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => {
                          if (pathname !== item.path) setLoading(true);
                        }}
                        className={`nav-link syncara-dark-item px-3 py-2 d-flex align-items-center gap-3 ${
                          active ? "active-syncara" : ""
                        }`}
                      >
                        <div className="syncara-icon-box-dark">
                          <i className={`bi ${item.icon}`}></i>
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="admin-content-wrapper d-flex flex-column min-vh-100">
        <header
          className="bg-white border-bottom px-3 px-md-4 py-2 d-flex align-items-center justify-content-between flex-shrink-0"
          style={{ minHeight: "64px" }}
        >
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-light d-md-none border-0 p-2 text-dark rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <span className="fw-semibold text-dark d-md-none fs-6"></span>
          </div>

          <div className="d-flex align-items-center gap-2 gap-sm-3">
            <button
              className="btn btn-light rounded-circle position-relative p-2 d-flex align-items-center justify-content-center text-secondary border-0"
              style={{ width: "38px", height: "38px" }}
            >
              <i className="bi bi-bell fs-6"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>

            <div className="vr d-none d-sm-block my-2 text-muted opacity-25"></div>

            <div className="d-flex align-items-center gap-2">
              <div className="text-end d-none d-sm-block">
                <div className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                  Alvinza Erza
                </div>
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  Superadmin
                </div>
              </div>
              <div
                className="bg-primary-subtle border border-primary-subtle rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary flex-shrink-0"
                style={{ width: "38px", height: "38px", fontSize: "13px" }}
              >
                AE
              </div>
            </div>
          </div>
        </header>

        <main className="p-3 p-md-4 flex-grow-1 overflow-x-hidden">{children}</main>

        <footer
          className="container bg-white pt-5 pb-4 border-top border-secondary border-opacity-10 position-relative"
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
                  <img className="me-2" src="/img/nocsphere_black.png" alt="NocSphere Logo" width="100" />
                </a>
                <p
                  className="small lh-lg mb-3"
                  style={{ maxWidth: "350px" }}
                >
                  NocSphere provides high-performing billing management systems
                  with unmatched reliability and automated isolation features.
                </p>
                <p className="fw-bold small mb-1">
                  PT NocSphere Inovasi Teknologi
                </p>
                <p className="small mb-3">
                  Serving the best web billing management community
                </p>

                <div className="d-flex gap-2">
                  <span className="text-dark badge bg-secondary bg-opacity-10 border border-secondary border-opacity-20 px-2 py-1.5 small">
                    Stripe Verified
                  </span>
                  <span className="text-dark badge bg-secondary bg-opacity-10 border border-secondary border-opacity-20 px-2 py-1.5 small">
                    PCI Compliant
                  </span>
                </div>
              </div>

              <div className="col-lg-8 col-md-12">
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 g-4">
                  <div>
                    <h6 className="text-dark fw-bold footer-heading text-uppercase mb-3">
                      Solutions
                    </h6>
                    <div className="d-flex flex-column">
                      <a href="#" className="text-dark footer-link-custom">
                        PPPoE Accounts
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Hotspot Voucher
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Multi Router API
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Payment Gateway
                      </a>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-dark fw-bold footer-heading text-uppercase mb-3">
                      Legal
                    </h6>
                    <div className="d-flex flex-column">
                      <a href="#" className="text-dark footer-link-custom">
                        Fair Use
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Terms
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Privacy
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        SLA
                      </a>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-dark fw-bold footer-heading text-uppercase mb-3">
                      Services
                    </h6>
                    <div className="d-flex flex-column">
                      <a href="#" className="text-dark footer-link-custom">
                        Client Area
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Status
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
                        Discord
                      </a>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-dark fw-bold footer-heading text-uppercase mb-3">
                      Resources
                    </h6>
                    <div className="d-flex flex-column">
                      <a href="#" className="text-dark footer-link-custom">
                        Documentation
                      </a>
                      <a href="#" className="text-dark footer-link-custom">
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
              <span className="small">
                &copy; 2026 NocSphere. All rights reserved.
              </span>
              <div className="text-dark d-flex gap-3 fs-5 social-links">
                <a href="#">
                  <i className="text-dark fa-brands fa-discord"></i>
                </a>
                <a href="#">
                  <i className="text-dark fa-brands fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="text-dark fa-brands fa-youtube"></i>
                </a>
                <a href="#">
                  <i className="text-dark fa-brands fa-tiktok"></i>
                </a>
                <a href="#">
                  <i className="text-dark fa-brands fa-github"></i>
                </a>
                <a href="#">
                  <i className="text-dark fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}