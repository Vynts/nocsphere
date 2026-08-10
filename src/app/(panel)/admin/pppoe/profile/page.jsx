// app/(panel)/admin/pppoe/profiles/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function PppoeProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouter, setSelectedRouter] = useState("all");

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock Data PPPoE Profiles
  const [profilesList, setProfilesList] = useState([
    { id: "prof-1", name: "Home-10Mbps", rateLimit: "10M/10M", localAddress: "10.10.20.1", remoteAddressPool: "dhcp_pool_home10", dnsServer: "8.8.8.8, 1.1.1.1", router: "CCR1009 - Main Gateway", activeUsers: 24, disabled: false },
    { id: "prof-2", name: "Home-20Mbps", rateLimit: "20M/20M", localAddress: "10.10.20.1", remoteAddressPool: "dhcp_pool_home20", dnsServer: "8.8.8.8, 1.1.1.1", router: "CCR1009 - Main Gateway", activeUsers: 42, disabled: false },
    { id: "prof-3", name: "Biz-50Mbps", rateLimit: "50M/50M", localAddress: "10.10.30.1", remoteAddressPool: "dhcp_pool_biz50", dnsServer: "1.1.1.1, 8.8.8.8", router: "RB3011 - Tower Sektor A", activeUsers: 15, disabled: false },
    { id: "prof-4", name: "Pro-100Mbps", rateLimit: "100M/100M", localAddress: "10.10.30.1", remoteAddressPool: "dhcp_pool_pro100", dnsServer: "1.1.1.1, 8.8.8.8", router: "RB3011 - Tower Sektor A", activeUsers: 8, disabled: false },
    { id: "prof-5", name: "Isolir-1Mbps", rateLimit: "512k/1M", localAddress: "10.10.99.1", remoteAddressPool: "dhcp_pool_isolir", dnsServer: "10.10.99.1", router: "CCR1009 - Main Gateway", activeUsers: 5, disabled: false },
    { id: "prof-6", name: "Promo-30Mbps", rateLimit: "30M/30M", localAddress: "10.10.20.1", remoteAddressPool: "dhcp_pool_promo", dnsServer: "8.8.8.8, 1.1.1.1", router: "CCR1009 - Main Gateway", activeUsers: 0, disabled: true },
  ]);

  // Form State untuk Add / Edit Profile
  const [formData, setFormData] = useState({
    name: "",
    rateLimit: "",
    localAddress: "10.10.20.1",
    remoteAddressPool: "",
    dnsServer: "8.8.8.8, 1.1.1.1",
    router: "CCR1009 - Main Gateway",
    disabled: false,
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Toggle Disable / Enable Profile
  const handleToggleDisable = (id) => {
    setProfilesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, disabled: !item.disabled } : item))
    );
  };

  // Filter List Data
  const filteredList = useMemo(() => {
    return profilesList.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rateLimit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remoteAddressPool.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRouter = selectedRouter === "all" || item.router === selectedRouter;

      return matchQuery && matchRouter;
    });
  }, [profilesList, searchQuery, selectedRouter]);

  // Hitung Summary Status
  const activeCount = useMemo(() => profilesList.filter((i) => !i.disabled).length, [profilesList]);
  const disabledCount = useMemo(() => profilesList.filter((i) => i.disabled).length, [profilesList]);

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handlers Modal
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      rateLimit: item.rateLimit,
      localAddress: item.localAddress,
      remoteAddressPool: item.remoteAddressPool,
      dnsServer: item.dnsServer,
      router: item.router,
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
      rateLimit: "10M/10M",
      localAddress: "10.10.20.1",
      remoteAddressPool: "dhcp_pool_default",
      dnsServer: "8.8.8.8, 1.1.1.1",
      router: "CCR1009 - Main Gateway",
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
        id: `prof-${Date.now()}`,
        activeUsers: 0,
        ...formData,
      };
      setProfilesList((prev) => [newItem, ...prev]);
    } else if (activeModal === "edit") {
      setProfilesList((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...i, ...formData } : i))
      );
    }
    closeModal();
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">PPPoE Profiles</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola profil paket layanan, pembatasan bandwidth (Rate Limit), dan alokasi IP Pool.
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
                    <span>Tambah Profile</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-75"></i>
                </button>

                <Link
                  href="/admin/pppoe/secrets"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-key fs-6 text-primary"></i>
                    <span>Kelola Secrets</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>

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
              </div>
            </div>

            {/* Filters Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter Profiles</h6>

              <div className="d-flex flex-column gap-3">
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

        {/* RIGHT COLUMN: PPPoE Profiles Table */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            {/* Search Bar & Counter */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari profil, rate limit, atau IP pool..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {activeCount} Active Profile
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
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>NAMA PROFIL</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>RATE LIMIT (Rx/Tx)</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>LOCAL ADDRESS</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>REMOTE POOL</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>USERS</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* NAMA PROFIL & STATUS INDIKATOR */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`d-inline-block rounded-circle ${item.disabled ? "bg-danger" : "bg-success"}`}
                              style={{ width: "9px", height: "9px" }}
                              title={item.disabled ? "Profil Nonaktif / Disabled" : "Profil Aktif"}
                            ></span>
                            <span className={`fw-bold ${item.disabled ? "text-muted text-decoration-line-through" : "text-dark"}`} style={{ fontSize: "14px" }}>
                              {item.name}
                            </span>
                          </div>
                        </td>

                        {/* RATE LIMIT */}
                        <td>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 font-monospace fw-semibold" style={{ fontSize: "12px" }}>
                            {item.rateLimit || "Unlimited"}
                          </span>
                        </td>

                        {/* LOCAL ADDRESS */}
                        <td>
                          <span className="font-monospace text-secondary fw-medium" style={{ fontSize: "13px" }}>
                            {item.localAddress || "-"}
                          </span>
                        </td>

                        {/* REMOTE ADDRESS POOL */}
                        <td>
                          <span className="font-monospace text-dark fw-medium" style={{ fontSize: "13px" }}>
                            {item.remoteAddressPool || "-"}
                          </span>
                        </td>

                        {/* ACTIVE USERS COUNT */}
                        <td>
                          <span className="badge bg-light text-dark border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                            {item.activeUsers} Secret(s)
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
                              title={item.disabled ? "Enable Profile" : "Disable Profile"}
                              style={{ cursor: "pointer" }}
                            >
                              <i className={`bi ${item.disabled ? "bi-check-circle-fill" : "bi-slash-circle-fill"} fs-6`}></i>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale"
                              title="Edit Profile"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-pencil-fill fs-6"></i>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="btn p-0 border-0 text-danger shadow-none hover-scale"
                              title="Hapus Profile"
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
                        Tidak ada PPPoE profile ditemukan
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
          {/* 1. MODAL TAMBAH & EDIT PROFILE */}
          {(activeModal === "add" || activeModal === "edit") && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "500px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  {activeModal === "add" ? "Tambah PPPoE Profile" : `Edit Profile: ${selectedItem?.name}`}
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NAMA PROFIL
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Home-20Mbps"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      RATE LIMIT (Rx/Tx)
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                      value={formData.rateLimit}
                      onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                      placeholder="e.g. 10M/10M atau 20M/50M"
                    />
                    <span className="text-muted extra-small d-block mt-1" style={{ fontSize: "11px" }}>
                      Format Mikrotik: Upload/Download (misal: 10M/10M)
                    </span>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        LOCAL ADDRESS
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                        value={formData.localAddress}
                        onChange={(e) => setFormData({ ...formData, localAddress: e.target.value })}
                        placeholder="e.g. 10.10.20.1"
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        REMOTE ADDRESS POOL
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                        value={formData.remoteAddressPool}
                        onChange={(e) => setFormData({ ...formData, remoteAddressPool: e.target.value })}
                        placeholder="e.g. dhcp_pool_home"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      DNS SERVER
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                      value={formData.dnsServer}
                      onChange={(e) => setFormData({ ...formData, dnsServer: e.target.value })}
                      placeholder="e.g. 8.8.8.8, 1.1.1.1"
                    />
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

                  {/* Switch Disabled / Active */}
                  <div className="form-check form-switch pt-1">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      id="disabledProfileSwitch"
                      checked={formData.disabled}
                      onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold text-secondary extra-small" htmlFor="disabledProfileSwitch" style={{ fontSize: "13px" }}>
                      Nonaktifkan Profil (Disable Profile)
                    </label>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    {activeModal === "add" ? "Simpan Profile" : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. MODAL DELETE PROFILE */}
          {activeModal === "delete" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "400px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
                  <i className="bi bi-trash-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Hapus PPPoE Profile?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Profil <strong className="text-dark">{selectedItem?.name}</strong> akan dihapus permanen. Pastikan tidak ada akun secret yang masih terhubung ke profil ini.
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
                    setProfilesList((prev) => prev.filter((i) => i.id !== selectedItem?.id));
                    closeModal();
                  }}
                >
                  Hapus Profile
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
      `}</style>
    </div>
  );
}