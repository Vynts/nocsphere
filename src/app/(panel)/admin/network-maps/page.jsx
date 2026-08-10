// app/(panel)/admin/network-maps/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import Leaflet untuk Next.js SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function NetworkMapsPage() {
  const [activeTab, setActiveTab] = useState("routers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [L, setL] = useState(null);

  // State Pagination Pelanggan
  const [customerPage, setCustomerPage] = useState(1);
  const customersPerPage = 5;

  // Load Leaflet & CSS secara dinamis
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
      import("leaflet/dist/leaflet.css");
      setLeafletLoaded(true);
    });
  }, []);

  // Reset page pelanggan ke 1 jika query pencarian atau tab berubah
  useEffect(() => {
    setCustomerPage(1);
  }, [searchQuery, activeTab]);

  // Mock Data Routers
  const routers = [
    {
      id: "r1",
      name: "CCR1009 - Main Gateway",
      ip: "103.150.20.1",
      status: "Online",
      lat: -5.3972,
      lng: 105.2663,
      totalClients: 142,
    },
    {
      id: "r2",
      name: "RB3011 - Tower Sektor A",
      ip: "103.150.20.2",
      status: "Online",
      lat: -5.385,
      lng: 105.258,
      totalClients: 85,
    },
    {
      id: "r3",
      name: "RB750Gr3 - Sektor B (Natar)",
      ip: "103.150.20.5",
      status: "Offline",
      lat: -5.335,
      lng: 105.208,
      totalClients: 0,
    },
  ];

  // Mock Data Pelanggan
  const customers = [
    {
      id: "c1",
      name: "Budi Santoso",
      package: "Home 20 Mbps",
      status: "Aktif",
      router: "CCR1009 - Main Gateway",
      lat: -5.399,
      lng: 105.268,
    },
    {
      id: "c2",
      name: "Ahmad Dahlan",
      package: "Biz 50 Mbps",
      status: "Aktif",
      router: "RB3011 - Tower Sektor A",
      lat: -5.382,
      lng: 105.259,
    },
    {
      id: "c3",
      name: "Siti Rahma",
      package: "Home 10 Mbps",
      status: "Isolir",
      router: "CCR1009 - Main Gateway",
      lat: -5.395,
      lng: 105.263,
    },
    {
      id: "c4",
      name: "Toko Rejeki",
      package: "Pro 100 Mbps",
      status: "Gangguan",
      router: "RB3011 - Tower Sektor A",
      lat: -5.388,
      lng: 105.255,
    },
    {
      id: "c5",
      name: "Eko Prasetyo",
      package: "Home 20 Mbps",
      status: "Aktif",
      router: "CCR1009 - Main Gateway",
      lat: -5.391,
      lng: 105.261,
    },
    {
      id: "c6",
      name: "Dewi Lestari",
      package: "Home 10 Mbps",
      status: "Aktif",
      router: "RB3011 - Tower Sektor A",
      lat: -5.384,
      lng: 105.257,
    },
    {
      id: "c7",
      name: "Hendra Wijaya",
      package: "Biz 50 Mbps",
      status: "Isolir",
      router: "CCR1009 - Main Gateway",
      lat: -5.396,
      lng: 105.265,
    },
  ];

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Custom Leaflet Marker
  const createCustomIcon = (color, iconClass) => {
    if (!L) return null;
    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          border: 2px solid white;
          font-size: 13px;
        ">
          <i class="bi ${iconClass}"></i>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  // Filter Data
  const filteredRouters = routers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ip.includes(searchQuery),
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.package.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination Logic Pelanggan
  const totalCustomerPages =
    Math.ceil(filteredCustomers.length / customersPerPage) || 1;
  const indexOfLastCustomer = customerPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">
          Network & Topological Maps
        </h3>
        <p className="text-muted mb-0 small fs-md-6">
          Pemetaan lokasi fisik router utama, POP sektor, dan persebaran titik
          pelanggan.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* SISI KIRI: List Router/Pelanggan (Scrollable & Pagination) */}
        <div className="col-12 col-xl-3">
          <div className="d-flex flex-column gap-3">
            {/* CARD 1: DAFTAR PERANGKAT */}
            <div
              className="card p-3 p-sm-4 d-flex flex-column"
              style={cardCleanStyle}
            >
              <h6 className="fw-bold text-dark mb-3 fs-6">Daftar Perangkat</h6>

              {/* Tab Switcher */}
              <div className="p-1 bg-light rounded-3 d-flex gap-1 mb-3 border">
                <button
                  type="button"
                  className={`btn btn-sm flex-fill fw-semibold rounded-2 border-0 py-2 ${
                    activeTab === "routers"
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted"
                  }`}
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    setActiveTab("routers");
                    setSearchQuery("");
                  }}
                >
                  Router ({routers.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-fill fw-semibold rounded-2 border-0 py-2 ${
                    activeTab === "customers"
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted"
                  }`}
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    setActiveTab("customers");
                    setSearchQuery("");
                  }}
                >
                  Pelanggan ({customers.length})
                </button>
              </div>

              {/* Search Box */}
              <div className="position-relative mb-3">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder={`Cari ${activeTab === "routers" ? "router / IP..." : "nama pelanggan..."}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: "13px", borderColor: "#cbd5e1" }}
                />
              </div>

              {/* Scrollable Container untuk List Items */}
              <div
                className="d-flex flex-column gap-2 overflow-y-auto pe-1"
                style={{ maxHeight: "280px" }}
              >
                {activeTab === "routers" ? (
                  filteredRouters.length > 0 ? (
                    filteredRouters.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedItem(r)}
                        className={`p-3 rounded-3 border cursor-pointer ${
                          selectedItem?.id === r.id
                            ? "bg-primary-subtle border-primary"
                            : "bg-white"
                        }`}
                        style={{ borderColor: "#e2e8f0" }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span
                            className="fw-bold text-dark extra-small text-truncate me-2"
                            style={{ fontSize: "13px" }}
                          >
                            {r.name}
                          </span>
                          <span
                            className={`badge ${r.status === "Online" ? "bg-success" : "bg-danger"} rounded-pill extra-small px-2`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <div
                          className="d-flex justify-content-between align-items-center text-muted extra-small"
                          style={{ fontSize: "11px" }}
                        >
                          <span className="font-monospace">{r.ip}</span>
                          <span>{r.totalClients} Pelanggan</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted text-center py-3 extra-small">
                      Router tidak ditemukan
                    </span>
                  )
                ) : currentCustomers.length > 0 ? (
                  currentCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedItem(c)}
                      className={`p-3 rounded-3 border cursor-pointer ${
                        selectedItem?.id === c.id
                          ? "bg-primary-subtle border-primary"
                          : "bg-white"
                      }`}
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span
                          className="fw-bold text-dark extra-small text-truncate me-2"
                          style={{ fontSize: "13px" }}
                        >
                          {c.name}
                        </span>
                        <span
                          className={`badge ${
                            c.status === "Aktif"
                              ? "bg-success"
                              : c.status === "Isolir"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                          } rounded-pill extra-small px-2`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between align-items-center text-muted extra-small"
                        style={{ fontSize: "11px" }}
                      >
                        <span>{c.package}</span>
                        <span
                          className="text-truncate ms-2"
                          style={{ maxWidth: "100px" }}
                        >
                          {c.router}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-muted text-center py-3 extra-small">
                    Pelanggan tidak ditemukan
                  </span>
                )}
              </div>

              {/* PAGINATION KHUSUS TAB PELANGGAN */}
              {activeTab === "customers" &&
                filteredCustomers.length > customersPerPage && (
                  <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                    <span
                      className="text-muted extra-small"
                      style={{ fontSize: "11px" }}
                    >
                      Page {customerPage} of {totalCustomerPages}
                    </span>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-light border rounded-2 px-2 py-1 extra-small"
                        disabled={customerPage === 1}
                        onClick={() => setCustomerPage((prev) => prev - 1)}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border rounded-2 px-2 py-1 extra-small"
                        disabled={customerPage === totalCustomerPages}
                        onClick={() => setCustomerPage((prev) => prev + 1)}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/* CARD 2: KETERANGAN MARKER */}
            {/* CARD 2: KETERANGAN MARKER (MODERN & GLOW ICON BOX) */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  Keterangan Marker
                </h6>
              </div>

              <div className="d-flex flex-column gap-3">
                {/* SEKSI 1: ROUTER / POP */}
                <div className="border-bottom pb-3">
                  <span
                    className="fw-semibold text-uppercase text-secondary d-block mb-2.5"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    PERANGKAT ROUTER / POP
                  </span>
                  <div className="d-flex flex-column gap-2">
                    {/* Router Online */}
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light-subtle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white shadow-sm"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "11px",
                          }}
                        >
                          <i className="bi bi-router"></i>
                        </div>
                        <span
                          className="text-dark fw-medium extra-small"
                          style={{ fontSize: "12px" }}
                        >
                          Router Online
                        </span>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill extra-small px-2">
                        Normal
                      </span>
                    </div>

                    {/* Router Offline */}
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light-subtle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-danger text-white shadow-sm"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "11px",
                          }}
                        >
                          <i className="bi bi-router"></i>
                        </div>
                        <span
                          className="text-dark fw-medium extra-small"
                          style={{ fontSize: "12px" }}
                        >
                          Router Offline
                        </span>
                      </div>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill extra-small px-2">
                        Down
                      </span>
                    </div>
                  </div>
                </div>

                {/* SEKSI 2: TITIK PELANGGAN */}
                <div>
                  <span
                    className="fw-semibold text-uppercase text-secondary d-block mb-2.5"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    TITIK PELANGGAN
                  </span>
                  <div className="d-flex flex-column gap-2">
                    {/* Pelanggan Aktif */}
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light-subtle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white shadow-sm"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "11px",
                          }}
                        >
                          <i className="bi bi-house-door"></i>
                        </div>
                        <span
                          className="text-dark fw-medium extra-small"
                          style={{ fontSize: "12px" }}
                        >
                          Pelanggan Aktif
                        </span>
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill extra-small px-2">
                        Active
                      </span>
                    </div>

                    {/* Terisolir */}
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light-subtle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-warning text-dark shadow-sm"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "11px",
                          }}
                        >
                          <i className="bi bi-house-lock"></i>
                        </div>
                        <span
                          className="text-dark fw-medium extra-small"
                          style={{ fontSize: "12px" }}
                        >
                          Terisolir / Suspend
                        </span>
                      </div>
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill extra-small px-2">
                        Isolir
                      </span>
                    </div>

                    {/* Gangguan */}
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light-subtle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-danger text-white shadow-sm"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "11px",
                          }}
                        >
                          <i className="bi bi-house-exclamation"></i>
                        </div>
                        <span
                          className="text-dark fw-medium extra-small"
                          style={{ fontSize: "12px" }}
                        >
                          Laporan Gangguan
                        </span>
                      </div>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill extra-small px-2">
                        Trouble
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Real Interactive Leaflet Maps */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div
            className="card p-3 p-sm-4"
            style={{ ...cardCleanStyle, minHeight: "680px" }}
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill extra-small fw-semibold">
                  ● Live Topology
                </span>
                <span
                  className="text-muted extra-small"
                  style={{ fontSize: "12px" }}
                >
                  Terhubung dengan 3 Routers & 142 Pelanggan
                </span>
              </div>
            </div>

            {/* Container Peta */}
            <div
              className="position-relative w-100 rounded-4 overflow-hidden border"
              style={{ height: "580px" }}
            >
              {leafletLoaded ? (
                <MapContainer
                  center={[-5.38, 105.25]}
                  zoom={13}
                  style={{ width: "100%", height: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  />

                  {/* Render Router Markers */}
                  {routers.map((r) => (
                    <Marker
                      key={r.id}
                      position={[r.lat, r.lng]}
                      icon={createCustomIcon(
                        r.status === "Online" ? "#0d6efd" : "#dc3545",
                        "bi-router",
                      )}
                    >
                      <Popup>
                        <div className="extra-small">
                          <strong className="d-block text-dark mb-1">
                            {r.name}
                          </strong>
                          <span className="text-muted d-block font-monospace mb-1">
                            {r.ip}
                          </span>
                          <span
                            className={`badge ${r.status === "Online" ? "bg-primary" : "bg-danger"}`}
                          >
                            {r.status}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Render Customer Markers */}
                  {customers.map((c) => (
                    <Marker
                      key={c.id}
                      position={[c.lat, c.lng]}
                      icon={createCustomIcon(
                        c.status === "Aktif"
                          ? "#10b981"
                          : c.status === "Isolir"
                            ? "#f59e0b"
                            : "#ef4444",
                        c.status === "Isolir"
                          ? "bi-house-lock"
                          : "bi-house-door",
                      )}
                    >
                      <Popup>
                        <div className="extra-small">
                          <strong className="d-block text-dark mb-1">
                            {c.name}
                          </strong>
                          <span className="text-muted d-block mb-1">
                            {c.package}
                          </span>
                          <span
                            className={`badge ${c.status === "Aktif" ? "bg-success" : "bg-warning text-dark"}`}
                          >
                            {c.status}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                  <div className="text-center text-muted extra-small">
                    <div
                      className="spinner-border spinner-border-sm text-primary mb-2"
                      role="status"
                    ></div>
                    <span className="d-block">Memuat peta...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
