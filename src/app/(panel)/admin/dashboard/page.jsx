// app/(panel)/admin/dashboard/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Filler,
  PointElement,
  LineElement,
  Tooltip,
);

const monthlyFinanceData = {
  labels: ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
  datasets: [
    {
      type: "bar",
      label: "Pendapatan",
      data: [8500000, 9200000, 7800000, 11400000, 10800000, 12600000],
      backgroundColor: "rgba(13, 110, 253, 0.78)",
      hoverBackgroundColor: "#0b5ed7",
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 36,
      yAxisID: "revenue",
    },
    {
      type: "line",
      label: "Invoice terbayar",
      data: [31, 35, 29, 42, 39, 46],
      borderColor: "#20a37a",
      backgroundColor: "rgba(32, 163, 122, 0.10)",
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#20a37a",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHitRadius: 12,
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      yAxisID: "invoices",
    },
  ],
};

const monthlyFinanceOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 700,
    easing: "easeOutQuart",
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0",
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
      usePointStyle: true,
      callbacks: {
        label: (context) => {
          const value = context.parsed.y;
          if (context.dataset.yAxisID === "revenue") {
            return ` ${context.dataset.label}: ${new Intl.NumberFormat(
              "id-ID",
              {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              },
            ).format(value)}`;
          }
          return ` ${context.dataset.label}: ${value} invoice`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: "#64748b",
        padding: 10,
        font: { size: 11, weight: "500" },
      },
    },
    revenue: {
      type: "linear",
      position: "left",
      beginAtZero: true,
      border: { display: false },
      grid: { color: "rgba(148, 163, 184, 0.14)" },
      ticks: {
        color: "#64748b",
        padding: 10,
        font: { size: 11 },
        callback: (value) => `Rp ${(value / 1000000).toLocaleString("id-ID")} jt`,
      },
    },
    invoices: {
      type: "linear",
      position: "right",
      beginAtZero: true,
      border: { display: false },
      grid: { drawOnChartArea: false },
      ticks: {
        color: "#64748b",
        padding: 10,
        font: { size: 11 },
        precision: 0,
        callback: (value) => `${value}`,
      },
    },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [financeRange, setFinanceRange] = useState("6");
  const [visibleFinanceSeries, setVisibleFinanceSeries] = useState({
    revenue: true,
    invoices: true,
  });
  const [routerFilter, setRouterFilter] = useState("All Routers");
  const [routerSort, setRouterSort] = useState("Newest");
  const [invoiceFilter, setInvoiceFilter] = useState("All Invoices");
  const [companyProfile, setCompanyProfile] = useState(null);
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const onlineCount = routers.filter(
    (item) => item.status?.toLowerCase() === "online",
  ).length;

  const offlineCount = routers.filter(
    (item) => item.status?.toLowerCase() === "offline",
  ).length;

  const financeRangeLength = Number(financeRange);
  const financeChartData = {
    labels: monthlyFinanceData.labels.slice(-financeRangeLength),
    datasets: monthlyFinanceData.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.slice(-financeRangeLength),
      hidden:
        dataset.yAxisID === "revenue"
          ? !visibleFinanceSeries.revenue
          : !visibleFinanceSeries.invoices,
    })),
  };

  const processedRouters = routers
    .filter((item) => {
      if (routerFilter === "Online") return item.status === "online";
      if (routerFilter === "Offline") return item.status === "offline";
      return true; // "All Routers"
    })
    .sort((a, b) => {
      const idA = a.id_router || a.id || 0;
      const idB = b.id_router || b.id || 0;

      if (routerSort === "Newest") {
        return idB - idA; // ID terbesar/terbaru di atas
      }
      if (routerSort === "Oldest") {
        return idA - idB; // ID terkecil/terlama di atas
      }
      return 0;
    });

  const fetchRouters = async (isInitial = false) => {
    try {
      // Hanya tampilkan spinner loading besar jika ini load pertama kali
      if (isInitial) setLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await fetch("http://localhost:8000/api/router/list", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesi telah berakhir. Silakan login ulang.");
        }
        throw new Error(`Gagal mengambil data. Status: ${response.status}`);
      }

      const data = await response.json();
      // Update state secara halus di background (tanpa reload/flicker)
      setRouters(data);
    } catch (err) {
      console.error("Fetch Router Error:", err);
      if (isInitial) setError(err.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouters(true);

    let intervalId;

    const startPolling = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          // Hanya fetch jika tab browser sedang aktif dibuka user
          if (document.visibilityState === "visible") {
            fetchRouters(false);
          }
        }, 30000);
      }
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRouters(false);
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login_admin");
        return;
      }

      // Fetch Profil Perusahaan
      fetch("http://localhost:8000/api/perusahaan/me", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data profil");
          return res.json();
        })
        .then((resJson) => {
          if (resJson.status === "success") {
            setCompanyProfile(resJson.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching company profile:", err);
        })
        .finally(() => {
          if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
          }
          window.scrollTo(0, 0);
        });
    }

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  const dropdownMenuStyle = {
    fontSize: "13px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
    padding: "6px",
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-3 mb-md-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Dashboard</h3>
        <p className="text-muted mb-0 small fs-md-6 text-break">
          Selamat datang kembali. Ringkasan status router MikroTik, performa
          jaringan, dan tagihan Anda.
        </p>
      </div>

      <div className="row g-3 g-md-4 align-items-start">
        {/* LEFT COLUMN: Profile Card & Support Contact */}
        <div className="col-12 col-xl-4 col-xxl-3 d-flex flex-column gap-3 gap-md-4">
          {/* 1. Profile Card */}
          <div
            className="card border-0 rounded-4 text-white bg-primary bg-gradient p-3 p-sm-4"
            style={{ boxShadow: "0 8px 20px rgba(13, 110, 253, 0.15)" }}
          >
            {/* User Info */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle bg-white bg-opacity-25 border border-white border-opacity-25 d-flex align-items-center justify-content-center fw-bold text-white fs-5 flex-shrink-0"
                style={{ width: "42px", height: "42px" }}
              >
                AE
              </div>
              <div className="overflow-hidden min-w-0">
                <h6
                  className="fw-bold mb-0 text-white text-truncate"
                  style={{ fontSize: "15px" }}
                >
                  {companyProfile?.nama_perusahaan || "Memuat..."}
                </h6>
                <span
                  className="text-white-50 small text-truncate d-block"
                  style={{ fontSize: "12px" }}
                >
                  {companyProfile?.email || "Memuat..."}
                </span>
              </div>
            </div>

            {/* Address */}
            <div
              className="text-white-50 mb-3 small"
              style={{ fontSize: "12px" }}
            >
              <div className="text-break">
                {companyProfile?.alamat_perusahaan || "Memuat..."}
              </div>
              <div>Indonesia</div>
            </div>

            {/* Account Details */}
            <div className="py-2 border-top border-bottom border-white border-opacity-25 small mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                <span
                  className="text-white-50 flex-shrink-0"
                  style={{ fontSize: "12px" }}
                >
                  ID Pelanggan
                </span>
                <span
                  className="fw-semibold font-monospace text-white text-truncate"
                  style={{ fontSize: "12px" }}
                >
                  NOC-88492
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center gap-2">
                <span
                  className="text-white-50 flex-shrink-0"
                  style={{ fontSize: "12px" }}
                >
                  IP Binding
                </span>
                <span
                  className="fw-semibold font-monospace text-white text-truncate"
                  style={{ fontSize: "12px" }}
                >
                  10.10.20.150
                </span>
              </div>
            </div>

            {/* Package Details */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                <span
                  className="text-white-50 small flex-shrink-0"
                  style={{ fontSize: "12px" }}
                >
                  Level Aktif:
                </span>
                <span
                  className="badge bg-success text-white px-2 py-1 flex-shrink-0"
                  style={{ fontSize: "10px" }}
                >
                  Active
                </span>
              </div>
              <h6 className="fw-bold text-white mb-2 fs-6 text-break">
                {companyProfile?.level || "Memuat..."}
              </h6>
            </div>
          </div>

          {/* 2. Support Contact Card */}
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="bi bi-headset fs-6"></i>
              </div>
              <h6 className="fw-bold text-dark mb-0 fs-6">Support Contact</h6>
            </div>
            <p className="text-muted small mb-3" style={{ fontSize: "12px" }}>
              Butuh bantuan teknis atau pelaporan gangguan jaringan? Buat tiket
              dukungan sekarang.
            </p>

            <Link
              href="/admin/tickets"
              className="btn btn-primary btn-sm rounded-3 fw-semibold w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2"
              style={{ fontSize: "13px" }}
            >
              <i className="bi bi-ticket-perferated-fill"></i>
              <span>Hubungi Tim Nocsphere</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-12 col-xl-8 col-xxl-9" style={{ minWidth: 0 }}>
          {/* BANNER CLIENT PORTAL */}
          <div
            className="card border-0 rounded-4 bg-dark text-white p-3 p-sm-4 mb-3 mb-md-4"
            style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
          >
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-8">
                <h5 className="fw-bold text-white mb-1 fs-6 fs-md-5">
                  Client Portal & Self-Service
                </h5>
                <p
                  className="text-secondary small mb-0 text-break"
                  style={{ fontSize: "13px" }}
                >
                  Kelola isolir otomatis, pemantauan trafik router MikroTik, dan
                  pembayaran invoice secara mudah.
                </p>
              </div>
              <div className="col-12 col-md-4 text-md-end">
                <Link
                  href="/portal"
                  className="btn btn-primary btn-sm rounded-3 fw-semibold px-3 py-2 text-nowrap d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: "13px" }}
                >
                  <span>Buka Portal Client</span>
                  <i
                    className="bi bi-arrow-right"
                    style={{ fontSize: "12px" }}
                  ></i>
                </Link>
              </div>
            </div>
          </div>

          {/* 3 CARDS STATS */}
          <div className="row g-3 mb-3 mb-md-4">
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <span className="text-secondary small fw-medium mb-1">
                  Router Online
                </span>
                <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">
                  {loading ? "..." : onlineCount}
                </h4>
                <span className="text-success small fw-medium d-flex align-items-center gap-1">
                  Dari {routers.length} Total Router
                </span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <span className="text-secondary small fw-medium mb-1">
                  Router Offline
                </span>
                <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">
                  {loading ? "..." : offlineCount}
                </h4>
                <span className="text-danger small fw-medium d-flex align-items-center gap-1">
                  Perlu Perhatian
                </span>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-4">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <span className="text-secondary small fw-medium mb-1">
                  Pelanggan Ter-isolir
                </span>
                <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">3</h4>
                <span className="text-danger small fw-medium">Ter-isolir</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <span className="text-secondary small fw-medium mb-1">
                  Pendapatan (Bulan Ini)
                </span>
                <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">Rp 000</h4>
                <span className="text-success small fw-medium d-flex align-items-center gap-1">
                  <i className="bi bi-arrow-up-short fs-6"></i> +12% dari bulan
                  lalu
                </span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <span className="text-secondary small fw-medium mb-1">
                  Invoice Unpaid
                </span>
                <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">
                  8 Invoice
                </h4>
                <span className="text-danger small fw-medium">
                  Rp 2.100.000 terhutang
                </span>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-4">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <span className="text-secondary small fw-medium mb-1">
                  PPPoE Down
                </span>
                <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">
                  3 Session
                </h4>
                <span className="text-danger small fw-medium">
                  Sesi terputus / RTO
                </span>
              </div>
            </div>
          </div>

          {/* MONTHLY REVENUE & PAID INVOICES CHART */}
          <div
            className="card p-3 p-sm-4 mb-3 mb-md-4 overflow-hidden"
            style={{
              ...cardCleanStyle,
              background:
                "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
              <div>
                <h5 className="fw-bold text-dark mb-1 fs-6 fs-md-5">
                  Pendapatan & Invoice Terbayar
                </h5>
                <p className="text-secondary small mb-0">
                  Tren performa keuangan selama {financeRange} bulan terakhir
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-end flex-wrap gap-2">
                <select
                  className="form-select form-select-sm rounded-3"
                  value={financeRange}
                  onChange={(event) => setFinanceRange(event.target.value)}
                  aria-label="Pilih rentang waktu grafik"
                  style={{
                    width: "auto",
                    minWidth: "150px",
                    borderColor: "#dbe3ee",
                    color: "#334155",
                    fontSize: "12px",
                    boxShadow: "none",
                  }}
                >
                  <option value="3">3 bulan terakhir</option>
                  <option value="6">6 bulan terakhir</option>
                </select>
                {[
                  {
                    key: "revenue",
                    label: "Pendapatan",
                    color: "#0d6efd",
                  },
                  {
                    key: "invoices",
                    label: "Invoice terbayar",
                    color: "#20a37a",
                  },
                ].map((series) => (
                  <label
                    key={series.key}
                    className="d-inline-flex align-items-center gap-2 rounded-3 px-2 px-sm-3 border bg-white"
                    style={{
                      minHeight: "31px",
                      cursor: "pointer",
                      color: visibleFinanceSeries[series.key]
                        ? "#334155"
                        : "#94a3b8",
                      borderColor: "#dbe3ee",
                      fontSize: "12px",
                      transition: "all 160ms ease",
                    }}
                  >
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      checked={visibleFinanceSeries[series.key]}
                      onChange={() =>
                        setVisibleFinanceSeries((current) => ({
                          ...current,
                          [series.key]: !current[series.key],
                        }))
                      }
                      aria-label={`Tampilkan ${series.label}`}
                      style={{
                        width: "14px",
                        height: "14px",
                        cursor: "pointer",
                        accentColor: series.color,
                      }}
                    />
                    <span className="fw-semibold text-nowrap">
                      {series.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div
              role="img"
              aria-label={`Grafik pendapatan dan invoice terbayar: ${financeChartData.labels.join(", ")}`}
              style={{ height: "300px", minWidth: 0 }}
            >
              <Chart
                type="bar"
                data={financeChartData}
                options={{
                  ...monthlyFinanceOptions,
                  scales: {
                    ...monthlyFinanceOptions.scales,
                    revenue: {
                      ...monthlyFinanceOptions.scales.revenue,
                      display: visibleFinanceSeries.revenue,
                    },
                    invoices: {
                      ...monthlyFinanceOptions.scales.invoices,
                      display: visibleFinanceSeries.invoices,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* TABLE 1: ROUTERS (Status: Online & Offline Only) */}
          <div
            className="card mb-3 mb-md-4 overflow-hidden"
            style={cardCleanStyle}
          >
            <div className="p-3 p-sm-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="fw-bold text-dark mb-0 fs-6 fs-md-5 me-2">
                  Routers
                </h5>

                <div className="dropdown">
                  <button
                    className="btn btn-sm bg-white border rounded-3 text-secondary fw-semibold px-2 px-sm-3 py-1 d-flex align-items-center gap-2 shadow-none dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderColor: "#cbd5e1" }}
                  >
                    <span>{routerFilter}</span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-start rounded-3 mt-1"
                    style={dropdownMenuStyle}
                  >
                    {["All Routers", "Online", "Offline"].map((item) => (
                      <li key={item}>
                        <button
                          className={`dropdown-item rounded-2 py-1 px-3 fw-medium ${
                            routerFilter === item
                              ? "bg-light text-dark fw-bold"
                              : "text-secondary"
                          }`}
                          onClick={() => setRouterFilter(item)}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-sm bg-white border rounded-3 text-secondary fw-semibold px-2 px-sm-3 py-1 d-flex align-items-center gap-2 shadow-none dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderColor: "#cbd5e1" }}
                  >
                    <span>{routerSort}</span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-start rounded-3 mt-1"
                    style={dropdownMenuStyle}
                  >
                    {["Newest", "Oldest"].map((item) => (
                      <li key={item}>
                        <button
                          className={`dropdown-item rounded-2 py-1 px-3 fw-medium ${
                            routerSort === item
                              ? "bg-light text-dark fw-bold"
                              : "text-secondary"
                          }`}
                          onClick={() => setRouterSort(item)}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/admin/routers"
                className="text-decoration-none text-secondary fw-semibold small d-flex align-items-center gap-1"
              >
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="table-responsive">
              <table
                className="table align-middle mb-0"
                style={{ fontSize: "14px" }}
              >
                <thead>
                  <tr
                    className="text-uppercase text-secondary"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    <th className="px-3 px-sm-4 py-3 fw-bold border-bottom">
                      Router ID
                    </th>
                    <th className="py-3 fw-bold border-bottom">Device Model</th>
                    <th className="py-3 fw-bold border-bottom">IP / Host</th>
                    <th className="py-3 fw-bold border-bottom">Port</th>
                    <th className="py-3 fw-bold border-bottom">Status</th>
                    <th className="px-3 px-sm-4 py-3 border-bottom text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {processedRouters.length > 0 ? (
                    processedRouters.map((item, index) => {
                      const isOnline = item.status === "online";

                      return (
                        <tr key={item.id_router || item.id || index}>
                          {/* Nama Router */}
                          <td className="px-3 px-sm-4 py-3 fw-bold text-dark text-nowrap">
                            {item.label_router || `${index + 1}`}
                          </td>

                          {/* Deskripsi/Tipe (Sesuaikan nama field database Anda, misal: item.deskripsi) */}
                          <td className="py-3 text-secondary text-nowrap">
                            {item.deskripsi || "MikroTik Router"}
                          </td>

                          {/* IP Address */}
                          <td
                            className="py-3 fw-semibold text-dark fw-medium text-nowrap"
                            style={{ fontSize: "13px" }}
                          >
                            {item.host}
                          </td>

                          {/* Tanggal (Format otomatis jika ada field created_at) */}
                          <td className="py-3 text-secondary text-nowrap">
                            {item.port | "-"}
                          </td>

                          {/* Status Badge (Warna berubah otomatis sesuai isOnline) */}
                          <td className="py-3 text-nowrap">
                            <span
                              className="badge rounded-pill px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                              style={{
                                backgroundColor: isOnline
                                  ? "#e6f4ea"
                                  : "#fce8e6",
                                color: isOnline ? "#137333" : "#c5221f",
                                fontSize: "12px",
                              }}
                            >
                              <i
                                className={
                                  isOnline
                                    ? "bi bi-check-circle-fill"
                                    : "bi bi-x-circle-fill"
                                }
                                style={{ fontSize: "11px" }}
                              ></i>
                              <span className="text-capitalize">
                                {item.status}
                              </span>
                            </span>
                          </td>

                          {/* Action Button/Icon */}
                          <td className="px-3 px-sm-4 py-3 text-end text-secondary">
                            <i
                              className="bi bi-arrow-right fs-6"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    /* Fallback jika data kosong */
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        {loading
                          ? "Memuat data router..."
                          : "Belum ada data router."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 2: INVOICES (Status: Paid, Processing, & Unpaid) */}
          <div className="card overflow-hidden mb-4" style={cardCleanStyle}>
            <div className="p-3 p-sm-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="fw-bold text-dark mb-0 fs-6 fs-md-5 me-2">
                  Invoices
                </h5>

                <div className="dropdown">
                  <button
                    className="btn btn-sm bg-white border rounded-3 text-secondary fw-semibold px-2 px-sm-3 py-1 d-flex align-items-center gap-2 shadow-none dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderColor: "#cbd5e1" }}
                  >
                    <span>{invoiceFilter}</span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-start rounded-3 mt-1"
                    style={dropdownMenuStyle}
                  >
                    {["All Invoices", "Paid", "Pending", "Unpaid"].map(
                      (item) => (
                        <li key={item}>
                          <button
                            className={`dropdown-item rounded-2 py-1 px-3 fw-medium ${
                              invoiceFilter === item
                                ? "bg-light text-dark fw-bold"
                                : "text-secondary"
                            }`}
                            onClick={() => setInvoiceFilter(item)}
                          >
                            {item}
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <Link
                href="/admin/invoices"
                className="text-decoration-none text-secondary fw-semibold small d-flex align-items-center gap-1"
              >
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="table-responsive">
              <table
                className="table align-middle mb-0"
                style={{ fontSize: "14px" }}
              >
                <thead>
                  <tr
                    className="text-uppercase text-secondary"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    <th className="px-3 px-sm-4 py-3 fw-bold border-bottom">
                      Invoice ID
                    </th>
                    <th className="py-3 fw-bold border-bottom">Client</th>
                    <th className="py-3 fw-bold border-bottom">Due Date</th>
                    <th className="py-3 fw-bold border-bottom">Amount</th>
                    <th className="py-3 fw-bold border-bottom">Status</th>
                    <th className="px-3 px-sm-4 py-3 border-bottom text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 px-sm-4 py-3 font-monospace fw-bold text-dark text-nowrap">
                      INV-2026-001
                    </td>
                    <td className="py-3 text-secondary text-nowrap">
                      Randi Saputra
                    </td>
                    <td className="py-3 text-secondary text-nowrap">
                      Jul 25, 2026
                    </td>
                    <td className="py-3 fw-bold text-dark text-nowrap">
                      Rp 250.000
                    </td>
                    <td className="py-3 text-nowrap">
                      <span
                        className="badge rounded-pill px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                        style={{
                          backgroundColor: "#e6f4ea",
                          color: "#137333",
                          fontSize: "12px",
                        }}
                      >
                        <i
                          className="bi bi-check-circle-fill"
                          style={{ fontSize: "11px" }}
                        ></i>
                        <span>Paid</span>
                      </span>
                    </td>
                    <td className="px-3 px-sm-4 py-3 text-end text-secondary">
                      <i className="bi bi-arrow-right fs-6"></i>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 px-sm-4 py-3 font-monospace fw-bold text-dark text-nowrap">
                      INV-2026-002
                    </td>
                    <td className="py-3 text-secondary text-nowrap">
                      Studio Cyber
                    </td>
                    <td className="py-3 text-secondary text-nowrap">
                      Jul 20, 2026
                    </td>
                    <td className="py-3 fw-bold text-dark text-nowrap">
                      Rp 750.000
                    </td>
                    <td className="py-3 text-nowrap">
                      <span
                        className="badge rounded-pill px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                        style={{
                          backgroundColor: "#e8f0fe",
                          color: "#1a73e8",
                          fontSize: "12px",
                        }}
                      >
                        <i
                          className="bi bi-clock-fill"
                          style={{ fontSize: "11px" }}
                        ></i>
                        <span>Pending</span>
                      </span>
                    </td>
                    <td className="px-3 px-sm-4 py-3 text-end text-secondary">
                      <i className="bi bi-arrow-right fs-6"></i>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 px-sm-4 py-3 font-monospace fw-bold text-dark text-nowrap">
                      INV-2026-003
                    </td>
                    <td className="py-3 text-secondary text-nowrap">
                      Kopi Kenangan Network
                    </td>
                    <td className="py-3 text-secondary text-nowrap">
                      Jul 18, 2026
                    </td>
                    <td className="py-3 fw-bold text-dark text-nowrap">
                      Rp 500.000
                    </td>
                    <td className="py-3 text-nowrap">
                      <span
                        className="badge rounded-pill px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                        style={{
                          backgroundColor: "#fce8e6",
                          color: "#c5221f",
                          fontSize: "12px",
                        }}
                      >
                        <i
                          className="bi bi-exclamation-circle-fill"
                          style={{ fontSize: "11px" }}
                        ></i>
                        <span>Unpaid</span>
                      </span>
                    </td>
                    <td className="px-3 px-sm-4 py-3 text-end text-secondary">
                      <i className="bi bi-arrow-right fs-6"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
