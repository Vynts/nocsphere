// app/(panel)/admin/pelanggan/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function PelangganPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all' | 'unpaid' | 'paid' | 'isolated'
  const [selectedRouter, setSelectedRouter] = useState("all");

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete' | 'invoice' | null
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock Data Pelanggan (Master Data yang terhubung dengan PPPoE Secret & Invoicing)
  const [pelangganList, setPelangganList] = useState([
    {
      id: "cust-1",
      code: "CUST-001",
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 12, Metro",
      secretUser: "budi_santoso",
      remoteAddress: "10.10.20.15",
      profile: "Home-20Mbps",
      price: 200000,
      dueDate: 5, // Tanggal 5 setiap bulan
      status: "paid", // 'paid' | 'unpaid' | 'isolated'
      router: "CCR1009 - Main Gateway",
    },
    {
      id: "cust-2",
      code: "CUST-002",
      name: "Ahmad Dahlan",
      phone: "082198765432",
      address: "Jl. Sudirman No. 45, Metro",
      secretUser: "ahmad_dahlan",
      remoteAddress: "10.10.20.16",
      profile: "Biz-50Mbps",
      price: 450000,
      dueDate: 10,
      status: "unpaid",
      router: "RB3011 - Tower Sektor A",
    },
    {
      id: "cust-3",
      code: "CUST-003",
      name: "Siti Rahma",
      phone: "085712341234",
      address: "Griya Asri Blok C3",
      secretUser: "siti_rahma",
      remoteAddress: "10.10.20.17",
      profile: "Home-10Mbps",
      price: 150000,
      dueDate: 1,
      status: "isolated",
      router: "CCR1009 - Main Gateway",
    },
    {
      id: "cust-4",
      code: "CUST-004",
      name: "Dewi Lestari",
      phone: "081377889900",
      address: "Jl. Kartini No. 88",
      secretUser: "dewi_lestari",
      remoteAddress: "10.10.20.18",
      profile: "Home-20Mbps",
      price: 200000,
      dueDate: 5,
      status: "paid",
      router: "RB3011 - Tower Sektor A",
    },
    {
      id: "cust-5",
      code: "CUST-005",
      name: "Eko Prasetyo",
      phone: "089655443322",
      address: "Perum Indah Regency A1",
      secretUser: "eko_prasetyo",
      remoteAddress: "10.10.20.19",
      profile: "Biz-50Mbps",
      price: 450000,
      dueDate: 20,
      status: "isolated",
      router: "CCR1009 - Main Gateway",
    },
    {
      id: "cust-6",
      code: "CUST-006",
      name: "Fajar Nugraha",
      phone: "082211334455",
      address: "Jl. Flamboyan No. 3",
      secretUser: "fajar_nugraha",
      remoteAddress: "10.10.20.20",
      profile: "Home-10Mbps",
      price: 150000,
      dueDate: 5,
      status: "paid",
      router: "RB3011 - Tower Sektor A",
    },
    {
      id: "cust-7",
      code: "CUST-007",
      name: "Gita Gutawa",
      phone: "081299001122",
      address: "Jl. Raden Intan No. 14",
      secretUser: "gita_gutawa",
      remoteAddress: "10.10.20.21",
      profile: "Home-20Mbps",
      price: 200000,
      dueDate: 10,
      status: "unpaid",
      router: "CCR1009 - Main Gateway",
    },
    {
      id: "cust-8",
      code: "CUST-008",
      name: "Hendra Kurnia",
      phone: "087811223344",
      address: "Komp. Pertokoan Blok B",
      secretUser: "hendra_kurnia",
      remoteAddress: "10.10.20.22",
      profile: "Biz-50Mbps",
      price: 450000,
      dueDate: 15,
      status: "paid",
      router: "RB3011 - Tower Sektor A",
    },
    {
      id: "cust-9",
      code: "CUST-009",
      name: "Indah Permata",
      phone: "081344556677",
      address: "Jl. Diponegoro No. 29",
      secretUser: "indah_permata",
      remoteAddress: "10.10.20.23",
      profile: "Home-20Mbps",
      price: 200000,
      dueDate: 5,
      status: "paid",
      router: "CCR1009 - Main Gateway",
    },
    {
      id: "cust-10",
      code: "CUST-010",
      name: "Joko Widodo",
      phone: "081122334455",
      address: "Ruko Sentra Bisnis No. 1",
      secretUser: "joko_widodo",
      remoteAddress: "10.10.20.24",
      profile: "Pro-100Mbps",
      price: 850000,
      dueDate: 1,
      status: "paid",
      router: "RB3011 - Tower Sektor A",
    },
    {
      id: "cust-11",
      code: "CUST-011",
      name: "Krisna Bayu",
      phone: "085266778899",
      address: "Jl. Mawar No. 7",
      secretUser: "krisna_bayu",
      remoteAddress: "10.10.20.25",
      profile: "Home-10Mbps",
      price: 150000,
      dueDate: 10,
      status: "isolated",
      router: "CCR1009 - Main Gateway",
    },
  ]);

  // Form State untuk Add / Edit
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    phone: "",
    address: "",
    secretUser: "",
    remoteAddress: "",
    profile: "Home-20Mbps",
    price: 200000,
    dueDate: 5,
    router: "CCR1009 - Main Gateway",
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

  // Filter List Data
  const filteredList = useMemo(() => {
    return pelangganList.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.secretUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery);

      const matchStatus = selectedStatus === "all" || item.status === selectedStatus;
      const matchRouter = selectedRouter === "all" || item.router === selectedRouter;

      return matchQuery && matchStatus && matchRouter;
    });
  }, [pelangganList, searchQuery, selectedStatus, selectedRouter]);

  // Hitung Stat Sum
  const paidCount = useMemo(() => pelangganList.filter((i) => i.status === "paid").length, [pelangganList]);
  const unpaidCount = useMemo(() => pelangganList.filter((i) => i.status === "unpaid").length, [pelangganList]);
  const isolatedCount = useMemo(() => pelangganList.filter((i) => i.status === "isolated").length, [pelangganList]);

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
    const nextCode = `CUST-${String(pelangganList.length + 1).padStart(3, "0")}`;
    setFormData({
      code: nextCode,
      name: "",
      phone: "",
      address: "",
      secretUser: "",
      remoteAddress: "",
      profile: "Home-20Mbps",
      price: 200000,
      dueDate: 5,
      router: "CCR1009 - Main Gateway",
    });
    setActiveModal("add");
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      phone: item.phone,
      address: item.address,
      secretUser: item.secretUser,
      remoteAddress: item.remoteAddress,
      profile: item.profile,
      price: item.price,
      dueDate: item.dueDate,
      router: item.router,
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setActiveModal("delete");
  };

  const openGenerateInvoiceModal = (item) => {
    setSelectedItem(item);
    setActiveModal("invoice");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (activeModal === "add") {
      const newItem = {
        id: `cust-${Date.now()}`,
        status: "unpaid",
        ...formData,
      };
      setPelangganList((prev) => [newItem, ...prev]);
    } else if (activeModal === "edit") {
      setPelangganList((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...i, ...formData } : i))
      );
    }
    closeModal();
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Data Pelanggan</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Master data pelanggan yang menghubungkan PPPoE Secret dengan sistem Penagihan (Invoice).
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
                    <i className="bi bi-person-plus-fill fs-6"></i>
                    <span>Tambah Pelanggan</span>
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
                    <span>Daftar Invoice</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>

                <Link
                  href="/admin/isolir"
                  className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-lock-fill fs-6 text-danger"></i>
                    <span>Daftar Isolir</span>
                  </div>
                  <i className="bi bi-chevron-right extra-small opacity-50"></i>
                </Link>
              </div>
            </div>

            {/* Filter Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter Pelanggan</h6>

              <div className="d-flex flex-column gap-3">
                {/* Filter Status Tagihan */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    STATUS TAGIHAN
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Status ({pelangganList.length})</option>
                    <option value="paid">Lunas ({paidCount})</option>
                    <option value="unpaid">Belum Bayar ({unpaidCount})</option>
                    <option value="isolated">Terisolir ({isolatedCount})</option>
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

        {/* RIGHT COLUMN: Table Master Pelanggan */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            {/* Search Bar & Counter */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari kode, nama, secret, atau HP..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {paidCount} Lunas
                </span>
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {unpaidCount} Belum Bayar
                </span>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  ● {isolatedCount} Isolir
                </span>
              </div>
            </div>

            {/* Table Pelanggan */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PELANGGAN</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>SECRET / IP</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PAKET & HARGA</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>JATUH TEMPO</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>STATUS</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* NAMA & KODE PELANGGAN */}
                        <td>
                          <div>
                            <span className="fw-bold text-dark d-block" style={{ fontSize: "14px" }}>
                              {item.name}
                            </span>
                            <span className="text-muted font-monospace extra-small d-block" style={{ fontSize: "11px" }}>
                              {item.code} • {item.phone}
                            </span>
                          </div>
                        </td>

                        {/* SECRET USERNAME & REMOTE IP */}
                        <td>
                          <div>
                            <span className="badge bg-light text-dark border font-monospace px-2 py-1 fw-semibold d-inline-block mb-1" style={{ fontSize: "12px" }}>
                              {item.secretUser}
                            </span>
                            {item.remoteAddress && (
                              <a
                                href={`http://${item.remoteAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-monospace text-primary text-decoration-none fw-semibold d-block ip-text-link"
                                style={{ fontSize: "12px" }}
                              >
                                {item.remoteAddress}
                              </a>
                            )}
                          </div>
                        </td>

                        {/* PAKET & TARIF BULANAN */}
                        <td>
                          <div>
                            <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>
                              {item.profile}
                            </span>
                            <span className="text-primary fw-bold font-monospace" style={{ fontSize: "12px" }}>
                              {formatRupiah(item.price)}/bln
                            </span>
                          </div>
                        </td>

                        {/* JATUH TEMPO */}
                        <td>
                          <span className="badge bg-light text-dark border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                            Tgl {item.dueDate} / Bulan
                          </span>
                        </td>

                        {/* STATUS TAGIHAN / ISOLIR */}
                        <td>
                          {item.status === "paid" && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                              Lunas
                            </span>
                          )}
                          {item.status === "unpaid" && (
                            <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                              Belum Bayar
                            </span>
                          )}
                          {item.status === "isolated" && (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                              Terisolir
                            </span>
                          )}
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="text-end pe-2">
                          <div className="d-inline-flex align-items-center gap-3">
                            {/* Buat Invoice Cepat */}
                            <button
                              type="button"
                              onClick={() => openGenerateInvoiceModal(item)}
                              className="btn p-0 border-0 text-success shadow-none hover-scale"
                              title="Terbitkan Invoice"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-file-earmark-plus-fill fs-6"></i>
                            </button>

                            {/* Edit Pelanggan */}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale"
                              title="Edit Pelanggan"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-pencil-fill fs-6"></i>
                            </button>

                            {/* Hapus Pelanggan */}
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="btn p-0 border-0 text-danger shadow-none hover-scale"
                              title="Hapus Pelanggan"
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
                        Tidak ada data pelanggan ditemukan
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
          {/* 1. MODAL TAMBAH & EDIT PELANGGAN */}
          {(activeModal === "add" || activeModal === "edit") && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "520px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  {activeModal === "add" ? "Tambah Pelanggan Baru" : `Edit Pelanggan: ${selectedItem?.name}`}
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="row g-2">
                    <div className="col-4">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        KODE
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-bold bg-light"
                        value={formData.code}
                        readOnly
                      />
                    </div>
                    <div className="col-8">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        NAMA LENGKAP
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Budi Santoso"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        NOMOR WHATSAPP/HP
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 081234567890"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        PPPOE SECRET USERNAME
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                        value={formData.secretUser}
                        onChange={(e) => setFormData({ ...formData, secretUser: e.target.value })}
                        placeholder="e.g. budi_santoso"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        PAKET / PROFILE
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
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        TANGGAL JATUH TEMPO
                      </label>
                      <select
                        className="form-select rounded-3 py-2 px-3 shadow-none"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: Number(e.target.value) })}
                      >
                        <option value={1}>Setiap Tgl 1</option>
                        <option value={5}>Setiap Tgl 5</option>
                        <option value={10}>Setiap Tgl 10</option>
                        <option value={15}>Setiap Tgl 15</option>
                        <option value={20}>Setiap Tgl 20</option>
                      </select>
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
                      ALAMAT LENGKAP PELANGGAN
                    </label>
                    <textarea
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      rows="2"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Jl. Merdeka No. 12, Metro"
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    {activeModal === "add" ? "Simpan Pelanggan" : "Update Pelanggan"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. MODAL TERBITKAN INVOICE */}
          {activeModal === "invoice" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "420px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle p-3 mb-2">
                  <i className="bi bi-receipt fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Terbitkan Invoice Baru?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Invoice bulan ini akan dibuatkan untuk pelanggan <strong className="text-dark">{selectedItem?.name}</strong> sejumlah{" "}
                  <strong className="text-primary">{formatRupiah(selectedItem?.price)}</strong>.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 pt-3 border-top">
                <button type="button" className="btn btn-light border flex-fill rounded-3 fw-semibold py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary flex-fill rounded-3 fw-semibold py-2"
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    alert(`Invoice berhasil diterbitkan untuk ${selectedItem?.name}!`);
                    closeModal();
                  }}
                >
                  Terbitkan Invoice
                </button>
              </div>
            </div>
          )}

          {/* 3. MODAL DELETE PELANGGAN */}
          {activeModal === "delete" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "400px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
                  <i className="bi bi-trash-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Hapus Data Pelanggan?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Pelanggan <strong className="text-dark">{selectedItem?.name}</strong> akan dihapus permanen beserta riwayat tagihannya.
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
                    setPelangganList((prev) => prev.filter((i) => i.id !== selectedItem?.id));
                    closeModal();
                  }}
                >
                  Hapus Pelanggan
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