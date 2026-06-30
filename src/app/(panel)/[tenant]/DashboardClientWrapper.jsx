"use client";

import React, { useEffect, useState } from "react";

export default function DashboardClientWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. Sinkronisasi Class Body AdminLTE
  useEffect(() => {
    const body = document.body;
    body.className =
      "layout-fixed sidebar-expand-lg sidebar-mini sidebar-without-hover bg-body-tertiary";

    if (isSidebarOpen) {
      body.classList.add("sidebar-open");
      body.classList.remove("sidebar-collapse");
    } else {
      body.classList.add("sidebar-collapse");
      body.classList.remove("sidebar-open");
    }

    return () => {
      body.className = "";
    };
  }, [isSidebarOpen]);

  // 2. Load Script & Inisialisasi OverlayScrollbars + AdminLTE JS
  useEffect(() => {
    // Inject Bootstrap Bundle
    const bootstrapScript = document.createElement("script");
    bootstrapScript.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js";
    bootstrapScript.async = true;
    document.body.appendChild(bootstrapScript);

    // Inject OverlayScrollbars Browser Script (Wajib untuk sidebar AdminLTE v4)
    const osScript = document.createElement("script");
    osScript.src =
      "https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/browser/overlayscrollbars.browser.es6.min.js";
    osScript.async = false; // Set false agar dimuat berurutan sebelum adminlte.js
    document.body.appendChild(osScript);

    // Inject AdminLTE Script
    const adminLteScript = document.createElement("script");
    adminLteScript.src = "/js/adminlte.min.js";
    adminLteScript.async = false;
    document.body.appendChild(adminLteScript);

    // Tunggu hingga script termuat untuk inisialisasi scrollbar sidebar
    const initPlugins = () => {
      if (
        window.OverlayScrollbarsGlobal &&
        window.OverlayScrollbarsGlobal.OverlayScrollbars
      ) {
        const sidebarWrapper = document.querySelector(".sidebar-wrapper");
        if (sidebarWrapper) {
          window.OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
            scrollbars: {
              theme: "os-theme-light",
              autoHide: "leave",
              clickScroll: true,
            },
          });
        }
      }
    };

    // Jalankan inisialisasi setelah script selesai dimuat di DOM
    osScript.onload = () => {
      initPlugins();
    };

    // Logika Jam Digital
    const updateClock = () => {
      const now = new Date();
      
      // 1. Update elemen Jam
      const clockEl = document.getElementById("digital-clock");
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString("id-ID", {
          hour12: false,
        });
      }

      // 2. Update elemen Tanggal (Ini yang sebelumnya belum ada!)
      const dateEl = document.getElementById("digital-date");
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    };

    // Jalankan sekali secara langsung agar teks tidak "Loading..." selama 1 detik pertama
    updateClock(); 
    const clockInterval = setInterval(updateClock, 1000);

    return () => {
      clearInterval(clockInterval);
      if (document.body.contains(bootstrapScript))
        document.body.removeChild(bootstrapScript);
      if (document.body.contains(osScript)) document.body.removeChild(osScript);
      if (document.body.contains(adminLteScript))
        document.body.removeChild(adminLteScript);
    };
  }, []);

  return (
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
              <a className="nav-links" href="#" data-lte-toggle="fullscreen">
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

            {/* begin::User Menu Dropdown */}
            <li className="nav-item dropdown user-menu">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/img/user.webp"
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
              src="/img/tink_net.jpg"
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

              <li className="nav-header fw-bold text-secondary">CUSTOMERS</li>

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
                  <i className="nav-icon bi bi-telegram"></i>
                  <p className="fw-bold">Telegram Bot</p>
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
  );
}
