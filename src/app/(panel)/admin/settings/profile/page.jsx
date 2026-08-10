// app/(panel)/admin/settings/profile/page.jsx
"use client";

import React, { useState } from "react";

export default function CompanyProfileSettingsPage() {
  // State Profile, Alamat, & Logo Perusahaan
  const [profileData, setProfileData] = useState({
    companyName: "Global Network ISP",
    profileLogo: null,
    profileLogoPreview: "/img/nocsphere.png",
    sidebarLogo: null,
    sidebarLogoPreview: "/img/nocsphere.png",
    footerLogo: null,
    footerLogoPreview: "/img/nocsphere_black.png",
    email: "admin@globalnet.id",
    phone: "081234567890",
    website: "https://globalnet.id",
    address: "Jl. Soekarno Hatta No. 45",
    city: "Bandar Lampung",
    province: "Lampung",
    postalCode: "35141",
  });

  // State Lisensi Aktif Perusahaan
  const [activeSubscription, setActiveSubscription] = useState({
    packageId: "noc-enterprise",
    packageName: "Nocsphere Enterprise",
    billingCycle: "Monthly Subscription",
    price: "Rp 250.000",
    period: "/ bulan",
    startDate: "2026-07-01",
    endDate: "2026-08-01",
    totalDays: 31,
    remainingDays: 9,
  });

  // Master Data 3 Paket Lisensi Nocsphere
  const [packages] = useState([
    {
      id: "noc-lite",
      name: "Nocsphere Lite",
      badge: "Per Bulan",
      price: "Rp 150.000",
      period: "/ bulan",
      features: [
        "Mendukung hingga 250 Pelanggan Active",
        "Pencarian Tagihan Portal Publik (Tanpa Login)",
        "Integrasi Payment Gateway Dasar",
        "Support via Email",
      ],
    },
    {
      id: "noc-enterprise",
      name: "Nocsphere Enterprise",
      badge: "Per Bulan",
      price: "Rp 250.000",
      period: "/ bulan",
      features: [
        "Kapasitas Pelanggan Tanpa Batas (Unlimited)",
        "Fitur Lengkap Portal Pelanggan + Custom Banner",
        "Integrasi Mikrotik Router & Auto Isolir",
        "Notifikasi WhatsApp Automatic",
        "Dukungan Prioritas WhatsApp Admin",
      ],
    },
    {
      id: "noc-local",
      name: "Nocsphere Local",
      badge: "Per Tahun",
      price: "Rp 5.000.000",
      period: "/ tahun",
      features: [
        "Lisensi Server Lokal (On-Premise / Private Cloud)",
        "Akses Source Code & Database Mandiri",
        "Bisa Berjalan Tanpa Koneksi Cloud Luar",
        "Dukungan Maintenance & Update Sistem 1 Tahun",
        "Bebas Biaya Bulanan selama Masa Lisensi",
      ],
    },
  ]);

  // State Modal Upgrade / Perpanjang
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedUpgradePkg, setSelectedUpgradePkg] = useState(null);

  // State Status Simpan Profil
  const [saveStatus, setSaveStatus] = useState(null);

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Hitung persentase progress bar lisensi
  const daysPassed = activeSubscription.totalDays - activeSubscription.remainingDays;
  const progressPercentage = Math.round((daysPassed / activeSubscription.totalDays) * 100);

  // Helper File Upload Handler
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (fileType === "profile") {
        setProfileData((prev) => ({ ...prev, profileLogo: file, profileLogoPreview: previewUrl }));
      } else if (fileType === "sidebar") {
        setProfileData((prev) => ({ ...prev, sidebarLogo: file, sidebarLogoPreview: previewUrl }));
      } else if (fileType === "footer") {
        setProfileData((prev) => ({ ...prev, footerLogo: file, footerLogoPreview: previewUrl }));
      }
    }
  };

  // Handler Simpan Profil
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  // Handler Buka Modal Upgrade
  const handleOpenUpgradeModal = (pkg) => {
    setSelectedUpgradePkg(pkg);
    setIsUpgradeModalOpen(true);
  };

  // Handler Konfirmasi Upgrade Lisensi
  const handleConfirmUpgrade = () => {
    if (!selectedUpgradePkg) return;

    const newTotalDays = selectedUpgradePkg.id === "noc-local" ? 365 : 30;

    setActiveSubscription({
      packageId: selectedUpgradePkg.id,
      packageName: selectedUpgradePkg.name,
      billingCycle: selectedUpgradePkg.id === "noc-local" ? "Annual Subscription" : "Monthly Subscription",
      price: selectedUpgradePkg.price,
      period: selectedUpgradePkg.period,
      startDate: "2026-07-23",
      endDate: selectedUpgradePkg.id === "noc-local" ? "2027-07-23" : "2026-08-23",
      totalDays: newTotalDays,
      remainingDays: newTotalDays,
    });

    setIsUpgradeModalOpen(false);
    setSaveStatus("upgrade_success");
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Halaman */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">
          Pengaturan Profil & Lisensi Perusahaan
        </h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola profil usaha, alamat operasional, upload logo perusahaan, serta pantau sisa masa aktif lisensi Nocsphere kamu.
        </p>
      </div>

      {saveStatus === "success" && (
        <div className="alert alert-success border-success-subtle py-2 px-3 mb-4 rounded-3 extra-small">
          Profil perusahaan dan logo berhasil diperbarui!
        </div>
      )}

      {saveStatus === "upgrade_success" && (
        <div className="alert alert-success border-success-subtle py-2 px-3 mb-4 rounded-3 extra-small">
          Berhasil memperbarui/mengupgrade paket lisensi Nocsphere!
        </div>
      )}

      <div className="row g-4 align-items-start">
        {/* KOLOM KIRI: Form Profil, Logo Upload, Alamat */}
        <div className="col-12 col-xl-7">
          <form onSubmit={handleSaveProfile}>
            <div className="d-flex flex-column gap-4">
              {/* Card Identitas Perusahaan & Logo */}
              <div className="card p-3 p-sm-4" style={cardCleanStyle}>
                <h6 className="fw-bold text-dark mb-1 fs-6">
                  Identitas & Upload Logo Perusahaan
                </h6>
                <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                  Informasi dasar dan logo yang digunakan di profil, sidebar, footer, serta cetak invoice.
                </p>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NAMA PERUSAHAAN / ISP
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                      required
                    />
                  </div>

                  {/* LOGO PROFILE PERUSAHAAN */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      LOGO PROFIL PERUSAHAAN
                    </label>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="p-2 border rounded-3 bg-light text-center d-flex align-items-center justify-content-center" style={{ width: "64px", height: "64px" }}>
                        <img
                          src={profileData.profileLogoPreview}
                          alt="Profile Logo Preview"
                          className="img-fluid object-fit-contain"
                          style={{ maxHeight: "42px", maxWidth: "100%" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/100x100/e2e8f0/475569?text=Logo";
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control rounded-3 py-1.5 px-3 shadow-none extra-small"
                          onChange={(e) => handleFileChange(e, "profile")}
                        />
                        <span className="text-muted extra-small mt-1 d-block" style={{ fontSize: "11px" }}>
                          Format gambar disarankan PNG/JPG transparan.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LOGO SIDEBAR */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      LOGO SIDEBAR (DEFAULT: img/nocsphere.png)
                    </label>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="p-2 border rounded-3 bg-light text-center d-flex align-items-center justify-content-center" style={{ width: "64px", height: "64px" }}>
                        <img
                          src={profileData.sidebarLogoPreview}
                          alt="Sidebar Logo Preview"
                          className="img-fluid object-fit-contain"
                          style={{ maxHeight: "42px", maxWidth: "100%" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/100x100/e2e8f0/475569?text=Sidebar";
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control rounded-3 py-1.5 px-3 shadow-none extra-small"
                          onChange={(e) => handleFileChange(e, "sidebar")}
                        />
                        <span className="text-muted extra-small mt-1 d-block" style={{ fontSize: "11px" }}>
                          Upload logo baru untuk menggantikan logo bawaan sidebar.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LOGO FOOTER */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      LOGO FOOTER & INVOICE (DEFAULT: img/nocsphere_black.png)
                    </label>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="p-2 border rounded-3 bg-light text-center d-flex align-items-center justify-content-center" style={{ width: "64px", height: "64px" }}>
                        <img
                          src={profileData.footerLogoPreview}
                          alt="Footer Logo Preview"
                          className="img-fluid object-fit-contain"
                          style={{ maxHeight: "42px", maxWidth: "100%" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/100x100/e2e8f0/475569?text=Footer";
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control rounded-3 py-1.5 px-3 shadow-none extra-small"
                          onChange={(e) => handleFileChange(e, "footer")}
                        />
                        <span className="text-muted extra-small mt-1 d-block" style={{ fontSize: "11px" }}>
                          Logo versi gelap untuk ditaruh di footer portal dan invoice.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      EMAIL RESMI
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      NOMOR TELEPON / WA
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      WEBSITE PERUSAHAAN (OPTIONAL)
                    </label>
                    <input
                      type="url"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace extra-small"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      placeholder="https://domain.com"
                    />
                  </div>
                </div>
              </div>

              {/* Card Alamat Lengkap Perusahaan */}
              <div className="card p-3 p-sm-4" style={cardCleanStyle}>
                <h6 className="fw-bold text-dark mb-1 fs-6">
                  Alamat Lengkap Perusahaan
                </h6>
                <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                  Alamat kantor utama untuk keperluan operasional dan pengiriman tagihan.
                </p>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      ALAMAT JALAN / KANTOR
                    </label>
                    <textarea
                      rows="2"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      KOTA / KABUPATEN
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      PROVINSI
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none"
                      value={profileData.province}
                      onChange={(e) => setProfileData({ ...profileData, province: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                      KODE POS
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2 px-3 shadow-none font-monospace"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                  <button
                    type="submit"
                    disabled={saveStatus === "saving"}
                    className="btn btn-primary rounded-3 fw-semibold px-4 py-2 shadow-none"
                    style={{ fontSize: "13px" }}
                  >
                    Simpan Perubahan Profil
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: STATUS LISENSI AKTIF & KATALOG UPGRADE */}
        <div className="col-12 col-xl-5">
          <div className="d-flex flex-column gap-4">
            {/* Status Lisensi Aktif + Progress Bar */}
            <div className="card p-3 p-sm-4 bg-primary text-white border-0" style={{ borderRadius: "16px", boxShadow: "0 2px 8px rgba(2, 132, 199, 0.12)" }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-white text-primary fw-bold px-2 py-1 rounded-2 extra-small" style={{ fontSize: "11px" }}>
                  LISENSI AKTIF
                </span>
                <span className="font-monospace extra-small opacity-75" style={{ fontSize: "11px" }}>
                  ID: NOC-2026-889
                </span>
              </div>

              <h6 className="fw-bold mb-1 fs-6">{activeSubscription.packageName}</h6>
              <div className="d-flex align-items-baseline gap-1 mb-3 opacity-90" style={{ fontSize: "13px" }}>
                <span className="fw-bold">{activeSubscription.price}</span>
                <span className="extra-small" style={{ fontSize: "11px" }}>{activeSubscription.period}</span>
              </div>

              {/* Progress Bar Masa Aktif */}
              <div className="bg-white bg-opacity-10 p-2.5 p-3 rounded-3 mb-1 border border-white border-opacity-20">
                <div className="d-flex align-items-center justify-content-between extra-small mb-1.5" style={{ fontSize: "12px" }}>
                  <span className="opacity-90">Sisa Masa Aktif:</span>
                  <span className="fw-bold">{activeSubscription.remainingDays} Hari Lagi</span>
                </div>

                <div className="progress bg-white bg-opacity-20 rounded-pill mb-2" style={{ height: "6px" }}>
                  <div
                    className={`progress-bar rounded-pill ${activeSubscription.remainingDays <= 5 ? "bg-warning" : "bg-white"}`}
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <div className="d-flex align-items-center justify-content-between extra-small font-monospace opacity-75" style={{ fontSize: "11px" }}>
                  <span>Mulai: {activeSubscription.startDate}</span>
                  <span>Kedaluwarsa: {activeSubscription.endDate}</span>
                </div>
              </div>
            </div>

            {/* Katalog Upgrade / Pilih Paket Lain */}
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-1 fs-6">
                Upgrade / Perpanjang Lisensi Nocsphere
              </h6>
              <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                Pilih paket di bawah ini untuk meng-upgrade fitur atau memperpanjang masa aktif sistem.
              </p>

              <div className="d-flex flex-column gap-3">
                {packages.map((pkg) => {
                  const isCurrent = activeSubscription.packageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className={`border rounded-3 p-3 transition-all ${
                        isCurrent ? "border-primary bg-primary-subtle bg-opacity-10" : "bg-light"
                      }`}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            {pkg.name}
                          </span>
                          {isCurrent && (
                            <span className="badge bg-primary text-white px-2 py-0.5 rounded-pill extra-small">
                              Sedang Digunakan
                            </span>
                          )}
                        </div>
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-0.5 rounded-pill extra-small">
                          {pkg.badge}
                        </span>
                      </div>

                      <div className="d-flex align-items-baseline gap-1 mb-2">
                        <span className="fw-bold text-primary" style={{ fontSize: "15px" }}>
                          {pkg.price}
                        </span>
                        <span className="text-muted extra-small" style={{ fontSize: "11px" }}>
                          {pkg.period}
                        </span>
                      </div>

                      <ul className="mb-3 ps-3 text-secondary extra-small" style={{ fontSize: "12px" }}>
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="mb-1">
                            {feat}
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => handleOpenUpgradeModal(pkg)}
                        className={`btn btn-sm w-100 rounded-3 fw-semibold py-1.5 ${
                          isCurrent ? "btn-outline-primary" : "btn-primary"
                        }`}
                        style={{ fontSize: "12px" }}
                      >
                        {isCurrent ? "Perpanjang Lisensi Ini" : `Upgrade ke ${pkg.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI UPGRADE / PERPANJANG */}
      {isUpgradeModalOpen && selectedUpgradePkg && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg border p-4 w-100"
            style={{ maxWidth: "480px" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
              <h6 className="fw-bold text-dark mb-0 fs-6">
                Konfirmasi Lisensi Nocsphere
              </h6>
              <button
                type="button"
                className="btn-close shadow-none"
                onClick={() => setIsUpgradeModalOpen(false)}
              ></button>
            </div>

            <div className="mb-4">
              <p className="text-secondary extra-small mb-3" style={{ fontSize: "13px" }}>
                Kamu akan memilih lisensi paket <strong>{selectedUpgradePkg.name}</strong> dengan skema harga <strong>{selectedUpgradePkg.price} {selectedUpgradePkg.period}</strong>.
              </p>

              <div className="bg-light p-3 rounded-3 border extra-small">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Paket Dipilih:</span>
                  <span className="fw-bold text-dark">{selectedUpgradePkg.name}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Siklus Pembayaran:</span>
                  <span className="fw-bold text-dark">{selectedUpgradePkg.badge}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Masa Beli Baru:</span>
                  <span className="fw-bold text-primary">
                    {selectedUpgradePkg.id === "noc-local" ? "365 Hari (1 Tahun)" : "30 Hari (1 Bulan)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
              <button
                type="button"
                className="btn btn-light border rounded-3 fw-semibold px-3 py-2"
                onClick={() => setIsUpgradeModalOpen(false)}
                style={{ fontSize: "13px" }}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-3 fw-semibold px-4 py-2"
                onClick={handleConfirmUpgrade}
                style={{ fontSize: "13px" }}
              >
                Konfirmasi & Aktifkan Paket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}