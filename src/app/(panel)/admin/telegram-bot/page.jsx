// app/(panel)/admin/telegram-bot/page.jsx
"use client";

import React, { useState } from "react";

export default function TelegramBotPage() {
  // State Status Bot Telegram
  const [botStatus, setBotStatus] = useState("active"); // 'active' | 'inactive'
  const [botConfig, setBotConfig] = useState({
    botName: "NOC Network Alert Bot",
    botUsername: "@NetMonitorAlert_Bot",
    botToken: "6789123450:AAH-x9Y_ExampleTokenKey123456",
    targetChatId: "-1001987654321", // Channel / Group ID Telegram
    chatType: "Group Supergroup (NOC & Technician Team)",
  });

  // State Config Switch Pemicu Notifikasi Kerusakan/Offline
  const [alertTriggers, setAlertTriggers] = useState({
    deviceOffline: true,      // Perangkat / MikroTik / OLT Offline
    highLatency: true,        // Latency tinggi / RTT spike
    interfaceDown: true,      // Port / Interface ether down
    customerReport: true,     // Laporan pelanggan / tiket gangguan baru
    powerLoss: false,         // Notifikasi padam listrik (UPS)
  });

  // State Tes Kirim Notifikasi Manual
  const [testAlertForm, setTestAlertForm] = useState({
    alertType: "OFFLINE", // 'OFFLINE' | 'LATENCY' | 'TICKET'
    deviceName: "Router Core Utama - Wilayah Metro",
    description: "Ping Timeout > 1000ms (Unreachable)",
  });
  const [testResult, setTestResult] = useState(null);

  // State Templat Pesan Alert
  const [selectedAlertTemplate, setSelectedAlertTemplate] = useState("offline");
  const [alertTemplates, setAlertTemplates] = useState({
    offline: "[ALERT: PERANGKAT OFFLINE]\n\nNama Device: {device_name}\nIP Address: {ip_address}\nLokasi: {location}\nWaktu Down: {time}\nKeterangan: {description}\n\nMohon tim NOC & Teknisi segera melakukan pengecekan!",
    latency: "[WARNING: LATENCY TINGGI]\n\nNama Device: {device_name}\nIP Address: {ip_address}\nLatency: {ping_ms} ms (Packet Loss: {packet_loss}%)\nWaktu: {time}\n\nStatus: Performa lalu lintas jaringan mengalami penurunan.",
    ticket: "[TIKET KERUSAKAN BARU]\n\nID Tiket: #{ticket_id}\nPelanggan: {customer_name} ({username})\nAlamat: {address}\nKendala: {issue_description}\nWaktu Lapor: {time}\n\nMohon assign teknisi ke lokasi!",
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Toggle Pemicu Alert
  const handleToggleTrigger = (key) => {
    setAlertTriggers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handler Tes Kirim Notifikasi Telegram
  const handleSendTestAlert = (e) => {
    e.preventDefault();
    setTestResult({ type: "info", text: "Mengirim sinyal alert ke Telegram API..." });

    setTimeout(() => {
      setTestResult({
        type: "success",
        text: `Berhasil! Pesan tes alert [${testAlertForm.alertType}] telah terkirim ke Group Telegram (${botConfig.targetChatId}).`,
      });
    }, 1000);
  };

  // Handler Ubah Template
  const handleTemplateChange = (text) => {
    setAlertTemplates((prev) => ({
      ...prev,
      [selectedAlertTemplate]: text,
    }));
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3 d-flex align-items-center gap-2">
          <i className="bi bi-send-check-fill text-primary"></i>
          Telegram Bot Monitoring & Alert
        </h3>
        <p className="text-muted mb-0 small fs-md-6">
          Integrasikan bot Telegram untuk mendeteksi perangkat offline, latency tinggi, dan laporan gangguan jaringan secara fleksibel.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Status Bot & Trigger Settings */}
        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3">
            {/* Status Bot & Group ID */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h6 className="fw-bold text-dark mb-0 fs-6 d-flex align-items-center gap-2">
                  <i className="bi bi-cpu text-primary"></i>
                  Status Service Bot
                </h6>
                {botStatus === "active" ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: "11px" }}>
                    <i className="bi bi-record-fill me-1"></i> Running
                  </span>
                ) : (
                  <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: "11px" }}>
                    <i className="bi bi-pause-fill me-1"></i> Stopped
                  </span>
                )}
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary-subtle text-primary rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                      <i className="bi bi-diagram-3-fill fs-4"></i>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h6 className="fw-bold text-dark mb-0 text-truncate">{botConfig.botName}</h6>
                      <span className="text-primary fw-semibold extra-small font-monospace">{botConfig.botUsername}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 extra-small border-top pt-2 mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <i className="bi bi-people"></i> Target Chat:
                      </span>
                      <span className="fw-bold text-dark font-monospace">{botConfig.targetChatId}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <i className="bi bi-bounding-box-circles"></i> Tipe:
                      </span>
                      <span className="fw-medium text-secondary">{botConfig.chatType}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold text-secondary extra-small mb-1 d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                    <i className="bi bi-key"></i> BOT API TOKEN
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-3 py-2 px-3 font-monospace extra-small bg-light"
                    value={botConfig.botToken}
                    readOnly
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label fw-semibold text-secondary extra-small mb-1 d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                    <i className="bi bi-hash"></i> TARGET GROUP / CHAT ID
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3 font-monospace extra-small"
                    value={botConfig.targetChatId}
                    onChange={(e) => setBotConfig({ ...botConfig, targetChatId: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBotStatus(botStatus === "active" ? "inactive" : "active")}
                className={`btn ${botStatus === "active" ? "btn-outline-danger" : "btn-success"} rounded-3 fw-semibold py-2 w-100 shadow-none d-flex align-items-center justify-content-center gap-2`}
                style={{ fontSize: "13px" }}
              >
                {botStatus === "active" ? (
                  <>
                    <i className="bi bi-power"></i> Nonaktifkan Bot Monitoring
                  </>
                ) : (
                  <>
                    <i className="bi bi-play-fill"></i> Aktifkan Bot Monitoring
                  </>
                )}
              </button>
            </div>

            {/* Pemicu Alert Notifikasi (Offline & Rusak) */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-3 fs-6 p-2">
                Pemicu Alert Jaringan
              </h6>

              <div className="d-flex flex-column gap-3">
                {/* Switch 1 */}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-start gap-2">
                    <div className="text-danger rounded-2">
                    </div>
                    <div>
                      <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Perangkat Offline</span>
                      <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>Saat Ping OLT/Router/Switch timeout</span>
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={alertTriggers.deviceOffline}
                      onChange={() => handleToggleTrigger("deviceOffline")}
                    />
                  </div>
                </div>

                {/* Switch 2 */}
                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div className="d-flex align-items-start gap-2">
                    <div className="text-warning-emphasis rounded-2">
                    </div>
                    <div>
                      <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Tiket Laporan Gangguan</span>
                      <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>Saat ada komplain rusak dari pelanggan</span>
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={alertTriggers.customerReport}
                      onChange={() => handleToggleTrigger("customerReport")}
                    />
                  </div>
                </div>

                {/* Switch 3 */}
                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div className="d-flex align-items-start gap-2">
                    <div className="text-primary rounded-2">
                    </div>
                    <div>
                      <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Link Port Down</span>
                      <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>Kabel terputus / status interface Down</span>
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={alertTriggers.interfaceDown}
                      onChange={() => handleToggleTrigger("interfaceDown")}
                    />
                  </div>
                </div>

                {/* Switch 4 */}
                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div className="d-flex align-items-start gap-2">
                    <div className="text-info-emphasis rounded-2">
                    </div>
                    <div>
                      <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>High Latency / Ping Spike</span>
                      <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>RTT latency &gt; 200ms atau loss</span>
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      checked={alertTriggers.highLatency}
                      onChange={() => handleToggleTrigger("highLatency")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Simulasi Tes Kirim & Template Editor */}
        <div className="col-12 col-xl-8" style={{ minWidth: 0 }}>
          <div className="d-flex flex-column gap-4">
            {/* 1. Tes Kirim Alert Kerusakan Manual */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-1 fs-6 d-flex align-items-center gap-2">
                Simulasi Test Broadcast Alert
              </h6>
              <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                Uji coba pengiriman format notifikasi darurat langsung ke ruang obrolan Telegram.
              </p>

              {testResult && (
                <div
                  className={`alert ${
                    testResult.type === "success" ? "alert-success border-success-subtle" : "alert-info border-info-subtle"
                  } py-2 px-3 mb-3 rounded-3 extra-small d-flex align-items-center gap-2`}
                >
                  <i className={`bi ${testResult.type === "success" ? "bi-check-circle-fill" : "bi-info-circle-fill"}`}></i>
                  <span>{testResult.text}</span>
                </div>
              )}

              <form onSubmit={handleSendTestAlert}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      KATEGORI ALERT
                    </label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={testAlertForm.alertType}
                      onChange={(e) => setTestAlertForm({ ...testAlertForm, alertType: e.target.value })}
                      style={{ fontSize: "13px" }}
                    >
                      <option value="OFFLINE">PERANGKAT OFFLINE</option>
                      <option value="LATENCY">HIGH LATENCY / LOSS</option>
                      <option value="TICKET">TIKET KERUSAKAN</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-8">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NAMA PERANGKAT / PELANGGAN
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold"
                      placeholder="e.g. OLT GPON - Sektor 3 / Bpk. Budi"
                      value={testAlertForm.deviceName}
                      onChange={(e) => setTestAlertForm({ ...testAlertForm, deviceName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      KETERANGAN KENDALA / DETAIL PESAN
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      placeholder="e.g. Fiber Cut (Kabel putus) Jalur Utama Sektor 2"
                      value={testAlertForm.description}
                      onChange={(e) => setTestAlertForm({ ...testAlertForm, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    disabled={botStatus !== "active"}
                    className="btn btn-danger rounded-3 fw-semibold px-4 py-2 shadow-none d-flex align-items-center gap-2"
                    style={{ fontSize: "13px" }}
                  > Kirim Broadcast Alert
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Editor Template Format Pesan Alert Telegram */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-1 fs-6 d-flex align-items-center gap-2">
                Format Message Template
              </h6>
              <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                Sesuaikan struktur teks variabel pesan alert yang akan masuk ke Telegram tim NOC.
              </p>

              {/* Tab Opsi Template Alert */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedAlertTemplate("offline")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2 ${
                    selectedAlertTemplate === "offline" ? "btn-danger text-white" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                > Format Perangkat Offline
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAlertTemplate("latency")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2 ${
                    selectedAlertTemplate === "latency" ? "btn-warning text-dark" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                > Format High Latency
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAlertTemplate("ticket")}
                  className={`btn btn-sm rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2 ${
                    selectedAlertTemplate === "ticket" ? "btn-primary text-white" : "btn-light border text-secondary"
                  }`}
                  style={{ fontSize: "12px" }}
                > Format Tiket Kerusakan
                </button>
              </div>

              {/* Textarea Template */}
              <div className="mb-3">
                <textarea
                  className="form-control rounded-3 p-3 shadow-none font-monospace"
                  rows="7"
                  value={alertTemplates[selectedAlertTemplate]}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  style={{ fontSize: "13px", lineHeight: "1.5" }}
                ></textarea>
              </div>

              {/* Variable Placeholders */}
              <div className="bg-light p-3 rounded-3 border">
                <span className="fw-bold text-dark extra-small d-flex align-items-center gap-1 mb-2" style={{ fontSize: "12px" }}>
                  <i className="bi bi-braces"></i> Variable Tags yang Tersedia:
                </span>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{device_name}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{ip_address}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{location}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{time}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{description}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{ping_ms}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{ticket_id}`}</span>
                  <span className="badge bg-white border text-dark font-monospace px-2 py-1">{`{customer_name}`}</span>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-primary rounded-3 fw-semibold px-4 py-2 shadow-none d-flex align-items-center gap-2"
                  style={{ fontSize: "13px" }}
                > Simpan Format Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}