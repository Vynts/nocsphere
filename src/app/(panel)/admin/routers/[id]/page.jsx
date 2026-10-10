// app/(panel)/admin/routers/[id]/page.jsx
"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";

export default function DetailRouterPage({ params }) {
  const resolvedParams = use(params);
  const routerId = resolvedParams?.id || "1";

  // State Interface & Loading/Error
  const [selectedInterface, setSelectedInterface] = useState("ether1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Detail Router
  const [routerInfo, setRouterInfo] = useState({
    name: "Loading...",
    label_router: "Loading...",
    ip: "Loading...",
    port: "Loading...",
    location: "Loading...",
    connectionType: "Loading...",
    uptime: "Loading...",
    status: "Offline",
    cpuLoad: 0,
    ramUsage: "0 / 0 GiB",
    diskUsage: "0 / 0 GiB",
    activePppoe: 0,
    autoIsolir: false,
  });

  // State Realtime Traffic
  const [currentRx, setCurrentRx] = useState(0);
  const [currentTx, setCurrentTx] = useState(0);
  const [bandwidthHistory, setBandwidthHistory] = useState([
    { rx: 0, tx: 0 },
    { rx: 0, tx: 0 },
    { rx: 0, tx: 0 },
    { rx: 0, tx: 0 },
    { rx: 0, tx: 0 },
    { rx: 0, tx: 0 },
  ]);

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Helper untuk konversi Byte ke GiB
  const bytesToGiB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

  // Fetch Data dari API Backend (Polling setiap 3 detik)
  useEffect(() => {
    let isMounted = true;

    const fetchRouterData = async () => {
      const token = localStorage.getItem("access_token"); // Ambil token dari localStorage
      if (!token) return setError("Token tidak ditemukan. Silakan login kembali.");

      try {
        // Sesuaikan URL endpoint dengan domain / base URL API Anda
        const response = await fetch(
          `http://localhost:8000/api/router?id_router=${routerId}&interface_name=${selectedInterface}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }

        const data = await response.json();

        if (!isMounted) return;

        // Extract data dari response API
        const sys = data.system_resource || {};
        const isConnected = data.status === "connected";
        const bw = data.bandwidth;

        const formatUptime = (uptimeStr) => {
          if (!uptimeStr || uptimeStr === "-") return "-";
          
          // Mengubah "14d06h23m12s" atau "2w4d06h" menjadi "14d 06h 23m 12s"
          return uptimeStr.replace(/(\d+[a-zA-Z]+)/g, "$1 ").trim();
        };

        // Update Info Router
        setRouterInfo((prev) => ({
          ...prev,
          label_router: data.label_router || prev.label_router,
          ip: data.host,
          port: data.port,
          uptime: formatUptime(sys.uptime),
          location: data.location || "-",
          connectionType: data.connection_type ||"-",
          activePppoe: data.active_pppoe || 0,
          autoIsolir: data.auto_isolir || false,
          status: isConnected ? "Online" : "Offline",
          cpuLoad: isConnected ? (sys.cpu_load_percent ?? 0) : 0,
          ramUsage: isConnected && sys.ram
            ? `${bytesToGiB(sys.ram.used_bytes)} / ${bytesToGiB(sys.ram.total_bytes)} GiB`
            : "0 / 0 GiB",
          diskUsage: isConnected && sys.disk
            ? `${bytesToGiB(sys.disk.used_bytes)} / ${bytesToGiB(sys.disk.total_bytes)} GiB`
            : "0 / 0 GiB",
        }));

        // Update Realtime Traffic (Mbps)
        const rxMbps = bw.rx_mbps;
        const txMbps = bw.tx_mbps;

        setCurrentRx(rxMbps);
        setCurrentTx(txMbps);

        // Update History Chart (Max 10 data point)
        setBandwidthHistory((prev) => [
          ...prev.slice(prev.length >= 10 ? 1 : 0),
          { rx: rxMbps, tx: txMbps },
        ]);

        setError(null);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Jalankan pertama kali saat komponen/interface berubah
    fetchRouterData();

    // Set interval polling setiap 3 detik
    const interval = setInterval(fetchRouterData, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [routerId, selectedInterface]);

  const isOnline =
      routerInfo.status?.toLowerCase() === "online";

  // SVG Chart Generator
  const maxVal = 10;
  const chartHeight = 140;
  const chartWidth = 600;

  const generateSvgPath = (key) => {
    if (bandwidthHistory.length === 0) return "";
    const points = bandwidthHistory.map((item, index) => {
      const x = (index / (bandwidthHistory.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (item[key] / maxVal) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Router Detail</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Informasi konfigurasi router dan pemantauan traffic bandwidth
          real-time.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Quick Actions */}
        <div className="col-12 col-xl-3">
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            <h6 className="fw-bold text-dark mb-3 fs-6">Quick Actions</h6>

            <div className="d-flex flex-column gap-2">
              <Link
                href="/admin/routers/add"
                className="btn btn-primary rounded-3 fw-semibold text-start d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                style={{ fontSize: "14px" }}
              >
                <i className="bi bi-plus-lg fs-6"></i>
                <span>Add New Router</span>
              </Link>

              <hr className="my-2 opacity-10" />

              <Link
                href="/admin/routers"
                className="btn btn-light border rounded-3 fw-medium text-secondary text-start d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
              >
                <i className="bi bi-arrow-left fs-6"></i>
                <span>Kembali ke Routers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Informasi Router & Chart Bandwidth Real-Time */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          <div className="d-flex flex-column gap-4">
            {/* CARD 1: INFORMASI ROUTER */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="fw-bold text-dark mb-0 fs-6">
                    {routerInfo.label_router || routerInfo.name}
                  </h5>
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
                      {routerInfo.status || "offline"}
                    </span>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-secondary border rounded-2 px-2 py-1 fw-normal extra-small">
                    {routerInfo.label_router || "N/A"}
                  </span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    IP Address / Host
                  </span>
                  <span className="fw-bold text-dark fs-6">
                    {routerInfo.ip}
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    Port API
                  </span>
                  <span className="fw-bold text-dark fs-6">
                    {routerInfo.port || "-"}
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    Lokasi / Sektor
                  </span>
                  <span className="fw-bold text-dark fs-6">
                    {routerInfo.location || "-"}
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    Tipe Koneksi
                  </span>
                  <span className="fw-bold text-dark fs-6">
                    {routerInfo.connectionType}
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    Uptime
                  </span>
                  <span className="fw-bold text-dark fs-6">
                    {routerInfo.uptime}
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    User Aktif (PPPoE)
                  </span>
                  <span className="fw-bold text-primary fs-6">
                    {routerInfo.activePppoe} Pelanggan
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-6">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    Auto Isolir
                  </span>
                  <span
                    className={`badge ${routerInfo.autoIsolir ? "bg-success" : "bg-secondary"} rounded-pill px-3 py-1`}
                  >
                    {routerInfo.autoIsolir ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: RESOURCE METRICS */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Resource Metrics</h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="p-3 border rounded-3 bg-light text-center">
                    <span
                      className="text-muted extra-small d-block mb-2 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      CPU Load
                    </span>
                    <h5 className="fw-bold text-dark mb-2 fs-6">
                      {routerInfo.cpuLoad}%
                    </h5>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 border rounded-3 bg-light text-center">
                    <span
                      className="text-muted extra-small d-block mb-2 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      RAM Usage
                    </span>
                    <h6 className="fw-bold text-dark mb-2 fs-6">
                      {routerInfo.ramUsage}
                    </h6>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 border rounded-3 bg-light text-center">
                    <span
                      className="text-muted extra-small d-block mb-2 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      Disk Usage
                    </span>
                    <h6 className="fw-bold text-dark mb-2 fs-6">
                      {routerInfo.diskUsage}
                    </h6>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 border rounded-3 bg-light text-center">
                    <span
                      className="text-muted extra-small d-block mb-1 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      Traffic Now
                    </span>
                    <div
                      className="extra-small text-muted text-start mt-1"
                      style={{ fontSize: "11px" }}
                    >
                      <div className="d-flex justify-content-between">
                        <span>↑ Out:</span>{" "}
                        <strong className="text-dark">{currentTx} MB</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>↓ In:</span>{" "}
                        <strong className="text-dark">{currentRx} MB</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: REALTIME BANDWIDTH CHART */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="fw-bold text-dark mb-0 fs-6">
                    Traffic Bandwidth Real-Time
                  </h6>
                  <p
                    className="text-muted extra-small mb-0"
                    style={{ fontSize: "12px" }}
                  >
                    Pantauan penggunaan bandwidth secara langsung.
                  </p>
                </div>
                <select
                  className="form-select form-select-sm rounded-3 shadow-none fw-semibold"
                  style={{ width: "150px" }}
                  value={selectedInterface}
                  onChange={(e) => setSelectedInterface(e.target.value)}
                >
                  <option value="ether1">ether1</option>
                  <option value="ether2">ether2</option>
                  <option value="sfp-plus1">sfp-plus1</option>
                </select>
              </div>

              <div className="position-relative w-100 rounded-3 border p-3 bg-white">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-100 h-auto"
                  style={{ maxHeight: "180px" }}
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2={chartWidth}
                    y2="0"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="35"
                    x2={chartWidth}
                    y2="35"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="70"
                    x2={chartWidth}
                    y2="70"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="105"
                    x2={chartWidth}
                    y2="105"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="140"
                    x2={chartWidth}
                    y2="140"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />

                  {/* Download Line (In) */}
                  <path
                    d={generateSvgPath("rx")}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ transition: "all 0.5s ease" }}
                  />

                  {/* Upload Line (Out) */}
                  <path
                    d={generateSvgPath("tx")}
                    fill="none"
                    stroke="#0d6efd"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ transition: "all 0.5s ease" }}
                  />
                </svg>

                <div className="d-flex justify-content-end gap-3 mt-2">
                  <div className="d-flex align-items-center gap-1">
                    <span
                      className="d-inline-block rounded-circle bg-success"
                      style={{ width: "8px", height: "8px" }}
                    ></span>
                    <span
                      className="text-muted extra-small"
                      style={{ fontSize: "11px" }}
                    >
                      In / Download (Rx)
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span
                      className="d-inline-block rounded-circle bg-primary"
                      style={{ width: "8px", height: "8px" }}
                    ></span>
                    <span
                      className="text-muted extra-small"
                      style={{ fontSize: "11px" }}
                    >
                      Out / Upload (Tx)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
