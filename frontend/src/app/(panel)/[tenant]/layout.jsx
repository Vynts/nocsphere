"use client";

import React, { useState, useEffect } from "react";

export default function NavbarAndSidebar() {
  // --- 1. STATE MANAGEMENT ---
  const [theme, setThemeState] = useState('auto');
  const [timeString, setTimeString] = useState('00:00:00');
  const [dateString, setDateString] = useState('Loading...');

  const STORAGE_KEY = 'lte-theme';

  // --- 2. LOGIKA TEMA (DARK/LIGHT MODE) ---
  const prefersDark = () => typeof window !== 'undefined' && globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches;

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return prefersDark() ? 'dark' : 'light';
  };

  const applyTheme = (currentTheme) => {
    const resolved = currentTheme === 'auto' ? (prefersDark() ? 'dark' : 'light') : currentTheme;
    document.documentElement.setAttribute('data-bs-theme', resolved);
  };

  const handleThemeChange = (newTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || stored === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery?.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery?.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // --- 3. LOGIKA JAM DIGITAL ---
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);

      const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      setDateString(now.toLocaleDateString('id-ID', options));
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <html lang="id" data-bs-theme="light">
      <head>
        <meta
          name="theme-color"
          content="#007bff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1a1a1a"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="supported-color-schemes" content="light dark" />

        {/* Fonts & Plugins CDN dari HTML-mu */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/source-sans-3@5.0.12/index.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/styles/overlayscrollbars.min.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.css"
          crossOrigin="anonymous"
        />

        {/* SweetAlert2 */}
        <script
          src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
          async
        ></script>

        {/* CSS Lokal AdminLTE (diambil dari folder public/css/) */}
        <link rel="stylesheet" href="/css/adminlte.css" />
      </head>

      {/* Sesuai standar AdminLTE v4, body menggunakan class layout-fixed */}
      <body className="layout-fixed sidebar-expand-lg bg-body-tertiary">
        <div className="app-wrapper">
          {/* HEADER NAVBAR */}
          <nav className="app-header navbar navbar-expand bg-body">
            {/* begin::Container */}
            <div className="container-fluid">
              {/* begin::Start Navbar Links */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-lte-toggle="sidebar"
                    href="#"
                    role="button"
                  >
                    <i className="bi bi-list"></i>
                  </a>
                </li>
              </ul>
              {/* end::Start Navbar Links */}

              <div className="nav-item d-flex align-items-center my-1 px-2 navbar-clock-wrapper">
                {/* Teks Jam & Tanggal */}
                <div className="d-flex align-items-end text-end">
                  <span id="digital-clock" className="clock-time mx-2">
                    00:00:00
                  </span>
                  <span id="digital-date" className="clock-date mx-2">
                    Loading...
                  </span>
                </div>
              </div>

              {/* begin::End Navbar Links */}
              <ul className="navbar-nav ms-auto">
                {/* begin::Fullscreen Toggle */}
                <li className="nav-item">
                  <a
                    className="nav-links"
                    href="#"
                    data-lte-toggle="fullscreen"
                  >
                    <i
                      data-lte-icon="maximize"
                      className="bi bi-arrows-fullscreen"
                    ></i>
                    <i
                      data-lte-icon="minimize"
                      className="bi bi-fullscreen-exit d-none"
                    ></i>
                  </a>
                </li>
                {/* end::Fullscreen Toggle */}

                {/* begin::Color Mode Toggle */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link"
                    href="#"
                    id="bd-theme"
                    aria-label="Toggle color scheme"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i
                      className="bi bi-sun-fill"
                      data-lte-theme-icon="light"
                    ></i>
                    <i
                      className="bi bi-moon-fill d-none"
                      data-lte-theme-icon="dark"
                    ></i>
                    <i
                      className="bi bi-circle-half d-none"
                      data-lte-theme-icon="auto"
                    ></i>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="bd-theme"
                    style={{ "--bs-dropdown-min-width": "8rem" }}
                  >
                    <li>
                      <button
                        type="button"
                        className="dropdown-item d-flex align-items-center"
                        data-bs-theme-value="light"
                        aria-pressed="false"
                      >
                        <i className="bi bi-sun-fill me-2"></i>
                        Light
                        <i className="bi bi-check-lg ms-auto d-none"></i>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item d-flex align-items-center"
                        data-bs-theme-value="dark"
                        aria-pressed="false"
                      >
                        <i className="bi bi-moon-fill me-2"></i>
                        Dark
                        <i className="bi bi-check-lg ms-auto d-none"></i>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item d-flex align-items-center active"
                        data-bs-theme-value="auto"
                        aria-pressed="true"
                      >
                        <i className="bi bi-circle-half me-2"></i>
                        Auto
                        <i className="bi bi-check-lg ms-auto d-none"></i>
                      </button>
                    </li>
                  </ul>
                </li>
                {/* end::Color Mode Toggle */}

                {/* begin::User Menu Dropdown */}
                <li className="nav-item dropdown user-menu">
                  <a
                    href="#"
                    class="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="../assets/img/user2-160x160.jpg"
                      className="user-image rounded-circle shadow"
                      alt="User Image"
                    />
                    <span className="d-none d-md-inline">Mikrotik Admin</span>
                  </a>
                </li>
                {/* end::User Menu Dropdown */}
              </ul>
              {/* end::End Navbar Links */}
            </div>
            {/* end::Container */}
          </nav>
          {/* end::Header */}

          {/* SIDEBAR */}
          <aside
            className="app-sidebar bg-body-secondary shadow"
            data-bs-theme="dark"
          >
            {/* begin::Sidebar Brand */}
            <div className="sidebar-brand">
              {/* begin::Brand Link */}
              <a href="../src/index.html" className="brand-link">
                {/* begin::Brand Image */}
                <img
                  src="img/tink_net.jpg"
                  alt=""
                  className="brand-image opacity-75 shadow rounded-1"
                />
                {/* end::Brand Image */}
                {/* begin::Brand Text */}
                <span className="brand-text fw-light">NocSphere</span>
                {/* end::Brand Text */}
              </a>
              {/* end::Brand Link */}
            </div>
            {/* end::Sidebar Brand */}

            {/* begin::Sidebar Wrapper */}
            <div className="sidebar-wrapper">
              <nav className="mt-2">
                {/* begin::Sidebar Menu */}
                <ul
                  className="nav sidebar-menu flex-column"
                  data-lte-toggle="treeview"
                  role="navigation"
                  aria-label="Main navigation"
                  data-accordion="false"
                  id="navigation"
                >
                  <li className="nav-header fw-bold text-secondary">GENERAL</li>

                  <li className="nav-item">
                    <a href="../index.html" className="nav-link">
                      <i className="nav-icon bi bi-house"></i>
                      <p className="fw-bold">Dashboard</p>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a href="./pages/monitoring.html" className="nav-link">
                      <i className="nav-icon bi bi-hdd-stack"></i>
                      <p className="fw-bold">Monitoring</p>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a href="./widgets/cards.html" className="nav-link">
                      <i className="nav-icon bi bi-globe-americas"></i>
                      <p className="fw-bold">Maps</p>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="nav-icon bi bi-router"></i>
                      <p className="fw-bold">Mikrotik (Nas)</p>
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <a href="./pages/add_router.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Tambah Data</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./pages/router.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Data Mikrotik</p>
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="nav-icon bi bi-hdd-network"></i>
                      <p className="fw-bold">PPPoE</p>
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <a href="./pages/active.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Active</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./pages/secret.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Secret</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./pages/profile.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Profile</p>
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a href="./pages/pelanggan.html" className="nav-link">
                      <i className="nav-icon bi bi-people"></i>
                      <p className="fw-bold">Pelanggan</p>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a href="../pages/invoice.html" className="nav-link">
                      <i className="nav-icon bi bi-file-earmark-text"></i>
                      <p className="fw-bold">Invoice</p>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="nav-icon bi bi-terminal"></i>
                      <p className="fw-bold">Logs</p>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="nav-icon bi bi-grid-1x2"></i>
                      <p className="fw-bold">Settings</p>
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <a href="./index.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Dashboard v1</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./index2.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Dashboard v2</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./index3.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Dashboard v3</p>
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-header fw-bold text-secondary">
                    CUSTOMERS
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="nav-icon bi bi-front"></i>
                      <p className="fw-bold">Billing</p>
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <a href="./index2.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Payment Gateway</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./index2.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Isolir</p>
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="nav-icon bi bi-whatsapp"></i>
                      <p className="fw-bold">WhatsApp Gateway</p>
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <a href="./index2.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Agent</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./index2.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Template</p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="./index3.html" className="nav-link">
                          <i className="nav-icon-child bi bi-circle-fill"></i>
                          <p>Message History</p>
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a href="../pages/invoice.html" className="nav-link">
                      <i className="nav-icon bi bi-chat-dots"></i>
                      <p className="fw-bold">EVoucher Bot</p>
                    </a>
                  </li>
                </ul>
                {/* end::Sidebar Menu */}
              </nav>
            </div>
            {/* end::Sidebar Wrapper */}
          </aside>
          {children}
        </div>
      </body>
    </html>
  );
}
