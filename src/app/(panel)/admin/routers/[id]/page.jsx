// app/(panel)/admin/routers/[id]/page.jsx
"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";

export default function DetailRouterPage({ params }) {
  const resolvedParams = use(params);
  const routerId = resolvedParams?.id || "1";

  // State Detail Router Saat Ini
  const [routerInfo, setRouterInfo] = useState({
    id: routerId,
    name: "CCR1009 - Main Gateway",
    identity: "MikroTik-CCR1009",
    location: "Tower Server Natar",
    connectionType: "Direct Public IP",
    ip: "103.150.20.1",
    apiPort: "8728",
    username: "admin_api",
    status: "Online",
    uptime: "14d 06h 23m",
    cpuLoad: 18,
    ramUsage: "1.74 / 4 GiB",
    diskUsage: "1.66 / 35 GiB",
    activePppoe: 142,
    autoIsolir: true,
  });

  // State Realtime Traffic
  const [selectedInterface, setSelectedInterface] = useState("ether1-WAN");
  const [currentRx, setCurrentRx] = useState(4.72);
  const [currentTx, setCurrentTx] = useState(2.98);
  const [bandwidthHistory, setBandwidthHistory] = useState([
    { rx: 2.5, tx: 1.2 },
    { rx: 3.1, tx: 1.8 },
    { rx: 4.0, tx: 2.1 },
    { rx: 3.8, tx: 2.0 },
    { rx: 4.5, tx: 2.5 },
    { rx: 4.72, tx: 2.98 },
  ]);

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Real-time Traffic Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newRx = parseFloat((Math.random() * (8.0 - 3.0) + 3.0).toFixed(2));
      const newTx = parseFloat((Math.random() * (5.0 - 1.5) + 1.5).toFixed(2));

      setCurrentRx(newRx);
      setCurrentTx(newTx);

      setBandwidthHistory((prev) => [
        ...prev.slice(1),
        { rx: newRx, tx: newTx },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // SVG Chart Generator
  const maxVal = 10;
  const chartHeight = 140;
  const chartWidth = 600;

  const generateSvgPath = (key) => {
    const points = bandwidthHistory.map((item, index) => {
      const x = (index / (bandwidthHistory.length - 1)) * chartWidth;
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
                    {routerInfo.name}
                  </h5>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill extra-small">
                    ● {routerInfo.status}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-secondary border rounded-2 px-2 py-1 fw-normal extra-small">
                    {routerInfo.identity}
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
                  <span className="fw-bold text-dark fs-6 font-monospace">
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
                  <span className="fw-bold text-dark fs-6 font-monospace">
                    {routerInfo.apiPort}
                  </span>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <span
                    className="text-muted extra-small d-block text-uppercase fw-semibold mb-1"
                    style={{ fontSize: "11px" }}
                  >
                    Lokasi / Sektor
                  </span>
                  <span className="fw-semibold text-dark fs-6">
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
                  <span className="fw-semibold text-dark fs-6">
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
                  <span className="fw-semibold text-dark fs-6">
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
                      className="text-muted extra-small d-block mb-1 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      CPU Load
                    </span>
                    <h5 className="fw-bold text-dark mb-0">
                      {routerInfo.cpuLoad}%
                    </h5>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 border rounded-3 bg-light text-center">
                    <span
                      className="text-muted extra-small d-block mb-1 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      RAM Usage
                    </span>
                    <h6 className="fw-bold text-dark mb-0 fs-6">
                      {routerInfo.ramUsage}
                    </h6>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 border rounded-3 bg-light text-center">
                    <span
                      className="text-muted extra-small d-block mb-1 text-uppercase fw-semibold"
                      style={{ fontSize: "11px" }}
                    >
                      Disk Usage
                    </span>
                    <h6 className="fw-bold text-dark mb-0 fs-6">
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
                  <option value="ether1-WAN">ether1-WAN</option>
                  <option value="ether2-LAN">ether2-LAN</option>
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
