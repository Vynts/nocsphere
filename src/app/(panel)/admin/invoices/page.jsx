// app/(panel)/admin/invoices/page.jsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all' | 'paid' | 'unpaid' | 'overdue'
  const [selectedMonth, setSelectedMonth] = useState("2026-07");

  // State Pagination (Default 10)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Modal & Data
  const [activeModal, setActiveModal] = useState(null); // 'pay' | 'detail' | 'delete' | 'report' | null
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");

  // State Cetak Laporan
  const [reportRangeType, setReportRangeType] = useState("monthly"); // 'monthly' | 'all' | 'custom'
  const [reportStartDate, setReportStartDate] = useState("2026-07-01");
  const [reportEndDate, setReportEndDate] = useState("2026-07-31");

  // Mock Data Invoice
  const [invoicesList, setInvoicesList] = useState([
    {
      id: "inv-101",
      invoiceNumber: "INV/202607/001",
      customerCode: "CUST-001",
      customerName: "Budi Santoso",
      phone: "081234567890",
      packageName: "Home Fast 20M",
      amount: 200000,
      dueDate: "2026-07-05",
      paidDate: "2026-07-03",
      status: "paid", // 'paid' | 'unpaid' | 'overdue'
      paymentMethod: "Transfer Bank - BCA",
    },
    {
      id: "inv-102",
      invoiceNumber: "INV/202607/002",
      customerCode: "CUST-002",
      customerName: "Ahmad Dahlan",
      phone: "082198765432",
      packageName: "Business Pro 50M",
      amount: 450000,
      dueDate: "2026-07-10",
      paidDate: null,
      status: "unpaid",
      paymentMethod: "-",
    },
    {
      id: "inv-103",
      invoiceNumber: "INV/202607/003",
      customerCode: "CUST-003",
      customerName: "Siti Rahma",
      phone: "085712341234",
      packageName: "Home Starter 10M",
      amount: 150000,
      dueDate: "2026-07-01",
      paidDate: null,
      status: "overdue",
      paymentMethod: "-",
    },
    {
      id: "inv-104",
      invoiceNumber: "INV/202607/004",
      customerCode: "CUST-004",
      customerName: "Dewi Lestari",
      phone: "081377889900",
      packageName: "Home Fast 20M",
      amount: 200000,
      dueDate: "2026-07-05",
      paidDate: "2026-07-04",
      status: "paid",
      paymentMethod: "Cash / Tunai",
    },
    {
      id: "inv-105",
      invoiceNumber: "INV/202607/005",
      customerCode: "CUST-005",
      customerName: "Eko Prasetyo",
      phone: "089655443322",
      packageName: "Business Pro 50M",
      amount: 450000,
      dueDate: "2026-07-20",
      paidDate: null,
      status: "unpaid",
      paymentMethod: "-",
    },
    {
      id: "inv-106",
      invoiceNumber: "INV/202607/006",
      customerCode: "CUST-006",
      customerName: "Fajar Nugraha",
      phone: "082211334455",
      packageName: "Home Starter 10M",
      amount: 150000,
      dueDate: "2026-07-05",
      paidDate: "2026-07-05",
      status: "paid",
      paymentMethod: "QRIS / E-Wallet",
    },
    {
      id: "inv-107",
      invoiceNumber: "INV/202607/007",
      customerCode: "CUST-007",
      customerName: "Gita Gutawa",
      phone: "081299001122",
      packageName: "Home Fast 20M",
      amount: 200000,
      dueDate: "2026-07-10",
      paidDate: null,
      status: "unpaid",
      paymentMethod: "-",
    },
    {
      id: "inv-108",
      invoiceNumber: "INV/202607/008",
      customerCode: "CUST-008",
      customerName: "Hendra Kurnia",
      phone: "087811223344",
      packageName: "Business Pro 50M",
      amount: 450000,
      dueDate: "2026-07-15",
      paidDate: "2026-07-12",
      status: "paid",
      paymentMethod: "Transfer Bank - Mandiri",
    },
    {
      id: "inv-109",
      invoiceNumber: "INV/202607/009",
      customerCode: "CUST-009",
      customerName: "Indah Permata",
      phone: "081344556677",
      packageName: "Home Fast 20M",
      amount: 200000,
      dueDate: "2026-07-05",
      paidDate: "2026-07-02",
      status: "paid",
      paymentMethod: "Cash / Tunai",
    },
    {
      id: "inv-110",
      invoiceNumber: "INV/202607/010",
      customerCode: "CUST-010",
      customerName: "Joko Widodo",
      phone: "081122334455",
      packageName: "Enterprise Ultra 100M",
      amount: 850000,
      dueDate: "2026-07-01",
      paidDate: "2026-07-01",
      status: "paid",
      paymentMethod: "Transfer Bank - BCA",
    },
    {
      id: "inv-111",
      invoiceNumber: "INV/202607/011",
      customerCode: "CUST-011",
      customerName: "Krisna Bayu",
      phone: "085266778899",
      packageName: "Home Starter 10M",
      amount: 150000,
      dueDate: "2026-07-10",
      paidDate: null,
      status: "overdue",
      paymentMethod: "-",
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

  // Hitung Stat Sum
  const totalIncome = useMemo(() => {
    return invoicesList
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + item.amount, 0);
  }, [invoicesList]);

  const totalUnpaid = useMemo(() => {
    return invoicesList
      .filter((item) => item.status === "unpaid" || item.status === "overdue")
      .reduce((sum, item) => sum + item.amount, 0);
  }, [invoicesList]);

  const paidCount = useMemo(() => invoicesList.filter((i) => i.status === "paid").length, [invoicesList]);
  const unpaidCount = useMemo(() => invoicesList.filter((i) => i.status === "unpaid" || i.status === "overdue").length, [invoicesList]);

  // Filter List Data
  const filteredList = useMemo(() => {
    return invoicesList.filter((item) => {
      const matchQuery =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery);

      const matchStatus = selectedStatus === "all" || item.status === selectedStatus;

      return matchQuery && matchStatus;
    });
  }, [invoicesList, searchQuery, selectedStatus]);

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handlers Modal & Process Payment
  const openPayModal = (item) => {
    setSelectedItem(item);
    setPaymentMethod("Transfer Bank - BCA");
    setActiveModal("pay");
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setActiveModal("detail");
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setActiveModal("delete");
  };

  const openReportModal = () => {
    setActiveModal("report");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const todayStr = new Date().toISOString().split("T")[0];

    setInvoicesList((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? {
              ...i,
              status: "paid",
              paidDate: todayStr,
              paymentMethod: paymentMethod,
            }
          : i
      )
    );
    closeModal();
  };

  // Filter Data untuk Cetak Laporan
  const reportFilteredData = useMemo(() => {
    if (reportRangeType === "monthly") {
      return invoicesList.filter((i) => i.dueDate.startsWith(selectedMonth));
    }
    if (reportRangeType === "custom") {
      return invoicesList.filter((i) => {
        return i.dueDate >= reportStartDate && i.dueDate <= reportEndDate;
      });
    }
    return invoicesList; // 'all'
  }, [invoicesList, reportRangeType, selectedMonth, reportStartDate, reportEndDate]);

  const reportTotalPaidAmount = useMemo(() => {
    return reportFilteredData
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);
  }, [reportFilteredData]);

  const reportTotalUnpaidAmount = useMemo(() => {
    return reportFilteredData
      .filter((i) => i.status === "unpaid" || i.status === "overdue")
      .reduce((sum, i) => sum + i.amount, 0);
  }, [reportFilteredData]);

  // Handler Trigger Print Window
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Daftar Invoice & Penagihan</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola riwayat tagihan pelanggan, konfirmasi pembayaran, dan rekap pendapatan bulanan.
        </p>
      </div>

      {/* 2 CARD STATISTIK UTAMA (PENDAPATAN & BELUM BAYAR) */}
      <div className="row g-3 mb-4">
        {/* Card 1: Pendapatan Bulan Ini */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary fw-semibold extra-small" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                PENDAPATAN BULAN INI
              </span>
              <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                <i className="bi bi-wallet2 fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-dark mb-0 fs-3">{formatRupiah(totalIncome)}</h3>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-semibold" style={{ fontSize: "11px" }}>
                {paidCount} Transaksi Lunas
              </span>
            </div>
            <p className="text-muted extra-small mb-0 mt-2" style={{ fontSize: "12px" }}>
              Total akumulasi tagihan pelanggan yang sudah dikonfirmasi lunas.
            </p>
          </div>
        </div>

        {/* Card 2: Total Belum Bayar / Piutang */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary fw-semibold extra-small" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                TOTAL BELUM BAYAR / PIUTANG
              </span>
              <div className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                <i className="bi bi-exclamation-circle-fill fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-dark mb-0 fs-3">{formatRupiah(totalUnpaid)}</h3>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fw-semibold" style={{ fontSize: "11px" }}>
                {unpaidCount} Tagihan Pending
              </span>
            </div>
            <p className="text-muted extra-small mb-0 mt-2" style={{ fontSize: "12px" }}>
              Potensi pendapatan dari tagihan yang belum dibayar / jatuh tempo.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Quick Actions, Filter & Cetak Laporan */}
        <div className="col-12 col-xl-3">
          <div className="d-flex flex-column gap-3">
            {/* Quick Actions Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Quick Actions</h6>

              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={openReportModal}
                  className="btn btn-primary rounded-3 fw-semibold text-start d-flex align-items-center justify-content-between px-3 py-2 shadow-none"
                  style={{ fontSize: "14px" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-printer-fill fs-6"></i>
                    <span>Cetak Laporan</span>
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
              <h6 className="fw-bold text-dark mb-3 fs-6">Filter Invoice</h6>

              <div className="d-flex flex-column gap-3">
                {/* Filter Periode Bulan */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    PERIODE BULAN
                  </label>
                  <input
                    type="month"
                    className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  />
                </div>

                {/* Filter Status Tagihan */}
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    STATUS PEMBAYARAN
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                  >
                    <option value="all">Semua Status ({invoicesList.length})</option>
                    <option value="paid">Lunas ({paidCount})</option>
                    <option value="unpaid">Belum Bayar</option>
                    <option value="overdue">Jatuh Tempo (Overdue)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Table Master Invoices */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            {/* Search Bar & Counter */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted extra-small"></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 ps-5 py-2 shadow-none border-1"
                  placeholder="Cari no. invoice, nama, atau kode pelanggan..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  {paidCount} Lunas
                </span>
                <span className="badge bg-danger-subtle text-danger border border-warning-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
                  {unpaidCount} Pending
                </span>
              </div>
            </div>

            {/* Table Invoices */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>NO. INVOICE</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PELANGGAN</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>PAKET & NOMINAL</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>JATUH TEMPO</th>
                    <th className="text-secondary fw-bold pb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>STATUS</th>
                    <th className="text-end text-secondary fw-bold pb-3 pe-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr key={item.id} className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        {/* NO INVOICE */}
                        <td>
                          <div>
                            <span className="fw-bold font-monospace text-dark d-block" style={{ fontSize: "13px" }}>
                              {item.invoiceNumber}
                            </span>
                            <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>
                              {item.paidDate ? `Lunas: ${item.paidDate}` : "Belum Dibayar"}
                            </span>
                          </div>
                        </td>

                        {/* PELANGGAN */}
                        <td>
                          <div>
                            <span className="fw-bold text-dark d-block" style={{ fontSize: "14px" }}>
                              {item.customerName}
                            </span>
                            <span className="text-muted font-monospace extra-small d-block" style={{ fontSize: "11px" }}>
                              {item.customerCode} • {item.phone}
                            </span>
                          </div>
                        </td>

                        {/* PAKET & NOMINAL */}
                        <td>
                          <div>
                            <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>
                              {item.packageName}
                            </span>
                            <span className="text-primary fw-bold font-monospace" style={{ fontSize: "13px" }}>
                              {formatRupiah(item.amount)}
                            </span>
                          </div>
                        </td>

                        {/* JATUH TEMPO */}
                        <td>
                          <span className="font-monospace text-secondary fw-medium" style={{ fontSize: "13px" }}>
                            {item.dueDate}
                          </span>
                        </td>

                        {/* STATUS */}
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
                          {item.status === "overdue" && (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
                              Jatuh Tempo
                            </span>
                          )}
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="text-end pe-2">
                          <div className="d-inline-flex align-items-center gap-2">
                            {/* Tombol Bayar jika Belum Lunas */}
                            {item.status !== "paid" && (
                              <button
                                type="button"
                                onClick={() => openPayModal(item)}
                                className="btn btn-sm btn-success rounded-3 fw-semibold px-2.5 py-1 shadow-none"
                                style={{ fontSize: "12px" }}
                              >
                                Bayar
                              </button>
                            )}

                            {/* Detail / Cetak Invoice */}
                            <button
                              type="button"
                              onClick={() => openDetailModal(item)}
                              className="btn p-0 border-0 text-primary shadow-none hover-scale ms-1"
                              title="Lihat Detail Invoice"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-receipt-cutoff fs-6"></i>
                            </button>

                            {/* Hapus Invoice */}
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="btn p-0 border-0 text-danger shadow-none hover-scale"
                              title="Hapus Invoice"
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
                        Tidak ada data invoice ditemukan
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
          {/* 1. MODAL KONFIRMASI PEMBAYARAN */}
          {activeModal === "pay" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "450px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">Konfirmasi Pembayaran</h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleConfirmPayment}>
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted extra-small">No. Invoice:</span>
                    <span className="fw-bold font-monospace text-dark extra-small">{selectedItem?.invoiceNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted extra-small">Pelanggan:</span>
                    <span className="fw-bold text-dark extra-small">{selectedItem?.customerName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted extra-small">Paket:</span>
                    <span className="fw-bold text-dark extra-small">{selectedItem?.packageName}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark extra-small">Total Bayar:</span>
                    <span className="fw-bold text-primary font-monospace fs-6">{formatRupiah(selectedItem?.amount || 0)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    METODE PEMBAYARAN
                  </label>
                  <select
                    className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Transfer Bank - BCA">Transfer Bank - BCA</option>
                    <option value="Transfer Bank - Mandiri">Transfer Bank - Mandiri</option>
                    <option value="Cash / Tunai">Cash / Tunai</option>
                    <option value="QRIS / E-Wallet">QRIS / E-Wallet</option>
                  </select>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                  <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                    Tandai Lunas
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. MODAL DETAIL INVOICE */}
          {activeModal === "detail" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "480px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">Detail Invoice</h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">No. Invoice</span>
                  <span className="fw-bold font-monospace text-dark extra-small">{selectedItem?.invoiceNumber}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Pelanggan</span>
                  <span className="fw-bold text-dark extra-small">{selectedItem?.customerName} ({selectedItem?.customerCode})</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">No. Telepon/WA</span>
                  <span className="fw-medium text-dark extra-small">{selectedItem?.phone}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Paket Internet</span>
                  <span className="fw-medium text-dark extra-small">{selectedItem?.packageName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Tanggal Jatuh Tempo</span>
                  <span className="fw-medium text-dark extra-small">{selectedItem?.dueDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted extra-small">Status Pembayaran</span>
                  <span className="fw-bold extra-small text-capitalize">{selectedItem?.status}</span>
                </div>
                {selectedItem?.paidDate && (
                  <div className="d-flex justify-content-between">
                    <span className="text-muted extra-small">Tanggal Bayar</span>
                    <span className="fw-medium text-dark extra-small">{selectedItem?.paidDate} ({selectedItem?.paymentMethod})</span>
                  </div>
                )}
                <hr className="my-1" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark extra-small">Total Tagihan</span>
                  <span className="fw-bold text-primary font-monospace fs-5">{formatRupiah(selectedItem?.amount || 0)}</span>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light border rounded-3 fw-semibold px-3 py-2"
                  onClick={() => window.print()}
                  style={{ fontSize: "13px" }}
                >
                  <i className="bi bi-printer me-1"></i> Cetak Invoice
                </button>
                <button type="button" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* 3. MODAL CETAK / EXPORT LAPORAN REKAP */}
          {activeModal === "report" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100 print-area"
              style={{ maxWidth: "700px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3 print-hide">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  <i className="bi bi-file-earmark-bar-graph-fill text-primary me-2"></i>
                  Cetak Laporan Penagihan
                </h6>
                <button type="button" className="btn-close shadow-none" onClick={closeModal}></button>
              </div>

              {/* OPSI FILTER RENTANG LAPORAN (HANYA MUNCUL DI LAYAR, SEMBUNYI SAAT DICETAK) */}
              <div className="bg-light p-3 rounded-3 mb-3 border print-hide">
                <label className="form-label fw-bold text-secondary extra-small mb-2" style={{ fontSize: "12px" }}>
                  PILIH RENTANG TANGGAL LAPORAN
                </label>

                <div className="row g-2 align-items-center">
                  <div className="col-12 col-sm-4">
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                      value={reportRangeType}
                      onChange={(e) => setReportRangeType(e.target.value)}
                      style={{ fontSize: "13px" }}
                    >
                      <option value="monthly">Per Bulan ({selectedMonth})</option>
                      <option value="all">Total Semua Data</option>
                      <option value="custom">Kustom Tanggal</option>
                    </select>
                  </div>

                  {reportRangeType === "custom" && (
                    <>
                      <div className="col-6 col-sm-4">
                        <input
                          type="date"
                          className="form-control rounded-3 py-1.5 px-2 shadow-none extra-small"
                          value={reportStartDate}
                          onChange={(e) => setReportStartDate(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-sm-4">
                        <input
                          type="date"
                          className="form-control rounded-3 py-1.5 px-2 shadow-none extra-small"
                          value={reportEndDate}
                          onChange={(e) => setReportEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* TAMPILAN PRATINJAU / HASIL CETAK LAPORAN */}
              <div className="p-2">
                {/* Header Kop Laporan */}
                <div className="text-center mb-4 border-bottom pb-3">
                  <h4 className="fw-bold text-dark mb-1">LAPORAN REKAPITULASI PENAGIHAN</h4>
                  <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                    {reportRangeType === "monthly" && `Periode Bulan: ${selectedMonth}`}
                    {reportRangeType === "all" && "Periode: Seluruh Data Transaksi"}
                    {reportRangeType === "custom" && `Periode Tanggal: ${reportStartDate} s/d ${reportEndDate}`}
                  </p>
                </div>

                {/* Summary Ringkasan Laporan */}
                <div className="row g-2 mb-3 text-center">
                  <div className="col-4">
                    <div className="p-2 border rounded-3 bg-light">
                      <span className="text-muted d-block extra-small" style={{ fontSize: "11px" }}>Total Transaksi</span>
                      <strong className="text-dark font-monospace" style={{ fontSize: "14px" }}>{reportFilteredData.length} Invoice</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 border rounded-3 bg-success-subtle">
                      <span className="text-success d-block extra-small" style={{ fontSize: "11px" }}>Lunas (Pendapatan)</span>
                      <strong className="text-success font-monospace" style={{ fontSize: "14px" }}>{formatRupiah(reportTotalPaidAmount)}</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 border rounded-3 bg-warning-subtle">
                      <span className="text-warning d-block extra-small" style={{ fontSize: "11px" }}>Pending (Piutang)</span>
                      <strong className="text-danger font-monospace" style={{ fontSize: "14px" }}>{formatRupiah(reportTotalUnpaidAmount)}</strong>
                    </div>
                  </div>
                </div>

                {/* Tabel Detail Laporan */}
                <div className="table-responsive" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  <table className="table table-sm table-bordered align-middle mb-0" style={{ fontSize: "12px" }}>
                    <thead className="table-light">
                      <tr>
                        <th>No. Invoice</th>
                        <th>Pelanggan</th>
                        <th>Paket</th>
                        <th>Jatuh Tempo</th>
                        <th>Status</th>
                        <th className="text-end">Nominal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportFilteredData.length > 0 ? (
                        reportFilteredData.map((item) => (
                          <tr key={item.id}>
                            <td className="font-monospace fw-bold">{item.invoiceNumber}</td>
                            <td>{item.customerName} ({item.customerCode})</td>
                            <td>{item.packageName}</td>
                            <td className="font-monospace">{item.dueDate}</td>
                            <td>
                              <span className={`fw-semibold ${item.status === "paid" ? "text-success" : "text-danger"}`}>
                                {item.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-end font-monospace fw-bold">{formatRupiah(item.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-3">
                            Tidak ada data transaksi pada rentang tanggal ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top mt-3 print-hide">
                <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeModal} style={{ fontSize: "13px" }}>
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handlePrintReport}
                  disabled={reportFilteredData.length === 0}
                  className="btn btn-primary rounded-3 fw-semibold px-4 py-2"
                  style={{ fontSize: "13px" }}
                >
                  <i className="bi bi-printer me-1"></i> Cetak Sekarang
                </button>
              </div>
            </div>
          )}

          {/* 4. MODAL DELETE INVOICE */}
          {activeModal === "delete" && (
            <div
              className="bg-white rounded-4 shadow-lg border p-4 w-100"
              style={{ maxWidth: "400px", animation: "slideDown 0.25s ease-out forwards" }}
            >
              <div className="text-center mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
                  <i className="bi bi-trash-fill fs-4"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">Hapus Data Invoice?</h6>
                <p className="text-muted extra-small mb-0" style={{ fontSize: "12px" }}>
                  Invoice <strong className="text-dark">{selectedItem?.invoiceNumber}</strong> akan dihapus permanen dari sistem penagihan.
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
                    setInvoicesList((prev) => prev.filter((i) => i.id !== selectedItem?.id));
                    closeModal();
                  }}
                >
                  Hapus Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Animation, Hover & Print Rules */}
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

        /* MEDIA PRINT STYLES */
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hide {
            display: none !important;
          }
          .table-responsive {
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}