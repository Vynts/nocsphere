// app/(panel)/admin/settings/billing/page.jsx
"use client";

import React, { useState } from "react";

export default function BillingSettingsPage() {
  // State Tab Aktif ('cycle' | 'midtrans' | 'manual_bank')
  const [activeTab, setActiveTab] = useState("midtrans");

  // State Config Siklus Tagihan
  const [billingCycle, setBillingCycle] = useState({
    invoiceGenerateDay: 1, // Tanggal terbit invoice (misal tanggal 1)
    dueDateDays: 10,       // Jatuh tempo (10 hari setelah terbit)
    enableLateFee: true,
    lateFeeAmount: 15000,
    autoIsolateGraceDays: 1, // Berapa hari toleransi setelah due date sebelum auto-isolir
  });

  // State Config Midtrans Payment Gateway
  const [midtransConfig, setMidtransConfig] = useState({
    isProduction: false, // false = Sandbox, true = Production
    merchantId: "M12345678",
    clientKey: "SB-Mid-client-XyZ1234567890ABC",
    serverKey: "SB-Mid-server-9876543210ZYXWVU",
    enableSnapRedirect: true,
    enable3DSecure: true,
    paymentMethods: {
      qris: true,
      gopay: true,
      shopeepay: true,
      bankTransfer: true,
      cstore: false, // Indomaret / Alfamart
    },
  });

  // State Config Rekening Bank Manual
  const [manualBankConfig, setManualBankConfig] = useState({
    bankName: "BCA",
    accountNumber: "1234567890",
    accountHolder: "PT GLOBAL NETWORK INDONESIA",
    instructions: "Transfer sesuai nominal tagihan dan simpan bukti transfer untuk dikonfirmasi admin.",
  });

  // Status Save Notification
  const [saveStatus, setSaveStatus] = useState(null);

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

  // Toggle Payment Methods
  const handleTogglePaymentMethod = (key) => {
    setMidtransConfig((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [key]: !prev.paymentMethods[key],
      },
    }));
  };

  // Save Settings Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveStatus("saving");

    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3 d-flex align-items-center gap-2">
          <i className="bi bi-credit-card-gear text-primary"></i>
          Pengaturan Tagihan & Payment Gateway
        </h3>
        <p className="text-muted mb-0 small fs-md-6">
          Atur siklus otomatisasi invoice bulanan, toleransi keterlambatan, serta integrasi Midtrans untuk pembayaran otomatis via QRIS & Transfer Bank.
        </p>
      </div>

      {saveStatus === "success" && (
        <div className="alert alert-success border-success-subtle py-2 px-3 mb-4 rounded-3 extra-small d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill fs-6"></i>
          <span>Pengaturan billing dan integrasi Midtrans berhasil disimpan!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("midtrans")}
          className={`btn btn-sm rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2 ${
            activeTab === "midtrans" ? "btn-primary text-white" : "btn-light border text-secondary"
          }`}
          style={{ fontSize: "13px" }}
        >
          <i className="bi bi-lightning-charge-fill"></i> Midtrans Gateway
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cycle")}
          className={`btn btn-sm rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2 ${
            activeTab === "cycle" ? "btn-primary text-white" : "btn-light border text-secondary"
          }`}
          style={{ fontSize: "13px" }}
        >
          <i className="bi bi-calendar-event"></i> Siklus & Aturan Tagihan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manual_bank")}
          className={`btn btn-sm rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2 ${
            activeTab === "manual_bank" ? "btn-primary text-white" : "btn-light border text-secondary"
          }`}
          style={{ fontSize: "13px" }}
        >
          <i className="bi bi-bank"></i> Rekening Bank Manual
        </button>
      </div>

      <form onSubmit={handleSaveSettings}>
        {/* TAB 1: MIDTRANS PAYMENT GATEWAY SETTINGS */}
        {activeTab === "midtrans" && (
          <div className="row g-4 align-items-start">
            <div className="col-12 col-xl-7">
              <div className="card p-3 p-sm-4" style={cardCleanStyle}>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <div>
                    <h6 className="fw-bold text-dark mb-0 fs-6">Kredensial API Midtrans</h6>
                    <span className="text-muted extra-small">Dapatkan Server Key & Client Key dari Dashboard Midtrans.</span>
                  </div>
                  {midtransConfig.isProduction ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: "11px" }}>
                      Production Mode
                    </span>
                  ) : (
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: "11px" }}>
                      Sandbox (Testing)
                    </span>
                  )}
                </div>

                <div className="d-flex flex-column gap-3 mb-4">
                  {/* Environment Switcher */}
                  <div className="bg-light p-3 rounded-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Mode Lingkungan Midtrans</span>
                      <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>
                        Aktifkan mode Production jika siap menerima pembayaran asli pelanggan.
                      </span>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        role="switch"
                        checked={midtransConfig.isProduction}
                        onChange={(e) => setMidtransConfig({ ...midtransConfig, isProduction: e.target.checked })}
                      />
                    </div>
                  </div>

                  {/* Merchant ID */}
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      MERCHANT ID
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 font-monospace fw-semibold"
                      value={midtransConfig.merchantId}
                      onChange={(e) => setMidtransConfig({ ...midtransConfig, merchantId: e.target.value })}
                      placeholder="e.g. M123456"
                      required
                    />
                  </div>

                  {/* Client Key */}
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      CLIENT KEY
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 font-monospace extra-small"
                      value={midtransConfig.clientKey}
                      onChange={(e) => setMidtransConfig({ ...midtransConfig, clientKey: e.target.value })}
                      placeholder="e.g. SB-Mid-client-..."
                      required
                    />
                  </div>

                  {/* Server Key */}
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      SERVER KEY
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-3 py-2 px-3 font-monospace extra-small"
                      value={midtransConfig.serverKey}
                      onChange={(e) => setMidtransConfig({ ...midtransConfig, serverKey: e.target.value })}
                      placeholder="e.g. SB-Mid-server-..."
                      required
                    />
                  </div>
                </div>

                <h6 className="fw-bold text-dark mb-2 fs-6 pt-2 border-top">Metode Pembayaran yang Diizinkan</h6>
                <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                  Aktifkan saluran pembayaran yang sudah disetujui di akaun Midtrans kamu.
                </p>

                <div className="row g-2 mb-4">
                  <div className="col-12 col-md-6">
                    <div className="border rounded-3 p-2.5 p-2 px-3 d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>QRIS (Gopay/OVO/Dana)</span>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          checked={midtransConfig.paymentMethods.qris}
                          onChange={() => handleTogglePaymentMethod("qris")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded-3 p-2 px-3 d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Virtual Account / Transfer</span>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          checked={midtransConfig.paymentMethods.bankTransfer}
                          onChange={() => handleTogglePaymentMethod("bankTransfer")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded-3 p-2 px-3 d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>ShopeePay</span>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          checked={midtransConfig.paymentMethods.shopeepay}
                          onChange={() => handleTogglePaymentMethod("shopeepay")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded-3 p-2 px-3 d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>Alfamart / Indomaret</span>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          checked={midtransConfig.paymentMethods.cstore}
                          onChange={() => handleTogglePaymentMethod("cstore")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Webhook URL Info */}
            <div className="col-12 col-xl-5">
              <div className="d-flex flex-column gap-3">
                <div className="card p-3 p-sm-4" style={cardCleanStyle}>
                  <h6 className="fw-bold text-dark mb-2 fs-6 d-flex align-items-center gap-2">
                    <i className="bi bi-link-45deg text-primary"></i>
                    Webhook Notification URL
                  </h6>
                  <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                    Salin URL ini dan tempel di menu <strong>Settings &gt; Payment Notification URL</strong> pada Dashboard Midtrans agar status invoice ter-update otomatis & auto-un-isolate jalan.
                  </p>

                  <div className="bg-light p-3 rounded-3 border mb-3">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "11px" }}>
                      NOTIFICATION HTTP POST URL
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control rounded-start-3 font-monospace extra-small bg-white"
                        value="https://api.domainkamu.com/api/v1/payments/midtrans-notification"
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-end-3 px-3"
                        title="Salin URL Webhook"
                        onClick={() => navigator.clipboard.writeText("https://api.domainkamu.com/api/v1/payments/midtrans-notification")}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>

                  <div className="alert alert-info py-2 px-3 rounded-3 extra-small mb-0">
                    <i className="bi bi-info-circle-fill me-1"></i>
                    Ketika pelanggan melunasi tagihan via Midtrans, Webhook ini akan otomatis mengubah status invoice dari <code>unpaid</code> ke <code>paid</code> dan mengaktifkan koneksi MikroTik.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BILLING CYCLE SETTINGS */}
        {activeTab === "cycle" && (
          <div className="row g-4 align-items-start">
            <div className="col-12 col-xl-8">
              <div className="card p-3 p-sm-4" style={cardCleanStyle}>
                <h6 className="fw-bold text-dark mb-1 fs-6 d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-repeat text-primary"></i>
                  Siklus Otomatisasi Invoice Bulanan
                </h6>
                <p className="text-muted extra-small mb-4" style={{ fontSize: "12px" }}>
                  Tentukan tanggal pembuatan tagihan otomatis oleh Cron Job dan toleransi waktu pembayaran.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      TANGGAL PENERBITAN INVOICE
                    </label>
                    <select
                      className="form-select rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={billingCycle.invoiceGenerateDay}
                      onChange={(e) => setBillingCycle({ ...billingCycle, invoiceGenerateDay: Number(e.target.value) })}
                    >
                      <option value={1}>Setiap Tanggal 1 Awal Bulan</option>
                      <option value={5}>Setiap Tanggal 5 Awal Bulan</option>
                      <option value={20}>Sesuai Tanggal Pasang Pelanggan</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      JANGKA WAKTU JATUH TEMPO (HARI)
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control rounded-start-3 py-2 px-3 shadow-none fw-bold"
                        value={billingCycle.dueDateDays}
                        onChange={(e) => setBillingCycle({ ...billingCycle, dueDateDays: Number(e.target.value) })}
                      />
                      <span className="input-group-text rounded-end-3 bg-light text-muted extra-small">Hari dari terbit</span>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      TOLERANSI AUTO-ISOLIR MIKROTIK
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control rounded-start-3 py-2 px-3 shadow-none fw-bold"
                        value={billingCycle.autoIsolateGraceDays}
                        onChange={(e) => setBillingCycle({ ...billingCycle, autoIsolateGraceDays: Number(e.target.value) })}
                      />
                      <span className="input-group-text rounded-end-3 bg-light text-muted extra-small">Hari setelah due date</span>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold text-dark mb-3 fs-6 pt-3 border-top">Pengaturan Denda Keterlambatan</h6>

                <div className="d-flex flex-column gap-3 mb-2">
                  <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 border">
                    <div>
                      <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>Aktifkan Denda Keterlambatan</span>
                      <span className="text-muted extra-small d-block" style={{ fontSize: "11px" }}>
                        Tambahkan biaya denda otomatis jika pembayaran melebihi tanggal jatuh tempo.
                      </span>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        checked={billingCycle.enableLateFee}
                        onChange={(e) => setBillingCycle({ ...billingCycle, enableLateFee: e.target.checked })}
                      />
                    </div>
                  </div>

                  {billingCycle.enableLateFee && (
                    <div>
                      <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                        NOMINAL DENDA (RUPIAH)
                      </label>
                      <input
                        type="number"
                        className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-bold"
                        value={billingCycle.lateFeeAmount}
                        onChange={(e) => setBillingCycle({ ...billingCycle, lateFeeAmount: Number(e.target.value) })}
                        placeholder="e.g. 15000"
                      />
                      <span className="text-muted extra-small mt-1 d-block" style={{ fontSize: "11px" }}>
                        Nominal denda flat: <strong>{formatRupiah(billingCycle.lateFeeAmount)}</strong> per invoice keterlambatan.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REKENING BANK MANUAL */}
        {activeTab === "manual_bank" && (
          <div className="row g-4 align-items-start">
            <div className="col-12 col-xl-7">
              <div className="card p-3 p-sm-4" style={cardCleanStyle}>
                <h6 className="fw-bold text-dark mb-1 fs-6 d-flex align-items-center gap-2">
                  <i className="bi bi-bank2 text-primary"></i>
                  Rekening Transfer Bank Manual
                </h6>
                <p className="text-muted extra-small mb-4" style={{ fontSize: "12px" }}>
                  Rekening ini akan ditampilkan pada invoice pelanggan yang memilih opsi bayar transfer bank manual.
                </p>

                <div className="d-flex flex-column gap-3 mb-2">
                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NAMA BANK
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={manualBankConfig.bankName}
                      onChange={(e) => setManualBankConfig({ ...manualBankConfig, bankName: e.target.value })}
                      placeholder="e.g. Bank BCA / Mandiri"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NOMOR REKENING
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-bold"
                      value={manualBankConfig.accountNumber}
                      onChange={(e) => setManualBankConfig({ ...manualBankConfig, accountNumber: e.target.value })}
                      placeholder="e.g. 1234567890"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NAMA PEMILIK REKENING (ATAS NAMA)
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={manualBankConfig.accountHolder}
                      onChange={(e) => setManualBankConfig({ ...manualBankConfig, accountHolder: e.target.value })}
                      placeholder="e.g. PT GLOBAL NETWORK INDONESIA"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      INSTRUKSI PEMBAYARAN
                    </label>
                    <textarea
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      rows="3"
                      value={manualBankConfig.instructions}
                      onChange={(e) => setManualBankConfig({ ...manualBankConfig, instructions: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Submit Button Footer */}
        <div className="d-flex align-items-center justify-content-end gap-2 pt-4 mt-2 border-top">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="btn btn-primary rounded-3 fw-semibold px-4 py-2 shadow-none d-flex align-items-center gap-2"
            style={{ fontSize: "13px" }}
          >
            <i className="bi bi-save2-fill"></i>
            {saveStatus === "saving" ? "Menyimpan Konfigurasi..." : "Simpan Semua Pengaturan Billing"}
          </button>
        </div>
      </form>
    </div>
  );
}