"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Component listener untuk mendeteksi perubahan rute & reset scroll
function RouteChangeListener({ onRouteComplete }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    onRouteComplete();
  }, [pathname, searchParams]);

  return null;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter notifikasi ('all' atau 'unread')
  const [notificationTab, setNotificationTab] = useState("all");

  // Sample data notifikasi
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Router Disconnected",
      message: "Router 'MTR-Jkt-01' kehilangan koneksi.",
      time: "5 mnt yang lalu",
      read: false,
    },
    {
      id: 2,
      title: "Pembayaran Diterima",
      message: "Invoice #INV-2026-0891 telah dibayar via Midtrans.",
      time: "25 mnt yang lalu",
      read: false,
    },
    {
      id: 3,
      title: "Pelanggan Baru",
      message: "Budi Santoso terdaftar pada paket 50 Mbps.",
      time: "2 jam yang lalu",
      read: true,
    },
    {
      id: 4,
      title: "Isolir Otomatis",
      message: "3 akun PPPoE telah di-isolir karena jatuh tempo.",
      time: "1 hari yang lalu",
      read: true,
    },
  ]);

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const isActive = (path) => pathname === path;

  // Hitung notifikasi belum dibaca
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter notifikasi sesuai tab aktif
  const filteredNotifications = notifications.filter((n) => {
    if (notificationTab === "unread") return !n.read;
    return true;
  });

  // Handle Initial Load & Fix Reload Scroll Position Bug
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
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

  // Click outside listener untuk profile & notification dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close overlays saat rute berubah
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  }, [pathname]);

  // Tandai semua notifikasi sudah dibaca
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Tandai satu notifikasi sudah dibaca
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Handle Logout
  const handleLogout = () => {
    setLoading(true);
    setIsProfileDropdownOpen(false);
    router.push("/login");
  };

  const navSections = [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: "bi-grid-1x2-fill",
        },
      ],
    },
    {
      title: "Network & Infrastructure",
      items: [
        {
          label: "Routers / NAS",
          path: "/admin/routers",
          icon: "bi-hdd-network-fill",
        },
        {
          label: "Network Maps",
          path: "/admin/network-maps",
          icon: "bi-diagram-3-fill",
        },
      ],
    },
    {
      title: "PPPoE Management",
      items: [
        {
          label: "PPPoE Active",
          path: "/admin/pppoe/active",
          icon: "bi-activity",
        },
        {
          label: "PPPoE Secret",
          path: "/admin/pppoe/secrets",
          icon: "bi-key-fill",
        },
        {
          label: "PPPoE Profile",
          path: "/admin/pppoe/profile",
          icon: "bi-boxes",
        },
      ],
    },
    {
      title: "Billing & Clients",
      items: [
        {
          label: "Pelanggan",
          path: "/admin/pelanggan",
          icon: "bi-people-fill",
        },
        { label: "Paket", path: "/admin/paket", icon: "bi-box-seam-fill" },
        {
          label: "Invoice",
          path: "/admin/invoices",
          icon: "bi-receipt-cutoff",
        },
        { label: "Isolir", path: "/admin/isolir", icon: "bi-person-fill-lock" },
      ],
    },
    {
      title: "Integrations",
      items: [
        {
          label: "WhatsApp Gateway",
          path: "/admin/wa-gateaway",
          icon: "bi-whatsapp",
        },
        {
          label: "Bot Telegram",
          path: "/admin/telegram-bot",
          icon: "bi-telegram",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          label: "Billing Settings",
          path: "/admin/settings/billing",
          icon: "bi-gear-wide-connected",
        },
        {
          label: "Page Settings",
          path: "/admin/settings/page",
          icon: "bi-sliders",
        },
        {
          label: "Profile Settings",
          path: "/admin/settings/profile",
          icon: "bi-person-gear",
        },
      ],
    },
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#eeeeee" }}>
      {/* Route listener untuk mematikan loading saat berpindah page */}
      <Suspense fallback={null}>
        <RouteChangeListener onRouteComplete={() => setLoading(false)} />
      </Suspense>

      {/* ================= GLOBAL LOADING OVERLAY ================= */}
      <div
        className={`d-flex flex-column align-items-center justify-content-center ${
          loading ? "opacity-100 pe-none-off" : "opacity-0 pe-none"
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          transition: "opacity 0.25s ease-in-out, visibility 0.25s",
          visibility: loading ? "visible" : "hidden",
        }}
      >
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "2.8rem", height: "2.8rem", borderWidth: "0.22em" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="fw-semibold text-secondary fs-6">
          Memuat Halaman...
        </span>
      </div>

      <style jsx global>{`
        html,
        body {
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
          text-decoration: none;
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
          flex-shrink: 0;
        }
        .syncara-dark-item.active-syncara .syncara-icon-box-dark {
          background-color: #2563eb;
          color: #ffffff;
        }
        .syncara-dark-item:not(.active-syncara) .syncara-icon-box-dark {
          background-color: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive Mobile Drawer Animation */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1040;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            visibility 0.3s;
        }
        .mobile-drawer-backdrop.show {
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer-content {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          max-width: 85vw;
          background-color: #0a1128;
          z-index: 1050;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 25px rgba(0, 0, 0, 0.3);
        }
        .mobile-drawer-content.show {
          transform: translateX(0);
        }

        /* Profile & Notification Dropdown Animations */
        .profile-dropdown-menu,
        .notification-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background-color: #ffffff;
          border-radius: 14px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12),
            0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.08);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.96);
          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s;
        }
        .profile-dropdown-menu {
          width: 210px;
          padding: 8px 0;
        }
        .notification-dropdown-menu {
          width: 380px;
          max-width: 90vw;
          padding: 0;
          overflow: hidden;
        }
        .profile-dropdown-menu.show,
        .notification-dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .dropdown-item-custom {
          display: flex;
          align-items: center;
          padding: 9px 16px;
          font-size: 13.5px;
          color: #374151;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.15s ease, color 0.15s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        .dropdown-item-custom:hover {
          background-color: #f3f4f6;
          color: #1d4ed8;
        }
        .dropdown-item-custom.danger:hover {
          background-color: #fef2f2;
          color: #dc2626;
        }

        /* FIX LEBAR & TINGGI SERAGAM UNTUK CARD NOTIFIKASI */
        .notification-card {
          width: 100% !important;
          box-sizing: border-box !important;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 10px 14px;
          background-color: #ffffff;
          transition: all 0.2s ease;
          cursor: pointer;
          display: flex;
          gap: 12px;
          align-items: center; /* Posisikan item tegak lurus di tengah */
          min-height: 68px; /* Memaksa semua card memiliki tinggi yang persis sama */
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .notification-card:hover {
          background-color: #f8fafc;
          border-color: rgba(37, 99, 235, 0.25);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }
        .notification-card.unread {
          background-color: #f0f7ff;
          border-color: rgba(37, 99, 235, 0.2);
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
          .notification-dropdown-menu {
            right: -50px;
          }
        }
      `}</style>

      {/* ================= ANIMATED MOBILE DRAWER ================= */}
      <div
        className={`mobile-drawer-backdrop d-md-none ${
          isMobileSidebarOpen ? "show" : ""
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <div
        className={`mobile-drawer-content d-md-none d-flex flex-column ${
          isMobileSidebarOpen ? "show" : ""
        }`}
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
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
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
            <h6
              className="fw-bold mb-0 text-white text-truncate"
              style={{ fontSize: "14px" }}
            >
              Nocsphere
            </h6>
            <span
              className="text-white-50 small text-truncate d-block"
              style={{ fontSize: "12px" }}
            >
              admin@nocsphere.net
            </span>
          </div>
        </div>

        <div className="p-3 flex-grow-1 overflow-y-auto no-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="mb-3">
              <div
                className="text-uppercase fw-bold text-white-50 px-3 mb-1"
                style={{ fontSize: "10px", letterSpacing: "0.8px" }}
              >
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
                        setIsMobileSidebarOpen(false);
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

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="d-none d-md-flex flex-column justify-content-between p-3 admin-sidebar-desktop"
        style={{ backgroundColor: "#0a1128" }}
      >
        <div className="d-flex flex-column h-100 overflow-hidden">
          <div className="pt-2 pb-3 px-2 d-flex align-items-center justify-content-center mb-3 flex-shrink-0">
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
              <h5 className="fw-bold mb-0 text-white text-center">
                NOCSphere
              </h5>
            )}
          </div>

          <div className="overflow-y-auto no-scrollbar flex-grow-1 pe-1">
            {navSections.map((section) => (
              <div key={section.title} className="mb-3">
                <div
                  className="text-uppercase fw-bold text-white-50 px-3 mb-1"
                  style={{ fontSize: "10px", letterSpacing: "0.8px" }}
                >
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

      {/* ================= MAIN CONTENT AREA ================= */}
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
            <div className="d-md-none ms-1 d-flex align-items-center">
              <Image
                src="/img/nocsphere_black.png"
                alt="NOCSphere Logo"
                width={100}
                height={26}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {/* ================= NOTIFICATION DROPDOWN ================= */}
            <div className="position-relative" ref={notificationDropdownRef}>
              <button
                className="btn btn-light rounded-circle position-relative p-2 d-flex align-items-center justify-content-center text-secondary border-0"
                style={{ width: "38px", height: "38px" }}
                onClick={() => {
                  setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                  setIsProfileDropdownOpen(false);
                }}
              >
                <i className="bi bi-bell fs-6"></i>
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                    style={{ fontSize: "10px", padding: "3px 6px" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN MENU NOTIFIKASI */}
              <div
                className={`notification-dropdown-menu ${
                  isNotificationDropdownOpen ? "show" : ""
                }`}
              >
                {/* Header Dropdown */}
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light-subtle">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="fw-bold mb-0 text-dark fs-6">Notifikasi</h6>
                    {unreadCount > 0 && (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="btn btn-outline-primary btn-sm px-2.5 py-1 text-decoration-none fw-semibold border"
                      style={{ fontSize: "11.5px", borderRadius: "8px" }}
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="d-flex border-bottom bg-white px-3 py-2 gap-2">
                  <button
                    className={`btn btn-sm px-3 py-1 rounded-pill border ${
                      notificationTab === "all"
                        ? "btn-primary border-primary fw-semibold"
                        : "btn-light text-secondary border-secondary-subtle"
                    }`}
                    style={{ fontSize: "12px" }}
                    onClick={() => setNotificationTab("all")}
                  >
                    Semua
                  </button>
                  <button
                    className={`btn btn-sm px-3 py-1 rounded-pill border ${
                      notificationTab === "unread"
                        ? "btn-primary border-primary fw-semibold"
                        : "btn-light text-secondary border-secondary-subtle"
                    }`}
                    style={{ fontSize: "12px" }}
                    onClick={() => setNotificationTab("unread")}
                  >
                    Belum Dibaca
                  </button>
                </div>

                {/* List Notifikasi Berbentuk Card (Tinggi & Lebar Sama Persis) */}
                <div
                  className="overflow-y-auto no-scrollbar p-3 d-flex flex-column align-items-stretch gap-2"
                  style={{ maxHeight: "350px", backgroundColor: "#f8fafc" }}
                >
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-card w-100 ${
                          !n.read ? "unread" : ""
                        }`}
                        onClick={() => markAsRead(n.id)}
                      >
                        {/* Icon Kotak Biru */}
                        <div
                          className="bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            fontSize: "15px",
                          }}
                        >
                          <i className="bi bi-bell-fill text-primary"></i>
                        </div>

                        {/* Konten Teks dengan Truncate Single Line */}
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="d-flex align-items-center justify-content-between mb-0.5 gap-2">
                            <h6
                              className="fw-semibold mb-0 text-dark text-truncate"
                              style={{ fontSize: "13px" }}
                            >
                              {n.title}
                            </h6>
                            <span
                              className="text-muted flex-shrink-0"
                              style={{ fontSize: "10.5px" }}
                            >
                              {n.time}
                            </span>
                          </div>
                          <p
                            className="text-secondary mb-0 text-truncate"
                            style={{
                              fontSize: "12px",
                              lineHeight: "1.3",
                            }}
                          >
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-muted">
                      <i className="bi bi-bell-slash fs-3 d-block mb-1 opacity-50"></i>
                      <span style={{ fontSize: "13px" }}>
                        Tidak ada notifikasi
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Dropdown */}
                <div className="p-2 border-top text-center bg-white">
                  <Link
                    href="/admin/notifications"
                    className="text-primary text-decoration-none fw-semibold d-block py-1"
                    style={{ fontSize: "12.5px" }}
                    onClick={() => setIsNotificationDropdownOpen(false)}
                  >
                    Lihat Semua Notifikasi
                  </Link>
                </div>
              </div>
            </div>

            <div className="vr d-none d-sm-block my-2 text-muted opacity-25"></div>

            {/* ================= USER PROFILE WITH DROPDOWN ================= */}
            <div className="position-relative" ref={profileDropdownRef}>
              <div
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotificationDropdownOpen(false);
                }}
              >
                <div className="text-end d-none d-sm-block">
                  <div
                    className="fw-semibold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    Nocpshere
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
                <i
                  className={`bi bi-chevron-down text-muted fs-7 transition-transform d-none d-sm-block ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                  style={{
                    fontSize: "11px",
                    transition: "transform 0.2s ease",
                    transform: isProfileDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                ></i>
              </div>

              {/* DROPDOWN MENU */}
              <div
                className={`profile-dropdown-menu ${
                  isProfileDropdownOpen ? "show" : ""
                }`}
              >
                <div className="px-3 py-2 border-bottom mb-1">
                  <div
                    className="fw-semibold text-dark text-truncate"
                    style={{ fontSize: "13px" }}
                  >
                    Nocsphere Admin
                  </div>
                  <div
                    className="text-muted text-truncate"
                    style={{ fontSize: "11px" }}
                  >
                    admin@nocsphere.net
                  </div>
                </div>

                <Link
                  href="/admin/settings/profile"
                  className="dropdown-item-custom"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <span>Profile Settings</span>
                </Link>

                <div className="border-top my-1"></div>

                <button
                  onClick={handleLogout}
                  className="dropdown-item-custom danger gap-2"
                >
                  <i className="bi bi-box-arrow-right text-danger fs-6"></i>
                  <span className="text-danger fw-semibold">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-3 p-md-4 flex-grow-1 overflow-x-hidden">
          {children}
        </main>

        <footer className="w-100 bg-white text-dark pt-5 pb-4 border-top mt-auto">
          <div className="container-fluid px-4">
            <div className="row g-4 mb-5 text-start">
              {/* Brand & Info Column */}
              <div className="col-lg-4 col-md-12 pe-lg-5">
                <a
                  className="navbar-brand fw-bold d-inline-flex align-items-center mb-3 text-dark fs-5 text-decoration-none"
                  href="/"
                >
                  <img
                    src="/img/nocsphere_black.png"
                    alt="NocSphere Logo"
                    width="110"
                    className="img-fluid"
                    style={{
                      filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.35))",
                    }}
                  />
                </a>
                <p className="text-secondary small lh-lg mb-3">
                  NocSphere provides high-performing billing management systems
                  with unmatched reliability and automated isolation features.
                </p>
                <p className="fw-bold text-dark small mb-1">
                  NocSphere Inovasi Teknologi
                </p>
                <p className="text-secondary small mb-3">
                  Serving the best web billing management community
                </p>

                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-dark border px-2.5 py-2 small fw-normal">
                    Stripe Verified
                  </span>
                  <span className="badge bg-light text-dark border px-2.5 py-2 small fw-normal">
                    PCI Compliant
                  </span>
                </div>
              </div>

              {/* Navigation Links Columns */}
              <div className="col-lg-8 col-md-12">
                <div className="row g-4">
                  <div className="col-6 col-sm-3">
                    <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">
                      Solutions
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        PPPoE Accounts
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Hotspot Voucher
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Multi Router API
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Payment Gateway
                      </a>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">
                      Legal
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Fair Use
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Terms
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Privacy
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        SLA
                      </a>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">
                      Services
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Client Area
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Status
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Discord
                      </a>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">
                      Resources
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        Documentation
                      </a>
                      <a
                        href="#"
                        className="text-secondary text-decoration-none small"
                      >
                        MikroTik MIB API
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4 text-secondary opacity-25" />

            {/* Bottom Bar */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <span className="text-secondary small order-2 order-md-1">
                &copy; 2026 NocSphere. All rights reserved.
              </span>
              <div className="d-flex gap-3 fs-5 social-links order-1 order-md-2">
                <a href="#" className="text-secondary">
                  <i className="fa-brands fa-discord"></i>
                </a>
                <a href="#" className="text-secondary">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" className="text-secondary">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="#" className="text-secondary">
                  <i className="fa-brands fa-tiktok"></i>
                </a>
                <a href="#" className="text-secondary">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="#" className="text-secondary">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}