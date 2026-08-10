// app/(panel)/admin/pppoe/secrets/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function PppoeSecretsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouter, setSelectedRouter] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all' | 'active' | 'disabled'

  // State Toggle Password Visibility di Tabel (Simpan ID yang di-unhide)
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock Data PPPoE Secrets
  const [secretsList, setSecretsList] = useState([
    { id: "sec-1", name: "budi_santoso", password: "secretpass123", service: "pppoe", profile: "Home-20Mbps", remoteAddress: "10.10.20.15", router: "CCR1009 - Main Gateway", disabled: false, comment: "Rumah Budi Pakel" },
    { id: "sec-2", name: "ahmad_dahlan", password: "mypassword88", service: "pppoe", profile: "Biz-50Mbps", remoteAddress: "10.10.20.16", router: "RB3011 - Tower Sektor A", disabled: false, comment: "Toko Kelontong" },
    { id: "sec-3", name: "siti_rahma", password: "rahmapassword", service: "pppoe", profile: "Home-10Mbps", remoteAddress: "10.10.20.17", router: "CCR1009 - Main Gateway", disabled: true, comment: "Isolir Tunggakan" },
    { id: "sec-4", name: "dewi_lestari", password: "dewisecurepass", service: "pppoe", profile: "Home-20Mbps", remoteAddress: "10.10.20.18", router: "RB3011 - Tower Sektor A", disabled: false, comment: "Kontrakan No 4" },
    { id: "sec-5", name: "eko_prasetyo", password: "ekopassword99", service: "pppoe", profile: "Biz-50Mbps", remoteAddress: "10.10.20.19", router: "CCR1009 - Main Gateway", disabled: true, comment: "Non-Aktif" },
    { id: "sec-6", name: "fajar_nugraha", password: "fajarpass123", service: "pppoe", profile: "Home-10Mbps", remoteAddress: "10.10.20.20", router: "RB3011 - Tower Sektor A", disabled: false, comment: "RT 02 RW 01" },
    { id: "sec-7", name: "gita_gutawa", password: "gitapassword", service: "pppoe", profile: "Home-20Mbps", remoteAddress: "10.10.20.21", router: "CCR1009 - Main Gateway", disabled: false, comment: "-" },
    { id: "sec-8", name: "hendra_kurnia", password: "hendrapass456", service: "pppoe", profile: "Biz-50Mbps", remoteAddress: "10.10.20.22", router: "RB3011 - Tower Sektor A", disabled: false, comment: "Kantor Cabang" },
    { id: "sec-9", name: "indah_permata", password: "indahpass789", service: "pppoe", profile: "Home-20Mbps", remoteAddress: "10.10.20.23", router: "CCR1009 - Main Gateway", disabled: false, comment: "-" },
    { id: "sec-10", name: "joko_widodo", password: "jokosecretpass", service: "pppoe", profile: "Pro-100Mbps", remoteAddress: "10.10.20.24", router: "RB3011 - Tower Sektor A", disabled: false, comment: "Warnet Net24" },
    { id: "sec-11", name: "krisna_bayu", password: "krisnapassword", service: "pppoe", profile: "Home-10Mbps", remoteAddress: "10.10.20.25", router: "CCR1009 - Main Gateway", disabled: true, comment: "Minta Cuti" },
  ]);

  // Form State untuk Add / Edit Secret
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    service: "pppoe",
    profile: "Home-20Mbps",
    remoteAddress: "",
    router: "CCR1009 - Main Gateway",
    comment: "",
    disabled: false,
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Toggle Password Masking
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Disable / Enable Secret
  const handleToggleDisable = (id) => {
    setSecretsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, disabled: !item.disabled } : item))
    );
  };

  // Filter List Data
  const filteredList = useMemo(() => {
    return secretsList.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remoteAddress.includes(searchQuery) ||
        (item.comment && item.comment.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchRouter = selectedRouter === "all" || item.router === selectedRouter;
      const matchProfile = selectedProfile === "all" || item.profile === selectedProfile;
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && !item.disabled) ||
        (selectedStatus === "disabled" && item.disabled);

      return matchQuery && matchRouter && matchProfile && matchStatus;
    });
  }, [secretsList, searchQuery, selectedRouter, selectedProfile, selectedStatus]);

  // Hitung Summary Status
  const activeCount = useMemo(() => secretsList.filter((i) => !i.disabled).length, [secretsList]);
  const disabledCount = useMemo(() => secretsList.filter((i) => i.disabled).length, [secretsList]);

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

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
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
      password: item.password,
      service: item.service,
      profile: item.profile,
      remoteAddress: item.remoteAddress,
      router: item.router,
      comment: item.comment || "",
      disabled: item.disabled,
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setActiveModal("delete");
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      password: "",
      service: "pppoe",
      profile: "Home-20Mbps",
      remoteAddress: "",
      router: "CCR1009 - Main Gateway",
      comment: "",
      disabled: false,
    });
    setActiveModal("add");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (activeModal === "add") {
      const newItem = {
        id: `sec-${Date.now()}`,
        ...formData,
      };
      setSecretsList((prev) => [newItem, ...prev]);
    } else if (activeModal === "edit") {
      setSecretsList((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...i, ...formData } : i))
      );
    }
    closeModal();
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">PPPoE Secrets</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Daftar kredensial & otentikasi akun PPPoE pelanggan di MikroTik.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Quick Actions & Filters */}
        <div className="col-12 col-xl-3">
          <div className="d-flex flex-column gap-3">
            {/* Quick Actions Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Quick Actions</h6>

              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="btn btn-primary rounded-3 fw-semibold text-start d-flex align-items-center justify-content-between px-3 py-2 shadow-none"
                  style={{ fontSize: "14px" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-plus-lg fs-6"></i>
                    <span>Tambah Secret</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-75"></i>
                </button>

                <Link
                  href="/admin/pppoe/active"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-broadcast fs-6 text-primary"></i>
                    <span>Active Connections</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>

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

            {/* Filters Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter Secrets</h6>

              <div className="d-flex flex-column gap-3">
                {/* Filter Status */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    STATUS AKUN
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Akun ({secretsList.length})</option>
                    <option value="active">Active Only ({activeCount})</option>
                    <option value="disabled">Disabled Only ({disabledCount})</option>
                  </select>
                </div>

                {/* Filter Profile */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    PROFILE PAKET
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedProfile}
                    onChange={handleProfileChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Profile</option>
                    <option value="Home-10Mbps">Home-10Mbps</option>
                    <option value="Home-20Mbps">Home-20Mbps</option>
                    <option value="Biz-50Mbps">Biz-50Mbps</option>
                    <option value="Pro-100Mbps">Pro-100Mbps</option>
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

        {/* RIGHT COLUMN: PPPoE Secrets Table */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            {/* Search Bar & Counter */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari username, IP, atau catatan..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {activeCount} Active
                </span>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {disabledCount} Disabled
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>USERNAME</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PASSWORD</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>REMOTE IP</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PROFILE</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ROUTER</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* USERNAME & STATUS INDIKATOR */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`d-inline-block rounded-circle ${item.disabled ? "bg-danger" : "bg-success"}`}
                              style={{ width: "9px", height: "9px" }}
                              title={item.disabled ? "Akun Nonaktif / Disabled" : "Akun Aktif"}
                            ></span>
                            <div>
                              <span className={`fw-bold d-block ${item.disabled ? "text-muted text-decoration-line-through" : "text-dark"}`} style={{ fontSize: "14px" }}>
                                {item.name}
                              </span>
                              {item.comment && (
                                <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>
                                  {item.comment}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* PASSWORD (DENGAN EYE TOGGLE) */}
                        <td>
                          <div className="d-inline-flex align-items-center gap-2">
                            <span className="font-monospace text-secondary fw-medium" style={{ fontSize: "13px" }}>
                              {visiblePasswords[item.id] ? item.password : "••••••••"}
                            </span>
                            <button
                              type="button"
                              className="btn p-0 border-0 text-muted shadow-none"
                              onClick={() => togglePasswordVisibility(item.id)}
                              title={visiblePasswords[item.id] ? "Sembunyikan Password" : "Lihat Password"}
                            >
                              <i className={`bi ${visiblePasswords[item.id] ? "bi-eye-slash" : "bi-eye"} extra-small`}></i>
                            </button>
                          </div>
                        </td>

                        {/* REMOTE IP LINK */}
                        <td>
                          {item.remoteAddress ? (
                            <a
                              href={`http://${item.remoteAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-monospace text-primary text-decoration-none fw-semibold ip-text-link"
                              title={`Buka WebGUI Client (${item.remoteAddress})`}
                              style={{ fontSize: "14px" }}
                            >
                              {item.remoteAddress}
                            </a>
                          ) : (
                            <span className="text-muted font-monospace" style={{ fontSize: "13px" }}>
                              Dynamic
                            </span>
                          )}
                        </td>

                        {/* PROFILE BADGE */}
                        <td>
                          <span className="badge bg-light text-dark border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                            {item.profile}
                          </span>
                        </td>

                        {/* ROUTER */}
                        <td>
                          <span className="text-secondary fw-medium" style={{ fontSize: "13px" }}>
                            {item.router}
                          </span>
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="text-end pe-2">
                          <div className="d-inline-flex align-items-center gap-3">
                            {/* Toggle Enable/Disable Switch */}
                            <button
                              type="button"
                              onClick={() => handleToggleDisable(item.id)}
                              className={`btn p-0 border-0 shadow-none hover-scale ${item.disabled ? "text-success" : "text-warning"}`}
                              title={item.disabled ? "Enable Secret" : "Disable Secret"}
                              style={{ cursor: "pointer" }}
                            >
                              <i className={`bi ${item.disabled ? "bi-check-circle-fill" : "bi-slash-circle-fill"} fs-6`}></i>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale"
                              title="Edit Secret"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-pencil-fill fs-6"></i>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="btn p-0 border-0 text-danger shadow-none hover-scale"
                              title="Hapus Secret"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-trash-fill fs-6"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted" style={{ fontSize: "13px" }}>
                        Tidak ada PPPoE secret ditemukan
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
                        pageNum === currentPage ? "btn-primary text-white shadow-sm" : "btn-light border text-secondary"
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
      {/* MODALS SECTION                                            */}
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
          {/* 1. MODAL TAMBAH & EDIT SECRET */}
          {(activeModal === "add" || activeModal === "edit") && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "500px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  {activeModal === "add" ? "Tambah PPPoE Secret" : `Edit Secret: ${selectedItem?.name}`}
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      USERNAME / SECRET NAME
                    </label>
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
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      PASSWORD
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Masukkan password"
                      required
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        PROFILE
                      </label>
                      <select
                        className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                        value={formData.profile}
                        onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                      >
                        <option value="Home-10Mbps">Home-10Mbps</option>
                        <option value="Home-20Mbps">Home-20Mbps</option>
                        <option value="Biz-50Mbps">Biz-50Mbps</option>
                        <option value="Pro-100Mbps">Pro-100Mbps</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        REMOTE ADDRESS (IP)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                        value={formData.remoteAddress}
                        onChange={(e) => setFormData({ ...formData, remoteAddress: e.target.value })}
                        placeholder="e.g. 10.10.20.15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      TARGET ROUTER
                    </label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none"
                      value={formData.router}
                      onChange={(e) => setFormData({ ...formData, router: e.target.value })}
                    >
                      <option value="CCR1009 - Main Gateway">CCR1009 - Main Gateway</option>
                      <option value="RB3011 - Tower Sektor A">RB3011 - Tower Sektor A</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      COMMENT / CATATAN
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="e.g. Lokasi pelanggan / Keterangan"
                    />
                  </div>

                  {/* Switch Disabled / Active */}
                  <div className="form-check form-switch pt-1">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      id="disabledSwitch"
                      checked={formData.disabled}
                      onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold text-secondary extra-small" htmlFor="disabledSwitch" style={{ fontSize: "13px" }}>
                      Nonaktifkan Akun (Disable Secret)
                    </label>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    {activeModal === "add" ? "Simpan Secret" : "Update Secret"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. MODAL DELETE SECRET */}
          {activeModal === "delete" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "400px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
                  <i className="bi bi-trash-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Hapus PPPoE Secret?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Akun secret <strong className="text-dark">{selectedItem?.name}</strong> akan dihapus permanen dari sistem dan Router.
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
                    setSecretsList((prev) => prev.filter((i) => i.id !== selectedItem?.id));
                    closeModal();
                  }}
                >
                  Hapus Secret
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Animation & Hover Style */}
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