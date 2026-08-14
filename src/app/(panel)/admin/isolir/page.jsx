// app/(panel)/admin/isolir/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function IsolirPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'auto' | 'manual'
  const [selectedRouter, setSelectedRouter] = useState("all");

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'manual_isolate' | 'unIsolate' | 'detail' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State untuk Isolir Manual Baru
  const [manualFormData, setManualFormData] = useState({
    customerCode: "",
    reason: "Perbaikan Jaringan / Pemeliharaan",
    note: "",
  });

  // Mock Data Pelanggan Terisolir (Daftar pelanggan yang terisolir di MikroTik & DB)
  const [isolirList, setIsolirList] = useState([
    {
      id: "iso-1",
      customerCode: "CUST-003",
      customerName: "Siti Rahma",
      phone: "085712341234",
      pppoeUsername: "siti_home",
      packageName: "Home Starter 10M",
      router: "CCR1009 - Main Gateway",
      isolateType: "auto", // 'auto' (Tunggakan Tagihan) | 'manual' (Manual Admin)
      isolateDate: "2026-07-06 00:01:15",
      invoiceNumber: "INV/202607/003",
      unpaidAmount: 150000,
      reason: "Tunggakan Tagihan (Jatuh Tempo: 01 Juli 2026)",
    },
    {
      id: "iso-2",
      customerCode: "CUST-011",
      customerName: "Krisna Bayu",
      phone: "085266778899",
      pppoeUsername: "krisna_011",
      packageName: "Home Starter 10M",
      router: "RB3011 - Tower Sektor A",
      isolateType: "auto",
      isolateDate: "2026-07-11 00:01:20",
      invoiceNumber: "INV/202607/011",
      unpaidAmount: 150000,
      reason: "Tunggakan Tagihan (Jatuh Tempo: 10 Juli 2026)",
    },
    {
      id: "iso-3",
      customerCode: "CUST-015",
      customerName: "Rudi Hermawan",
      phone: "081988776655",
      pppoeUsername: "rudi_biz",
      packageName: "Business Pro 50M",
      router: "CCR1009 - Main Gateway",
      isolateType: "manual",
      isolateDate: "2026-07-15 14:30:00",
      invoiceNumber: "-",
      unpaidAmount: 0,
      reason: "Permintaan Pelanggan (Cuti Langganan)",
    },
    {
      id: "iso-4",
      customerCode: "CUST-022",
      customerName: "Bambang Pamungkas",
      phone: "081233445566",
      pppoeUsername: "bambang_sec",
      packageName: "Home Fast 20M",
      router: "RB3011 - Tower Sektor A",
      isolateType: "manual",
      isolateDate: "2026-07-18 09:15:22",
      invoiceNumber: "-",
      unpaidAmount: 0,
      reason: "Indikasi Pelanggaran / Share Bandwidth Ilegal",
    },
    {
      id: "iso-5",
      customerCode: "CUST-029",
      customerName: "Diana Putri",
      phone: "087711223344",
      pppoeUsername: "diana_p",
      packageName: "Home Fast 20M",
      router: "CCR1009 - Main Gateway",
      isolateType: "auto",
      isolateDate: "2026-07-21 00:01:05",
      invoiceNumber: "INV/202607/029",
      unpaidAmount: 200000,
      reason: "Tunggakan Tagihan (Jatuh Tempo: 20 Juli 2026)",
    },
  ]);

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

  // Hitung Stat Count
  const autoIsolirCount = useMemo(() => isolirList.filter((i) => i.isolateType === "auto").length, [isolirList]);
  const manualIsolirCount = useMemo(() => isolirList.filter((i) => i.isolateType === "manual").length, [isolirList]);

  // Filter List Data
  const filteredList = useMemo(() => {
    return isolirList.filter((item) => {
      const matchQuery =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pppoeUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery);

      const matchType = selectedType === "all" || item.isolateType === selectedType;
      const matchRouter = selectedRouter === "all" || item.router === selectedRouter;

      return matchQuery && matchType && matchRouter;
    });
  }, [isolirList, searchQuery, selectedType, selectedRouter]);

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

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
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
  const openManualIsolirModal = () => {
    setManualFormData({
      customerCode: "",
      reason: "Perbaikan Jaringan / Pemeliharaan",
      note: "",
    });
    setActiveModal("manual_isolate");
  };

  const openUnIsolateModal = (item) => {
    setSelectedItem(item);
    setActiveModal("unIsolate");
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setActiveModal("detail");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  // Submit Isolir Manual Baru
  const handleConfirmManualIsolir = (e) => {
    e.preventDefault();
    if (!manualFormData.customerCode) return;

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newItem = {
      id: `iso-${Date.now()}`,
      customerCode: manualFormData.customerCode.toUpperCase(),
      customerName: "Pelanggan Manual", // Pada aplikasi nyata di-fetch berdasarkan kode
      phone: "081234560000",
      pppoeUsername: manualFormData.customerCode.toLowerCase(),
      packageName: "Home Fast 20M",
      router: "CCR1009 - Main Gateway",
      isolateType: "manual",
      isolateDate: nowStr,
      invoiceNumber: "-",
      unpaidAmount: 0,
      reason: `${manualFormData.reason}${manualFormData.note ? ` (${manualFormData.note})` : ""}`,
    };

    setIsolirList((prev) => [newItem, ...prev]);
    closeModal();
  };

  // Submit Buka Isolir (Un-isolate)
  const handleConfirmUnIsolate = () => {
    if (!selectedItem) return;

    setIsolirList((prev) => prev.filter((i) => i.id !== selectedItem.id));
    closeModal();
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Manajemen Isolir Pelanggan</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Pantau dan kelola pemutusan sementara akses internet pelanggan secara otomatis (tunggakan) maupun manual.
        </p>
      </div>

      {/* 2 CARD STATISTIK UTAMA (ISOLIR OTOMATIS & MANUAL) */}
      <div className="row g-3 mb-4">
        {/* Card 1: Isolir Otomatis (Sistem) */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary fw-semibold extra-small" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                ISOLIR OTOMATIS (SYSTEM)
              </span>
              <div className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                <i className="bi bi-robot fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-dark mb-0 fs-3">{autoIsolirCount} Pelanggan</h3>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fw-semibold" style={{ fontSize: "11px" }}>
                Tunggakan Tagihan
              </span>
            </div>
            <p className="text-muted extra-small mb-0 mt-2" style={{ fontSize: "12px" }}>
              Di-isolir otomatis oleh sistem karena melebihi tanggal jatuh tempo pembayaran invoice.
            </p>
          </div>
        </div>

        {/* Card 2: Isolir Manual (Admin) */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary fw-semibold extra-small" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                ISOLIR MANUAL (ADMIN)
              </span>
              <div className="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                <i className="bi bi-person-fill-lock fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-dark mb-0 fs-3">{manualIsolirCount} Pelanggan</h3>
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fw-semibold" style={{ fontSize: "11px" }}>
                Tindakan Admin
              </span>
            </div>
            <p className="text-muted extra-small mb-0 mt-2" style={{ fontSize: "12px" }}>
              Di-isolir manual oleh admin karena cuti langganan, pemeliharaan, atau pelanggaran.
            </p>
          </div>
        </div>
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
                  onClick={openManualIsolirModal}
                  className="btn btn-danger rounded-3 fw-semibold text-start d-flex align-items-center justify-content-between px-3 py-2 shadow-none"
                  style={{ fontSize: "14px" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-lock-fill fs-6"></i>
                    <span>Isolir Manual Baru</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-75"></i>
                </button>

                <Link
                  href="/admin/invoices"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-receipt-cutoff fs-6 text-primary"></i>
                    <span>Data Tagihan / Invoice</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>

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
              </div>
            </div>

            {/* Filter Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter Data Isolir</h6>

              <div className="d-flex flex-column gap-3">
                {/* Filter Tipe Isolir */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    TIPE ISOLIR
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedType}
                    onChange={handleTypeChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Tipe ({isolirList.length})</option>
                    <option value="auto">Otomatis / Sistem ({autoIsolirCount})</option>
                    <option value="manual">Manual Admin ({manualIsolirCount})</option>
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

        {/* RIGHT COLUMN: Table Master Isolir */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            {/* Search Bar & Counter */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari pppoe user, nama, atau kode..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  {autoIsolirCount} Auto
                </span>
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  {manualIsolirCount} Manual
                </span>
              </div>
            </div>

            {/* Table Isolir */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PELANGGAN & PPPOE</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>TIPE & TANGGAL</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ALASAN ISOLIR</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>ROUTER</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* PELANGGAN & PPPOE */}
                        <td>
                          <div>
                            <span className="fw-bold text-dark d-block" style={{ fontSize: "14px" }}>
                              {item.customerName}
                            </span>
                            <span className="text-muted font-monospace extra-small d-block" style={{ fontSize: "11px" }}>
                              {item.customerCode} • user: <strong className="text-primary">{item.pppoeUsername}</strong>
                            </span>
                          </div>
                        </td>

                        {/* TIPE & TANGGAL */}
                        <td>
                          <div>
                            {item.isolateType === "auto" ? (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fw-semibold d-inline-block mb-1" style={{ fontSize: "11px" }}>
                                Otomatis (Sistem)
                              </span>
                            ) : (
                              <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fw-semibold d-inline-block mb-1" style={{ fontSize: "11px" }}>
                                Manual (Admin)
                              </span>
                            )}
                            <span className="text-muted font-monospace extra-small d-block" style={{ fontSize: "11px" }}>
                              {item.isolateDate}
                            </span>
                          </div>
                        </td>

                        {/* ALASAN ISOLIR */}
                        <td>
                          <div style={{ maxWidth: "260px" }}>
                            <span className="fw-medium text-dark d-block text-truncate" style={{ fontSize: "13px" }} title={item.reason}>
                              {item.reason}
                            </span>
                            {item.unpaidAmount > 0 && (
                              <span className="text-danger fw-bold extra-small" style={{ fontSize: "11px" }}>
                                Tunggakan: {formatRupiah(item.unpaidAmount)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* ROUTER TARGET */}
                        <td>
                          <span className="text-secondary fw-medium" style={{ fontSize: "13px" }}>
                            {item.router}
                          </span>
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="text-end pe-2">
                          <div className="d-inline-flex align-items-center gap-2">
                            {/* Tombol Buka Isolir / Un-Isolate */}
                            <button
                              type="button"
                              onClick={() => openUnIsolateModal(item)}
                              className="btn btn-sm btn-success rounded-3 fw-semibold px-2.5 py-1 shadow-none"
                              style={{ fontSize: "12px" }}
                              title="Buka Isolir Pelanggan"
                            >
                              <i className="bi bi-unlock-fill me-1"></i>
                              Buka Isolir
                            </button>

                            {/* Detail Isolir */}
                            <button
                              type="button"
                              onClick={() => openDetailModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale ms-1"
                              title="Lihat Detail Isolir"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-info-circle-fill fs-6"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted" style={{ fontSize: "13px" }}>
                        Tidak ada data pelanggan terisolir ditemukan
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
          {/* 1. MODAL ISOLIR MANUAL BARU */}
          {activeModal === "manual_isolate" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "480px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  <i className="bi bi-lock-fill text-danger me-2"></i>
                  Eksekusi Isolir Manual
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleConfirmManualIsolir}>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      KODE PELANGGAN / USERNAME PPPOE
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-bold"
                      value={manualFormData.customerCode}
                      onChange={(e) => setManualFormData({ ...manualFormData, customerCode: e.target.value })}
                      placeholder="e.g. CUST-005 atau budi_home"
                      required
                    />
                    <span className="text-muted extra-small mt-1 d-block" style={{ fontSize: "11px" }}>
                      Sistem akan mengubah profile PPPoE user di MikroTik ke profile Isolir.
                    </span>
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      ALASAN ISOLIR
                    </label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={manualFormData.reason}
                      onChange={(e) => setManualFormData({ ...manualFormData, reason: e.target.value })}
                    >
                      <option value="Perbaikan Jaringan / Pemeliharaan">Perbaikan Jaringan / Pemeliharaan</option>
                      <option value="Permintaan Pelanggan (Cuti Langganan)">Permintaan Pelanggan (Cuti Langganan)</option>
                      <option value="Indikasi Pelanggaran / Share Bandwidth">Indikasi Pelanggaran / Share Bandwidth</option>
                      <option value="Tindakan Administratif Lainnya">Tindakan Administratif Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      CATATAN TAMBAHAN (OPTIONAL)
                    </label>
                    <textarea
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      rows="2"
                      value={manualFormData.note}
                      onChange={(e) => setManualFormData({ ...manualFormData, note: e.target.value })}
                      placeholder="Catatan internal admin..."
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-danger rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    Proses Isolir Sekarang
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. MODAL KONFIRMASI BUKA ISOLIR (UN-ISOLATE) */}
          {activeModal === "unIsolate" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "420px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle p-3 mb-2">
                  <i className="bi bi-unlock-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Buka Isolir Pelanggan?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Akses internet pelanggan <strong className="text-dark">{selectedItem?.customerName}</strong> ({selectedItem?.pppoeUsername}) akan dikembalikan ke paket awal di MikroTik.
                </p>
              </div>

              {selectedItem?.unpaidAmount > 0 && (
                <div className="alert alert-warning py-2 px-3 mb-3 rounded-3 extra-small text-start">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  Pelanggan ini masih memiliki tunggakan sebesar <strong>{formatRupiah(selectedItem?.unpaidAmount)}</strong>. Membuka isolir akan mengizinkan akses internet walau belum lunas.
                </div>
              )}

              <div className="d-flex align-items-center gap-2 pt-2 border-top">
                <button type="button" className="btn btn-light border flex-fill rounded-3 fw-semibold py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-success flex-fill rounded-3 fw-semibold py-2"
                  style={{ fontSize: "13px" }}
                  onClick={handleConfirmUnIsolate}
                >
                  Buka Isolir Sekarang
                </button>
              </div>
            </div>
          )}

          {/* 3. MODAL DETAIL ISOLIR */}
          {activeModal === "detail" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "450px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">Detail Informasi Isolir</h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Nama Pelanggan</span>
                  <span className="fw-bold text-dark extra-small">{selectedItem?.customerName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Kode / Username PPPoE</span>
                  <span className="fw-bold font-monospace text-primary extra-small">{selectedItem?.customerCode} ({selectedItem?.pppoeUsername})</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">No. Telepon / WA</span>
                  <span className="fw-medium text-dark extra-small">{selectedItem?.phone}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Paket Awal</span>
                  <span className="fw-medium text-dark extra-small">{selectedItem?.packageName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Router Target</span>
                  <span className="fw-medium text-dark extra-small">{selectedItem?.router}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Eksekutor / Tipe</span>
                  <span className="fw-bold extra-small text-capitalize">
                    {selectedItem?.isolateType === "auto" ? "Otomatis (Sistem Cron Job)" : "Manual (Tindakan Admin)"}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Waktu Eksekusi</span>
                  <span className="fw-medium text-dark extra-small font-monospace">{selectedItem?.isolateDate}</span>
                </div>
                <hr className="my-1" />
                <div>
                  <span className="text-muted extra-small d-block mb-1">Alasan Penyekatan:</span>
                  <p className="bg-light p-2.5 rounded-3 text-dark extra-small fw-medium mb-0 border">
                    {selectedItem?.reason}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                <button type="button" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Tutup
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