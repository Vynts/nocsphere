// app/(panel)/admin/paket/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function PaketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all' | 'active' | 'disabled'
  const [selectedRouter, setSelectedRouter] = useState("all");

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock Data Paket (Master Data yang terhubung dengan PPPoE Profile & Pelanggan)
  const [paketList, setPaketList] = useState([
    {
      id: "pkg-1",
      code: "PKT-10M",
      name: "Home Starter 10M",
      profileName: "Home-10Mbps",
      rateLimit: "10M/10M",
      price: 150000,
      router: "CCR1009 - Main Gateway",
      activeCustomers: 18,
      description: "Paket ekonomis cocok untuk penggunaan 1-3 perangkat rumahan.",
      disabled: false,
    },
    {
      id: "pkg-2",
      code: "PKT-20M",
      name: "Home Fast 20M",
      profileName: "Home-20Mbps",
      rateLimit: "20M/20M",
      price: 200000,
      router: "CCR1009 - Main Gateway",
      activeCustomers: 45,
      description: "Paket terfavorit untuk keluarga, streaming HD & game online.",
      disabled: false,
    },
    {
      id: "pkg-3",
      code: "PKT-50M",
      name: "Business Pro 50M",
      profileName: "Biz-50Mbps",
      rateLimit: "50M/50M",
      price: 450000,
      router: "RB3011 - Tower Sektor A",
      activeCustomers: 12,
      description: "Koneksi dedicated untuk kantor cabang & WFH intensif.",
      disabled: false,
    },
    {
      id: "pkg-4",
      code: "PKT-100M",
      name: "Enterprise Ultra 100M",
      profileName: "Pro-100Mbps",
      rateLimit: "100M/100M",
      price: 850000,
      router: "RB3011 - Tower Sektor A",
      activeCustomers: 6,
      description: "Bandwidth besar untuk cafe, warnet, dan kantor skala menengah.",
      disabled: false,
    },
    {
      id: "pkg-5",
      code: "PKT-ISO",
      name: "Paket Isolir Tunggakan",
      profileName: "Isolir-1Mbps",
      rateLimit: "512k/1M",
      price: 0,
      router: "CCR1009 - Main Gateway",
      activeCustomers: 4,
      description: "Profil otomatis untuk pelanggan yang terisolir.",
      disabled: false,
    },
    {
      id: "pkg-6",
      code: "PKT-30M-PROMO",
      name: "Promo Merdeka 30M",
      profileName: "Promo-30Mbps",
      rateLimit: "30M/30M",
      price: 225000,
      router: "CCR1009 - Main Gateway",
      activeCustomers: 0,
      description: "Paket promo terbatas (sudah tidak berlaku).",
      disabled: true,
    },
  ]);

  // Form State untuk Add / Edit
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    profileName: "Home-20Mbps",
    rateLimit: "20M/20M",
    price: 200000,
    router: "CCR1009 - Main Gateway",
    description: "",
    disabled: false,
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Toggle Status Aktif / Nonaktif
  const handleToggleDisable = (id) => {
    setPaketList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, disabled: !item.disabled } : item))
    );
  };

  // Filter List Data
  const filteredList = useMemo(() => {
    return paketList.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rateLimit.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && !item.disabled) ||
        (selectedStatus === "disabled" && item.disabled);

      const matchRouter = selectedRouter === "all" || item.router === selectedRouter;

      return matchQuery && matchStatus && matchRouter;
    });
  }, [paketList, searchQuery, selectedStatus, selectedRouter]);

  // Hitung Summary Counter
  const activeCount = useMemo(() => paketList.filter((i) => !i.disabled).length, [paketList]);
  const disabledCount = useMemo(() => paketList.filter((i) => i.disabled).length, [paketList]);

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

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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
  const openAddModal = () => {
    const nextCode = `PKT-${String(paketList.length + 1 * 10)}M`;
    setFormData({
      code: nextCode,
      name: "",
      profileName: "Home-20Mbps",
      rateLimit: "20M/20M",
      price: 200000,
      router: "CCR1009 - Main Gateway",
      description: "",
      disabled: false,
    });
    setActiveModal("add");
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      profileName: item.profileName,
      rateLimit: item.rateLimit,
      price: item.price,
      router: item.router,
      description: item.description || "",
      disabled: item.disabled,
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setActiveModal("delete");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (activeModal === "add") {
      const newItem = {
        id: `pkg-${Date.now()}`,
        activeCustomers: 0,
        ...formData,
      };
      setPaketList((prev) => [newItem, ...prev]);
    } else if (activeModal === "edit") {
      setPaketList((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...i, ...formData } : i))
      );
    }
    closeModal();
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Paket Layanan</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola katalog paket internet, tarif bulanan, dan sinkronisasi dengan PPPoE Profile Router.
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
                <button
                  type="button"
                  onClick={openAddModal}
                  className="btn btn-primary rounded-3 fw-semibold text-start d-flex align-items-center justify-content-between px-3 py-2 shadow-none"
                  style={{ fontSize: "14px" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-box-seam-fill fs-6"></i>
                    <span>Tambah Paket</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-75"></i>
                </button>

                <Link
                  href="/admin/pelanggan"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-people-fill fs-6 text-primary"></i>
                    <span>Data Pelanggan</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>

                <Link
                  href="/admin/pppoe/profiles"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-sliders fs-6 text-primary"></i>
                    <span>PPPoE Profiles</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>
              </div>
            </div>

            {/* Filter Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter Paket</h6>

              <div className="d-flex flex-column gap-3">
                {/* Filter Status Paket */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    STATUS PAKET
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Status ({paketList.length})</option>
                    <option value="active">Aktif Only ({activeCount})</option>
                    <option value="disabled">Nonaktif Only ({disabledCount})</option>
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

        {/* RIGHT COLUMN: Table Master Paket */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            {/* Search Bar & Counter */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari kode, nama paket, atau speed..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  {activeCount} Aktif
                </span>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  {disabledCount} Nonaktif
                </span>
              </div>
            </div>

            {/* Table Paket */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>NAMA PAKET</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PROFILE & LIMIT</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>TARIF / BULAN</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PELANGGAN</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ROUTER</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* NAMA & KODE PAKET */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`d-inline-block rounded-circle ${item.disabled ? "bg-danger" : "bg-success"}`}
                              style={{ width: "9px", height: "9px" }}
                              title={item.disabled ? "Paket Nonaktif" : "Paket Aktif"}
                            ></span>
                            <div>
                              <span className={`fw-bold d-block ${item.disabled ? "text-muted text-decoration-line-through" : "text-dark"}`} style={{ fontSize: "14px" }}>
                                {item.name}
                              </span>
                              <span className="text-muted font-monospace extra-small d-block" style={{ fontSize: "11px" }}>
                                {item.code}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PPPOE PROFILE & RATE LIMIT */}
                        <td>
                          <div>
                            <span className="badge bg-light text-dark border font-monospace px-2 py-1 fw-semibold d-inline-block mb-1" style={{ fontSize: "12px" }}>
                              {item.profileName}
                            </span>
                            <span className="text-primary font-monospace fw-bold d-block" style={{ fontSize: "12px" }}>
                              {item.rateLimit}
                            </span>
                          </div>
                        </td>

                        {/* TARIF BULANAN */}
                        <td>
                          <span className="fw-bold text-dark font-monospace" style={{ fontSize: "14px" }}>
                            {formatRupiah(item.price)}
                          </span>
                        </td>

                        {/* JUMLAH PELANGGAN */}
                        <td>
                          <Link href="/admin/pelanggan" className="text-decoration-none">
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 fw-semibold hover-scale d-inline-block" style={{ fontSize: "12px" }}>
                              {item.activeCustomers} Pelanggan
                            </span>
                          </Link>
                        </td>

                        {/* ROUTER TARGET */}
                        <td>
                          <span className="text-secondary fw-medium" style={{ fontSize: "13px" }}>
                            {item.router}
                          </span>
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="text-end pe-2">
                          <div className="d-inline-flex align-items-center gap-3">
                            {/* Toggle Switch Aktif/Nonaktif */}
                            <button
                              type="button"
                              onClick={() => handleToggleDisable(item.id)}
                              className={`btn p-0 border-0 shadow-none hover-scale ${item.disabled ? "text-success" : "text-warning"}`}
                              title={item.disabled ? "Aktifkan Paket" : "Nonaktifkan Paket"}
                              style={{ cursor: "pointer" }}
                            >
                              <i className={`bi ${item.disabled ? "bi-check-circle-fill" : "bi-slash-circle-fill"} fs-6`}></i>
                            </button>

                            {/* Edit Paket */}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale"
                              title="Edit Paket"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-pencil-fill fs-6"></i>
                            </button>

                            {/* Hapus Paket */}
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="btn p-0 border-0 text-danger shadow-none hover-scale"
                              title="Hapus Paket"
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
                        Tidak ada data paket layanan ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER & PAGINATION CONTROLS */}
            {totalItems > 0 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 mt-2 border-top">
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

      {/* MODALS SECTION */}
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
          {/* MODAL TAMBAH & EDIT PAKET */}
          {(activeModal === "add" || activeModal === "edit") && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "500px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  {activeModal === "add" ? "Tambah Paket Layanan" : `Edit Paket: ${selectedItem?.name}`}
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="row g-2">
                    <div className="col-4">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        KODE PAKET
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-bold"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="PKT-20M"
                        required
                      />
                    </div>
                    <div className="col-8">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        NAMA PAKET
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Home Fast 20M"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        PPPOE PROFILE
                      </label>
                      <select
                        className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                        value={formData.profileName}
                        onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
                      >
                        <option value="Home-10Mbps">Home-10Mbps</option>
                        <option value="Home-20Mbps">Home-20Mbps</option>
                        <option value="Biz-50Mbps">Biz-50Mbps</option>
                        <option value="Pro-100Mbps">Pro-100Mbps</option>
                        <option value="Isolir-1Mbps">Isolir-1Mbps</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        RATE LIMIT (Rx/Tx)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                        value={formData.rateLimit}
                        onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                        placeholder="e.g. 20M/20M"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        TARIF BULANAN (RP)
                      </label>
                      <input
                        type="number"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="200000"
                        required
                      />
                    </div>
                    <div className="col-6">
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
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      DESKRIPSI PAKET
                    </label>
                    <textarea
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      rows="2"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g. Paket terfavorit untuk keluarga, streaming HD & game online."
                    ></textarea>
                  </div>

                  <div className="form-check form-switch pt-1">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      id="disabledPaketSwitch"
                      checked={formData.disabled}
                      onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold text-secondary extra-small" htmlFor="disabledPaketSwitch" style={{ fontSize: "13px" }}>
                      Nonaktifkan Paket (Tutup Penjualan Baru)
                    </label>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    {activeModal === "add" ? "Simpan Paket" : "Update Paket"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL DELETE PAKET */}
          {activeModal === "delete" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "400px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
                  <i className="bi bi-trash-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Hapus Paket Layanan?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Paket <strong className="text-dark">{selectedItem?.name}</strong> akan dihapus. Pastikan tidak ada pelanggan aktif yang sedang terikat pada paket ini.
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
                    setPaketList((prev) => prev.filter((i) => i.id !== selectedItem?.id));
                    closeModal();
                  }}
                >
                  Hapus Paket
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