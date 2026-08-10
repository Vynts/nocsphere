// app/(panel)/admin/routers/add/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AddRouterPage() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    connectionType: "Direct IP",
    ip: "",
    apiPort: "8728",
    vpnServer: "",
    vpnUser: "",
    vpnSecret: "",
    username: "",
    password: "",
    autoIsolir: true,
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting new router data:", formData);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Add New Router</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Tambahkan perangkat MikroTik baru untuk otomatisasi billing & isolir.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4 align-items-start">
          
          {/* LEFT COLUMN: Quick Actions */}
          <div className="col-12 col-xl-3">
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Quick Actions</h6>

              <div className="d-flex flex-column gap-2">
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

          {/* RIGHT COLUMN: Clean Modern Form */}
          <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
            <div className="card p-4 p-sm-5" style={cardCleanStyle}>
              
              {/* Section 1: Identitas Router */}
              <div className="mb-4 pb-3 border-bottom">
                <h6 className="fw-bold text-dark mb-1 fs-6">1. Identitas Router</h6>
                <p className="text-muted extra-small mb-3" style={{ fontSize: "13px" }}>
                  Informasi dasar nama dan lokasi pemasangan perangkat.
                </p>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NAMA ROUTER / IDENTITY <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none border-1"
                      placeholder="e.g. CCR1009 - Main Gateway"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      LOKASI / SEKTOR
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none border-1"
                      placeholder="e.g. Tower Server Natar"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Koneksi & Jaringan */}
              <div className="mb-4 pb-3 border-bottom">
                <h6 className="fw-bold text-dark mb-1 fs-6">2. Koneksi & Network</h6>
                <p className="text-muted extra-small mb-3" style={{ fontSize: "13px" }}>
                  Tentukan bagaimana sistem dapat mengakses API MikroTik.
                </p>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      TIPE KONEKSI / TUNNEL <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold border-1"
                      name="connectionType"
                      value={formData.connectionType}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                    >
                      <option value="Direct IP">Direct Public IP / Domain</option>
                      <option value="WireGuard">VPN WireGuard Tunnel</option>
                      <option value="OpenVPN">VPN OpenVPN (OVPN)</option>
                      <option value="L2TP">VPN L2TP / IPsec</option>
                      <option value="SSTP">VPN SSTP Tunnel</option>
                      <option value="ZeroTier">ZeroTier One</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      IP ADDRESS / HOST <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 font-monospace shadow-none border-1"
                      placeholder="103.150.20.1"
                      name="ip"
                      value={formData.ip}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>

                  {/* Dynamic Extra VPN Box */}
                  {formData.connectionType !== "Direct IP" && (
                    <div className="col-12 mt-3">
                      <div className="p-3 rounded-3 border bg-white" style={{ borderColor: "#e2e8f0" }}>
                        <span className="fw-bold text-dark extra-small d-block mb-2" style={{ fontSize: "12px" }}>
                          PARAMETERTAMBAHAN ({formData.connectionType.toUpperCase()})
                        </span>
                        <div className="row g-2">
                          <div className="col-12 col-md-4">
                            <input
                              type="text"
                              className="form-control form-control-sm rounded-3 py-2 shadow-none"
                              placeholder="Server / Endpoint"
                              name="vpnServer"
                              value={formData.vpnServer}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-12 col-md-4">
                            <input
                              type="text"
                              className="form-control form-control-sm rounded-3 py-2 shadow-none"
                              placeholder="User / Public Key"
                              name="vpnUser"
                              value={formData.vpnUser}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-12 col-md-4">
                            <input
                              type="password"
                              className="form-control form-control-sm rounded-3 py-2 shadow-none"
                              placeholder="Secret / Passphrase"
                              name="vpnSecret"
                              value={formData.vpnSecret}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Kredensial API MikroTik */}
              <div className="mb-4 pb-3 border-bottom">
                <h6 className="fw-bold text-dark mb-1 fs-6">3. Kredensial API RouterOS</h6>
                <p className="text-muted extra-small mb-3" style={{ fontSize: "13px" }}>
                  Username dan password user API yang terdaftar di MikroTik.
                </p>

                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      PORT API <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control rounded-3 py-2 px-3 font-monospace shadow-none border-1"
                      placeholder="8728"
                      name="apiPort"
                      value={formData.apiPort}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      API USERNAME <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none border-1"
                      placeholder="admin_api"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      API PASSWORD <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-3 py-2 px-3 shadow-none border-1"
                      placeholder="••••••••"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Fitur Otomatisasi (Interactive Card) */}
              <div className="mb-4">
                <div 
                  className="p-3 rounded-3 border d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                >
                  <div className="me-3">
                    <label className="fw-bold text-dark d-block small mb-0 cursor-pointer" htmlFor="autoIsolir">
                      Fitur Isolir Otomatis
                    </label>
                    <span className="text-muted extra-small d-block" style={{ fontSize: "12px" }}>
                      Otomatis nonaktifkan akun PPPoE / Secret pelanggan saat jatuh tempo.
                    </span>
                  </div>
                  <div className="form-check form-switch m-0 p-0">
                    <input
                      className="form-check-input cursor-pointer"
                      type="checkbox"
                      role="switch"
                      id="autoIsolir"
                      name="autoIsolir"
                      checked={formData.autoIsolir}
                      onChange={handleChange}
                      style={{ width: "42px", height: "22px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-end gap-2 pt-2">
                <Link
                  href="/admin/routers"
                  className="btn btn-light border rounded-3 fw-semibold px-4 py-2 text-secondary shadow-none"
                  style={{ fontSize: "14px", borderColor: "#cbd5e1" }}
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 fw-semibold px-4 py-2 shadow-none d-flex align-items-center gap-2"
                  style={{ fontSize: "14px" }}
                >
                  <i className="bi bi-check-lg fs-6"></i>
                  <span>Simpan Router</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}