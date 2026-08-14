// app/(panel)/admin/wa-gateway/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function WaGatewayPage() {
  // State Status Koneksi Bot WA
  const [connectionStatus, setConnectionStatus] = useState("connected"); // 'connected' | 'disconnected' | 'connecting'
  const [deviceInfo, setDeviceInfo] = useState({
    name: "Server WA Billing 01",
    phone: "081234567890",
    sessionName: "session-billing-main",
    battery: "98%",
    lastSync: "2026-07-23 02:30:15",
  });

  // State Config Auto Notification Switches
  const [autoNotifyConfig, setAutoNotifyConfig] = useState({
    sendNewInvoice: true,
    sendReminderDueDate: true,
    sendIsolatedNotice: true,
    sendPaymentReceipt: true,
  });

  // State Form Tes Kirim Pesan
  const [testMessageForm, setTestMessageForm] = useState({
    targetPhone: "",
    message: "",
  });
  const [testMessageResult, setTestMessageResult] = useState(null); // null | { type: 'success' | 'error', text: string }

  // State Template Pesan
  const [selectedTemplate, setSelectedTemplate] = useState("invoice");
  const [templates, setTemplates] = useState({
    invoice: "Halo {nama}, tagihan internet {paket} bulan ini sebesar {nominal} telah terbit. Silakan lakukan pembayaran sebelum {jatuh_tempo}. Terima kasih!",
    reminder: "PENGINGAT: Tagihan internet {nama} sebesar {nominal} akan jatuh tempo pada {jatuh_tempo}. Mohon segera melunasi agar terhindar dari pemutusan sementara.",
    isolated: "INFORMASI ISOLIR: Akses internet akun {username} diisolir sementara karena belum melakukan pembayaran tagihan bulan ini. Segera lakukan pembayaran untuk membuka akses.",
    receipt: "PEMBAYARAN DITERIMA: Terima kasih {nama}, pembayaran tagihan {invoice_no} sebesar {nominal} telah kami terima pada {tanggal_bayar}. Status: LUNAS.",
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Toggle Switch Auto Notification
  const handleToggleNotify = (key) => {
    setAutoNotifyConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handler Kirim Tes Pesan WA
  const handleSendTestMessage = (e) => {
    e.preventDefault();
    if (!testMessageForm.targetPhone || !testMessageForm.message) return;

    // Simulation Sending Process
    setTestMessageResult({ type: "info", text: "Mengirim pesan via API Gateway..." });

    setTimeout(() => {
      setTestMessageResult({
        type: "success",
        text: `Pesan tes berhasil dikirim ke ${testMessageForm.targetPhone}!`,
      });
      setTestMessageForm({ targetPhone: "", message: "" });
    }, 1200);
  };

  // Handler Save Template
  const handleTemplateChange = (text) => {
    setTemplates((prev) => ({
      ...prev,
      [selectedTemplate]: text,
    }));
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">WhatsApp Gateway & Notifikasi</h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola integrasi WhatsApp Bot, pemicu notifikasi tagihan otomatis, dan templat pesan untuk pelanggan.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Connection Status & Quick Action */}
        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3">
            {/* Status Device / QR Card */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  <i className="bi bi-whatsapp text-success me-2 fs-5"></i>
                  Status Perangkat WA
                </h6>
                {connectionStatus === "connected" && (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "11px" }}>
                    • Terhubung
                  </span>
                )}
                {connectionStatus === "disconnected" && (
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill fw-semibold" style={{ fontSize: "11px" }}>
                    • Terputus
                  </span>
                )}
              </div>

              {connectionStatus === "connected" ? (
                <div className="d-flex flex-column gap-3">
                  <div className="bg-light p-3 rounded-3 border">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-success-subtle text-success p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                        <i className="bi bi-phone-vibrate fs-4"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0">{deviceInfo.name}</h6>
                        <span className="text-muted font-monospace extra-small">{deviceInfo.phone}</span>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between extra-small">
                      <span className="text-muted">Sesi WA:</span>
                      <span className="fw-bold font-monospace text-dark">{deviceInfo.sessionName}</span>
                    </div>
                    <div className="d-flex justify-content-between extra-small mt-1">
                      <span className="text-muted">Baterai HP:</span>
                      <span className="fw-bold text-success">{deviceInfo.battery}</span>
                    </div>
                    <div className="d-flex justify-content-between extra-small mt-1">
                      <span className="text-muted">Sinkron Terakhir:</span>
                      <span className="fw-medium font-monospace text-secondary">{deviceInfo.lastSync}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConnectionStatus("disconnected")}
                    className="btn btn-outline-danger rounded-3 fw-semibold py-2 w-100 shadow-none"
                    style={{ fontSize: "13px" }}
                  >
                    Putuskan Sesi / Logout WA
                  </button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="bg-light p-3 border rounded-3 d-inline-block mb-3">
                    {/* Placeholder QR Code */}
                    <div className="bg-white p-2 border rounded-2 d-flex align-items-center justify-content-center mx-auto" style={{ width: "160px", height: "160px" }}>
                      <i className="bi bi-qr-code-scan display-4 text-secondary"></i>
                    </div>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">Pindai QR Code untuk Konek</h6>
                  <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                    Buka WhatsApp di HP Anda &gt; Tautan Perangkat &gt; Pindai QR Code di atas.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConnectionStatus("connected")}
                    className="btn btn-success rounded-3 fw-semibold px-4 py-2 w-100 shadow-none"
                    style={{ fontSize: "13px" }}
                  >
                    Simulasi Berhasil Konek
                  </button>
                </div>
              )}
            </div>

            {/* Config Pemicu Notifikasi Otomatis */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6">Pemicu Notifikasi Otomatis</h6>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Kirim Tagihan Baru</span>
                    <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>Saat invoice terbit tiap awal bulan</span>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={autoNotifyConfig.sendNewInvoice}
                      onChange={() => handleToggleNotify("sendNewInvoice")}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div>
                    <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Pengingat Jatuh Tempo</span>
                    <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>H-2 sebelum tanggal jatuh tempo</span>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={autoNotifyConfig.sendReminderDueDate}
                      onChange={() => handleToggleNotify("sendReminderDueDate")}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div>
                    <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Notifikasi Isolir</span>
                    <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>Saat akun terisolir otomatis</span>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={autoNotifyConfig.sendIsolatedNotice}
                      onChange={() => handleToggleNotify("sendIsolatedNotice")}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div>
                    <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Resi Pembayaran Lunas</span>
                    <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>Seketika setelah tagihan dibayar</span>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={autoNotifyConfig.sendPaymentReceipt}
                      onChange={() => handleToggleNotify("sendPaymentReceipt")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tes Kirim Pesan & Pengaturan Template */}
        <div className="col-12 col-xl-8" style={{ minWidth: 0 }}>
          <div className="d-flex flex-column gap-4">
            {/* 1. Card Tes Kirim Pesan Manual */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-1 fs-6">
                Tes Kirim Pesan WhatsApp API
              </h6>
              <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                Uji koneksi pengiriman pesan langsung dari server ke nomor tujuan.
              </p>

              {testMessageResult && (
                <div
                  className={`alert ${
                    testMessageResult.type === "success"
                      ? "alert-success"
                      : testMessageResult.type === "error"
                      ? "alert-danger"
                      : "alert-info"
                  } py-2 px-3 mb-3 rounded-3 extra-small`}
                >
                  {testMessageResult.text}
                </div>
              )}

              <form onSubmit={handleSendTestMessage}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-5">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NOMOR WHATSAPP TUJUAN
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-semibold"
                      placeholder="e.g. 081234567890"
                      value={testMessageForm.targetPhone}
                      onChange={(e) => setTestMessageForm({ ...testMessageForm, targetPhone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-7">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      ISI PESAN TES
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      placeholder="Tulis pesan uji coba di sini..."
                      value={testMessageForm.message}
                      onChange={(e) => setTestMessageForm({ ...testMessageForm, message: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    disabled={connectionStatus !== "connected"}
                    className="btn btn-primary rounded-3 fw-semibold px-4 py-2 shadow-none"
                    style={{ fontSize: "13px" }}
                  >
                    <i className="bi bi-paperplane-fill me-1"></i> Kirim Pesan Tes
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Card Editor Templat Pesan Notifikasi */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-1 fs-6">
                Templat Pesan Otomatis
              </h6>
              <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                Sesuaikan struktur kalimat pesan yang dikirimkan bot secara otomatis.
              </p>

              {/* Tab Opsi Template */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("invoice")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-1.5 ${
                    selectedTemplate === "invoice" ? "btn-primary text-white" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  Tagihan Baru
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("reminder")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-1.5 ${
                    selectedTemplate === "reminder" ? "btn-primary text-white" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  Pengingat H-2
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("isolated")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-1.5 ${
                    selectedTemplate === "isolated" ? "btn-primary text-white" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  Notifikasi Isolir
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("receipt")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-1.5 ${
                    selectedTemplate === "receipt" ? "btn-primary text-white" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  Resi Lunas
                </button>
              </div>

              {/* Editor Textarea */}
              <div className="mb-3">
                <textarea
                  className="form-control rounded-3 p-3 shadow-none"
                  rows="5"
                  value={templates[selectedTemplate]}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  style={{ fontSize: "13px" }}
                ></textarea>
              </div>

              {/* Bantuan Variable Placeholder */}
              <div className="bg-light p-3 rounded-3 border">
                <span className="fw-bold text-dark extra-small d-block mb-1" style={{ fontSize: "12px" }}>
                  Variabel Dinamis yang Tersedia:
                </span>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{nama}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{paket}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{nominal}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{jatuh_tempo}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{username}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{invoice_no}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{tanggal_bayar}`}</span>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-success rounded-3 fw-semibold px-4 py-2 shadow-none"
                  style={{ fontSize: "13px" }}
                >
                  Simpan Perubahan Templat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Animation Style */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}