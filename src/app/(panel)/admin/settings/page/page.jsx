// app/(panel)/admin/settings/client-portal/page.jsx
"use client";

import React, { useState } from "react";

export default function ClientPortalSettingsPage() {
  // State Pengaturan Portal Pelanggan
  const [portalConfig, setPortalConfig] = useState({
    portalTitle: "Portal Cek Tagihan Internet",
    companyName: "Global Network ISP",
    supportWhatsapp: "081234567890",
    allowSearchByPhone: true,
    allowSearchByCode: true,
  });

  // State Banner Promosi / Pengumuman
  const [banners, setBanners] = useState([
    {
      id: "b-1",
      title: "Promo Upgrade Kecepatan",
      subtitle: "Dapatkan kecepatan 2x lipat hanya dengan tambah Rp 30.000/bulan!",
      imageUrl: "https://placehold.co/1200x400/0284c7/ffffff?text=Promo+Upgrade+Bandwidth+ISP",
      isActive: true,
      linkUrl: "https://wa.me/6281234567890",
    },
    {
      id: "b-2",
      title: "Pemeliharaan Jaringan Rutin",
      subtitle: "Jadwal maintenance wilayah Sektor A pada tanggal 28 Juli 2026 jam 01:00 WIB.",
      imageUrl: "https://placehold.co/1200x400/334155/ffffff?text=Info+Maintenance+Jaringan",
      isActive: true,
      linkUrl: "",
    },
  ]);

  // State Modal Banner
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    isActive: true,
    linkUrl: "",
  });

  // State Status Simpan
  const [saveStatus, setSaveStatus] = useState(null);

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  // Handler Open Modal Edit/Tambah Banner
  const openBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerFormData({ ...banner });
    } else {
      setEditingBanner(null);
      setBannerFormData({
        title: "",
        subtitle: "",
        imageUrl: "",
        isActive: true,
        linkUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeBannerModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  // Submit Banner Form
  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerFormData.title || !bannerFormData.imageUrl) return;

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingBanner.id ? { ...bannerFormData, id: b.id } : b))
      );
    } else {
      const newBanner = {
        ...bannerFormData,
        id: `b-${Date.now()}`,
      };
      setBanners((prev) => [newBanner, ...prev]);
    }
    closeBannerModal();
  };

  // Delete Banner
  const handleDeleteBanner = (id) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Toggle Banner Status
  const handleToggleBannerStatus = (id) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Save Portal Settings
  const handleSavePortalSettings = (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">
          Pengaturan Portal Cek Tagihan Pelanggan
        </h3>
        <p className="text-muted mb-0 small fs-md-6">
          Kelola tampilan pencarian tagihan publik (tanpa login) dan banner promosi/pengumuman perusahaan.
        </p>
      </div>

      {saveStatus === "success" && (
        <div className="alert alert-success border-success-subtle py-2 px-3 mb-4 rounded-3 extra-small">
          Pengaturan portal dan banner berhasil diperbarui!
        </div>
      )}

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Pengaturan Banner & Promosi Perusahaan */}
        <div className="col-12 col-xl-8">
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
              <div>
                <h6 className="fw-bold text-dark mb-0 fs-6">
                  Banner Promosi & Pengumuman Portal
                </h6>
                <span className="text-muted extra-small">
                  Banner ini akan muncul di halaman utama pencarian tagihan pelanggan.
                </span>
              </div>

              <button
                type="button"
                onClick={() => openBannerModal()}
                className="btn btn-primary rounded-3 fw-semibold px-3 py-2 shadow-none"
                style={{ fontSize: "13px" }}
              >
                Tambah Banner
              </button>
            </div>

            {/* List Banners */}
            <div className="d-flex flex-column gap-3">
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <div key={banner.id} className="border rounded-3 p-3 bg-light">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-md-4">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="img-fluid rounded-2 border object-fit-cover w-100"
                          style={{ maxHeight: "100px" }}
                        />
                      </div>

                      <div className="col-12 col-md-5">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "14px" }}>
                            {banner.title}
                          </h6>
                          {banner.isActive ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5 rounded-pill extra-small">
                              Tampil
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-0.5 rounded-pill extra-small">
                              Sembunyi
                            </span>
                          )}
                        </div>
                        <p className="text-muted extra-small mb-2 text-truncate" style={{ fontSize: "12px" }}>
                          {banner.subtitle || "Tidak ada deskripsi"}
                        </p>
                        {banner.linkUrl && (
                          <span className="text-primary font-monospace extra-small d-block text-truncate" style={{ fontSize: "11px" }}>
                            Link: {banner.linkUrl}
                          </span>
                        )}
                      </div>

                      <div className="col-12 col-md-3 text-md-end border-top border-md-0 pt-2 pt-md-0">
                        <div className="d-inline-flex align-items-center gap-2">
                          <div className="form-check form-switch m-0 me-2" title="Aktifkan/Sembunyikan Banner">
                            <input
                              className="form-check-input shadow-none"
                              type="checkbox"
                              checked={banner.isActive}
                              onChange={() => handleToggleBannerStatus(banner.id)}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => openBannerModal(banner)}
                            className="btn btn-sm btn-light border rounded-3 text-secondary px-2.5 py-1.5"
                            style={{ fontSize: "12px" }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="btn btn-sm btn-outline-danger rounded-3 px-2.5 py-1.5"
                            style={{ fontSize: "12px" }}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted border rounded-3 bg-light" style={{ fontSize: "13px" }}>
                  Belum ada banner promosi yang ditambahkan
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Aturan Pencarian & Bantuan */}
        <div className="col-12 col-xl-4">
          <form onSubmit={handleSavePortalSettings}>
            <div className="card p-3 p-sm-4" style={cardCleanStyle}>
              <h6 className="fw-bold text-dark mb-1 fs-6">
                Aturan Pencarian Publik
              </h6>
              <p className="text-muted extra-small mb-3" style={{ fontSize: "12px" }}>
                Pelanggan tidak memerlukan akun login, cukup mencari data tagihan via halaman pencarian.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    JUDUL HALAMAN PORTAL
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold"
                    value={portalConfig.portalTitle}
                    onChange={(e) => setPortalConfig({ ...portalConfig, portalTitle: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    NOMOR WA BANTUAN OPERATOR
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3 shadow-none font-monospace fw-semibold"
                    value={portalConfig.supportWhatsapp}
                    onChange={(e) => setPortalConfig({ ...portalConfig, supportWhatsapp: e.target.value })}
                    placeholder="e.g. 081234567890"
                    required
                  />
                  <span className="text-muted extra-small mt-1 d-block" style={{ fontSize: "11px" }}>
                    Nomor ini akan dihubungi pelanggan jika nama/kodenya tidak ditemukan.
                  </span>
                </div>

                <div className="border-top pt-3">
                  <label className="form-label fw-semibold text-secondary extra-small mb-2" style={{ fontSize: "12px" }}>
                    METODE PENCARIAN YANG DIIZINKAN
                  </label>

                  <div className="d-flex flex-column gap-2">
                    <div className="form-check">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        id="searchByCode"
                        checked={portalConfig.allowSearchByCode}
                        onChange={(e) => setPortalConfig({ ...portalConfig, allowSearchByCode: e.target.checked })}
                      />
                      <label className="form-check-label extra-small text-dark fw-medium" htmlFor="searchByCode">
                        Cari menggunakan Kode Pelanggan / Username PPPoE
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        id="searchByPhone"
                        checked={portalConfig.allowSearchByPhone}
                        onChange={(e) => setPortalConfig({ ...portalConfig, allowSearchByPhone: e.target.checked })}
                      />
                      <label className="form-check-label extra-small text-dark fw-medium" htmlFor="searchByPhone">
                        Cari menggunakan Nama / Nomor HP Pelanggan
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saveStatus === "saving"}
                className="btn btn-primary rounded-3 fw-semibold py-2 w-100 shadow-none"
                style={{ fontSize: "13px" }}
              >
                Simpan Pengaturan Portal
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL EDIT / TAMBAH BANNER */}
      {isModalOpen && (
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
            style={{ maxWidth: "520px" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
              <h6 className="fw-bold text-dark mb-0 fs-6">
                {editingBanner ? "Edit Banner Promosi" : "Tambah Banner Promosi Baru"}
              </h6>
              <button type="button" className="btn-close shadow-none" onClick={closeBannerModal}></button>
            </div>

            <form onSubmit={handleSaveBanner}>
              <div className="d-flex flex-column gap-3 mb-4">
                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    JUDUL BANNER / PROMO
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3 shadow-none fw-semibold"
                    value={bannerFormData.title}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                    placeholder="e.g. Promo Diskon Awal Bulan"
                    required
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    SUBTITEL / DESKRIPSI SINGKAT
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3 shadow-none"
                    value={bannerFormData.subtitle}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                    placeholder="e.g. Khusus pembayaran sebelum tanggal 5"
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    URL GAMBAR BANNER
                  </label>
                  <input
                    type="url"
                    className="form-control rounded-3 py-2 px-3 shadow-none font-monospace extra-small"
                    value={bannerFormData.imageUrl}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })}
                    placeholder="https://domain.com/banner.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold text-secondary extra-small mb-1" style={{ fontSize: "12px" }}>
                    LINK TUJUAN KETIKA DIKLIK (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3 shadow-none font-monospace extra-small"
                    value={bannerFormData.linkUrl}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, linkUrl: e.target.value })}
                    placeholder="https://wa.me/6281234567890"
                  />
                </div>

                <div className="form-check form-switch pt-1">
                  <input
                    className="form-check-input shadow-none"
                    type="checkbox"
                    id="bannerActive"
                    checked={bannerFormData.isActive}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                  />
                  <label className="form-check-label extra-small fw-semibold text-dark" htmlFor="bannerActive">
                    Tampilkan Banner di Portal Publik
                  </label>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                <button type="button" className="btn btn-light border rounded-3 fw-semibold px-3 py-2" onClick={closeBannerModal} style={{ fontSize: "13px" }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ fontSize: "13px" }}>
                  Simpan Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}