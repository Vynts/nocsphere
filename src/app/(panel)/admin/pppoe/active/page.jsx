// app/(panel)/admin/pppoe/active/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function PppoeActivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouter, setSelectedRouter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all' | 'online' | 'offline'

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete' | 'check' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock Data PPPoE (Campuran Online & Offline)
  const [activeList, setActiveList] = useState([
    { id: "pppoe-1", name: "budi_santoso", status: "online", service: "pppoe", callerId: "70:81:EB:12:34:56", address: "10.10.20.15", uptime: "2d 04:12:30", encoding: "CBC-DES", router: "CCR1009 - Main Gateway", profile: "Home-20Mbps", rxBytes: "1.2 GB", txBytes: "8.4 GB" },
    { id: "pppoe-2", name: "ahmad_dahlan", status: "online", service: "pppoe", callerId: "E4:8D:8C:99:88:77", address: "10.10.20.16", uptime: "0d 18:45:10", encoding: "CBC-DES", router: "RB3011 - Tower Sektor A", profile: "Biz-50Mbps", rxBytes: "4.5 GB", txBytes: "22.1 GB" },
    { id: "pppoe-3", name: "siti_rahma", status: "offline", service: "pppoe", callerId: "00:15:5D:01:02:03", address: "10.10.20.17", uptime: "Offline (3h ago)", encoding: "CBC-DES", router: "CCR1009 - Main Gateway", profile: "Home-10Mbps", rxBytes: "0 B", txBytes: "0 B" },
    { id: "pppoe-4", name: "dewi_lestari", status: "online", service: "pppoe", callerId: "84:A9:3E:44:55:66", address: "10.10.20.18", uptime: "1d 08:30:00", encoding: "CBC-DES", router: "RB3011 - Tower Sektor A", profile: "Home-20Mbps", rxBytes: "2.1 GB", txBytes: "12.0 GB" },
    { id: "pppoe-5", name: "eko_prasetyo", status: "offline", service: "pppoe", callerId: "A0:B1:C2:D3:E4:F5", address: "10.10.20.19", uptime: "Offline", encoding: "CBC-DES", router: "CCR1009 - Main Gateway", profile: "Biz-50Mbps", rxBytes: "0 B", txBytes: "0 B" },
    { id: "pppoe-6", name: "fajar_nugraha", status: "online", service: "pppoe", callerId: "12:34:56:78:90:AB", address: "10.10.20.20", uptime: "3d 19:11:05", encoding: "CBC-DES", router: "RB3011 - Tower Sektor A", profile: "Home-10Mbps", rxBytes: "3.4 GB", txBytes: "15.2 GB" },
    { id: "pppoe-7", name: "gita_gutawa", status: "online", service: "pppoe", callerId: "CC:DD:EE:FF:11:22", address: "10.10.20.21", uptime: "0d 05:50:20", encoding: "CBC-DES", router: "CCR1009 - Main Gateway", profile: "Home-20Mbps", rxBytes: "1.8 GB", txBytes: "9.6 GB" },
    { id: "pppoe-8", name: "hendra_kurnia", status: "offline", service: "pppoe", callerId: "55:66:77:88:99:00", address: "10.10.20.22", uptime: "Offline (1d ago)", encoding: "CBC-DES", router: "RB3011 - Tower Sektor A", profile: "Biz-50Mbps", rxBytes: "0 B", txBytes: "0 B" },
    { id: "pppoe-9", name: "indah_permata", status: "online", service: "pppoe", callerId: "99:88:77:66:55:44", address: "10.10.20.23", uptime: "2d 11:05:30", encoding: "CBC-DES", router: "CCR1009 - Main Gateway", profile: "Home-20Mbps", rxBytes: "2.8 GB", txBytes: "10.1 GB" },
    { id: "pppoe-10", name: "joko_widodo", status: "online", service: "pppoe", callerId: "11:22:33:44:55:66", address: "10.10.20.24", uptime: "6d 00:10:00", encoding: "CBC-DES", router: "RB3011 - Tower Sektor A", profile: "Pro-100Mbps", rxBytes: "12.5 GB", txBytes: "85.0 GB" },
    { id: "pppoe-11", name: "krisna_bayu", status: "offline", service: "pppoe", callerId: "AA:BB:CC:DD:EE:FF", address: "10.10.20.25", uptime: "Offline", encoding: "CBC-DES", router: "CCR1009 - Main Gateway", profile: "Home-10Mbps", rxBytes: "0 B", txBytes: "0 B" },
  ]);

  // Form State untuk Add / Edit
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    service: "pppoe",
    profile: "Home-20Mbps",
    router: "CCR1009 - Main Gateway",
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Filter List Data (Query + Router + Online/Offline Status)
  const filteredList = useMemo(() => {
    return activeList.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.includes(searchQuery) ||
        item.callerId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRouter = selectedRouter === "all" || item.router === selectedRouter;
      const matchStatus = selectedStatus === "all" || item.status === selectedStatus;
      
      return matchQuery && matchRouter && matchStatus;
    });
  }, [activeList, searchQuery, selectedRouter, selectedStatus]);

  // Hitung Summary Status
  const onlineCount = useMemo(() => activeList.filter(i => i.status === "online").length, [activeList]);
  const offlineCount = useMemo(() => activeList.filter(i => i.status === "offline").length, [activeList]);

  // Logic Pagination
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // Handlers Filter
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRouterChange = (e) => {
    setSelectedRouter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handlers Modal
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      password: "••••••••",
      service: item.service,
      profile: item.profile,
      router: item.router,
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setActiveModal("delete");
  };

  const openCheckModal = (item) => {
    setSelectedItem(item);
    setActiveModal("check");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">PPPoE Connections</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola koneksi PPPoE pelanggan, cek status live online/offline, dan aksi pemeliharaan.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        
        {/* LEFT COLUMN: Quick Actions & Filter */}
        <div className="col-12 col-xl-3">
          <div className="d-flex flex-column gap-3">
            
            {/* Quick Actions Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Quick Actions</h6>
              
              <div className="d-flex flex-column gap-2">
                <a
                  type="button"
                  href="/admin/pppoe/secrets"
                  className="btn btn-primary rounded-3 fw-semibold text-start d-flex align-items-center justify-content-between px-3 py-2 shadow-none"
                  style={{ fontSize: "14px" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-plus-lg fs-6"></i>
                    <span>Tambah Secret</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-75"></i>
                </a>

                <button
                  type="button"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  onClick={() => alert("Menyingkronkan sesi aktif dari Router...")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-repeat fs-6 text-primary"></i>
                    <span>Sync Session</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </button>

                <Link
                  href="/admin/routers"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <i className="bi bi-router fs-6"></i>
                  <span>Kelola Routers</span>
                </Link>
              </div>
            </div>

            {/* Filter Status & Router Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter & Status</h6>
              
              <div className="d-flex flex-column gap-3">
                {/* Filter Online / Offline */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    STATUS KONEKSI
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Status ({activeList.length})</option>
                    <option value="online">Online Only ({onlineCount})</option>
                    <option value="offline">Offline Only ({offlineCount})</option>
                  </select>
                </div>

                {/* Filter Router Target */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    ROUTER TARGET
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedRouter}
                    onChange={handleRouterChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Router</option>
                    <option value="CCR1009 - Main Gateway">CCR1009 - Main Gateway</option>
                    <option value="RB3011 - Tower Sektor A">RB3011 - Tower Sektor A</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Active/Offline Connections Table */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            
            {/* Search Bar & Status Badges */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari user, IP, atau MAC address..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {onlineCount} Online
                </span>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {offlineCount} Offline
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>USER / SECRET</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>IP ADDRESS</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>CALLER ID (MAC)</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>UPTIME / STATUS</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ROUTER</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* NAME + INDIKATOR STATUS (HIJAU ONLINE / MERAH OFFLINE) */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span 
                              className={`d-inline-block rounded-circle ${item.status === 'online' ? 'bg-success' : 'bg-danger'}`} 
                              style={{ width: "9px", height: "9px" }}
                              title={item.status === 'online' ? 'Sesi Aktif (Online)' : 'Sesi Terputus (Offline)'}
                            ></span>
                            <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>{item.name}</span>
                          </div>
                        </td>

                        {/* IP ADDRESS LINK */}
                        <td>
                          {item.status === "online" ? (
                            <a
                              href={`http://${item.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-monospace text-primary text-decoration-none fw-semibold ip-text-link"
                              title={`Buka WebGUI Client (${item.address})`}
                              style={{ fontSize: "14px" }}
                            >
                              {item.address}
                            </a>
                          ) : (
                            <span className="font-monospace text-muted opacity-75" style={{ fontSize: "14px" }}>
                              {item.address}
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="font-monospace text-muted" style={{ fontSize: "13px" }}>{item.callerId}</span>
                        </td>

                        {/* UPTIME BADGE */}
                        <td>
                          <span 
                            className={`badge border px-2.5 py-1.5 fw-semibold ${
                              item.status === "online" 
                                ? "bg-light text-dark" 
                                : "bg-danger-subtle text-danger border-danger-subtle"
                            }`} 
                            style={{ fontSize: "12px" }}
                          >
                            {item.uptime}
                          </span>
                        </td>

                        <td>
                          <span className="text-secondary fw-medium" style={{ fontSize: "13px" }}>{item.router}</span>
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="text-end pe-2">
                          <div className="d-inline-flex align-items-center gap-3">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale"
                              title="Edit PPPoE"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-pencil-fill fs-6"></i>
                            </button>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="btn p-0 border-0 text-danger shadow-none hover-scale"
                              title="Disconnect / Delete Session"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-trash-fill fs-6"></i>
                            </button>

                            <button
                              type="button"
                              onClick={() => openCheckModal(item)}
                              className="btn p-0 border-0 text-secondary shadow-none hover-scale"
                              title="Cek Telemetry & Traffic"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-arrow-right fs-5 fw-bold"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted" style={{ fontSize: "13px" }}>
                        Tidak ada koneksi PPPoE yang sesuai dengan filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ========================================================= */}
            {/* FOOTER & PAGINATION CONTROLS                              */}
            {/* ========================================================= */}
            {totalItems > 0 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 mt-2 border-top">
                
                {/* Left: Rows Per Page Selector */}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted extra-small" style={{ fontSize: "13px" }}>Show:</span>
                  <select
                    className="form-select form-select-sm rounded-3 shadow-none fw-semibold border-1"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    style={{ width: "70px", fontSize: "13px", borderColor: "#cbd5e1" }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-muted extra-small ms-1" style={{ fontSize: "13px" }}>
                    Showing <strong className="text-dark">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
                    <strong className="text-dark">{Math.min(endIndex, totalItems)}</strong> of{" "}
                    <strong className="text-dark">{totalItems}</strong> entries
                  </span>
                </div>

                {/* Right: Pagination Navigation */}
                <div className="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-light border rounded-3 p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "13px" }}
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    title="First Page"
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-light border rounded-3 p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "13px" }}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`btn btn-sm rounded-3 fw-semibold p-0 d-flex align-items-center justify-content-center ${
                        pageNum === currentPage
                          ? "btn-primary text-white shadow-sm"
                          : "btn-light border text-secondary"
                      }`}
                      style={{ width: "32px", height: "32px", fontSize: "13px" }}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm btn-light border rounded-3 p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "13px" }}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-light border rounded-3 p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "13px" }}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last Page"
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL ANIMATED CONTAINER & BACKDROP                       */}
      {/* ========================================================= */}
      {activeModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
            animation: "fadeIn 0.2s ease-out forwards",
          }}
        >
          {/* 1. MODAL TAMBAH & EDIT PPPOE */}
          {(activeModal === "add" || activeModal === "edit") && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "480px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  {activeModal === "add" ? "Tambah PPPoE Baru" : `Edit PPPoE: ${selectedItem?.name}`}
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); closeModal(); alert("Berhasil disimpan!"); }}>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>USERNAME</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. budi_santoso"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>PASSWORD</label>
                    <input
                      type="password"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>PROFILE</label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={formData.profile}
                      onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    >
                      <option value="Home-10Mbps">Home-10Mbps</option>
                      <option value="Home-20Mbps">Home-20Mbps</option>
                      <option value="Biz-50Mbps">Biz-50Mbps</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>TARGET ROUTER</label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none"
                      value={formData.router}
                      onChange={(e) => setFormData({ ...formData, router: e.target.value })}
                    >
                      <option value="CCR1009 - Main Gateway">CCR1009 - Main Gateway</option>
                      <option value="RB3011 - Tower Sektor A">RB3011 - Tower Sektor A</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    {activeModal === "add" ? "Simpan PPPoE" : "Update Secret"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. MODAL DELETE / DISCONNECT */}
          {activeModal === "delete" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "400px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
                  <i className="bi bi-trash-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Putuskan Sesi PPPoE?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Sesi pengguna <strong className="text-dark">{selectedItem?.name}</strong> akan diputus secara paksa dari router.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 pt-3 border-top">
                <button type="button" className="btn btn-light border flex-fill rounded-3 fw-semibold py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger flex-fill rounded-3 fw-semibold py-2"
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    setActiveList((prev) => prev.filter((i) => i.id !== selectedItem?.id));
                    closeModal();
                  }}
                >
                  Disconnect Sesi
                </button>
              </div>
            </div>
          )}

          {/* 3. MODAL CHECK TELEMETRY & TRAFFIC (PANAH →) */}
          {activeModal === "check" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "520px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className={`d-inline-block rounded-circle ${selectedItem?.status === 'online' ? 'bg-success' : 'bg-danger'}`} style={{ width: "10px", height: "10px" }}></span>
                  <h6 className="fw-bold text-dark mb-0 fs-6">Sesi Live: {selectedItem?.name}</h6>
                </div>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              {/* Grid Status Telemetry */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="text-muted d-block extra-small mb-1" style={{ fontSize: "11px" }}>IP ADDRESS</span>
                    {selectedItem?.status === "online" ? (
                      <a
                        href={`http://${selectedItem?.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-monospace text-primary fw-bold text-decoration-none ip-text-link"
                        style={{ fontSize: "14px" }}
                      >
                        {selectedItem?.address}
                      </a>
                    ) : (
                      <span className="font-monospace text-muted" style={{ fontSize: "14px" }}>
                        {selectedItem?.address}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="text-muted d-block extra-small mb-1" style={{ fontSize: "11px" }}>UPTIME / STATUS</span>
                    <strong className={selectedItem?.status === "online" ? "text-dark" : "text-danger"} style={{ fontSize: "13px" }}>
                      {selectedItem?.uptime}
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="text-muted d-block extra-small mb-1" style={{ fontSize: "11px" }}>CALLER ID (MAC)</span>
                    <strong className="font-monospace text-dark d-block" style={{ fontSize: "12px" }}>{selectedItem?.callerId}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="text-muted d-block extra-small mb-1" style={{ fontSize: "11px" }}>PROFILE / ENCODING</span>
                    <strong className="text-dark d-block" style={{ fontSize: "12px" }}>{selectedItem?.profile}</strong>
                  </div>
                </div>
              </div>

              {/* Live Traffic Counter */}
              <div className="p-3 border rounded-3 bg-primary-subtle border-primary-subtle mb-4">
                <span className="fw-bold text-primary d-block mb-2 extra-small" style={{ fontSize: "11px" }}>REALTIME TRAFFIC USAGE</span>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted d-block extra-small" style={{ fontSize: "11px" }}>Download (Rx)</span>
                    <span className="fw-bold text-dark fs-6">{selectedItem?.rxBytes}</span>
                  </div>
                  <div className="border-start ps-3">
                    <span className="text-muted d-block extra-small" style={{ fontSize: "11px" }}>Upload (Tx)</span>
                    <span className="fw-bold text-dark fs-6">{selectedItem?.txBytes}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end border-top pt-3">
                <button type="button" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Tutup Inspection
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Global Animation & Link Hover Style */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-scale {
          transition: transform 0.15s ease;
        }
        .hover-scale:hover {
          transform: scale(1.15);
        }
        .ip-text-link:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}