'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Data Dummy Database Pelanggan & Tagihan
const DUMMY_DATABASE = {
  'ID-10293': {
    customerId: 'ID-10293',
    customerName: 'Alvinza Erza Farandhika',
    phone: '081234567890',
    packageName: 'Paket Home Family',
    speed: '20 Mbps',
    invoices: [
      {
        id: 'INV-202608-0089',
        period: 'Agustus 2026',
        dueDate: '20 Agustus 2026',
        subtotal: 250000,
        taxFee: 27500, // PPN 11%
        adminFee: 4500,
        totalAmount: 282000,
        status: 'UNPAID',
      },
    ],
    history: [
      {
        id: 'INV-202607-0042',
        period: 'Juli 2026',
        date: '10 Juli 2026, 14:20 WIB',
        amount: 282000,
        status: 'PAID',
        method: 'Midtrans QRIS',
        refNumber: '882091029301',
      },
      {
        id: 'INV-202606-0011',
        period: 'Juni 2026',
        date: '08 Juni 2026, 09:15 WIB',
        amount: 282000,
        status: 'PAID',
        method: 'BRI Virtual Account',
        refNumber: '123456789022',
      },
      {
        id: 'INV-202605-0005',
        period: 'Mei 2026',
        date: '12 Mei 2026, 19:40 WIB',
        amount: 282000,
        status: 'PAID',
        method: 'Mandiri VA',
        refNumber: '992019283011',
      },
    ],
  },
};

export default function CheckoutPembayaranPage() {
  const params = useParams();
  const router = useRouter();

  const customerIdParam = params?.id ? String(params.id).toUpperCase() : 'ID-10293';
  const [customerData, setCustomerData] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  
  // State untuk modal detail histori
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    const result = DUMMY_DATABASE[customerIdParam] || DUMMY_DATABASE['ID-10293'];
    setCustomerData(result);
  }, [customerIdParam]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleMidtransPay = async () => {
    setLoadingPay(true);
    try {
      if (typeof window !== 'undefined' && window.snap) {
        window.snap.pay('YOUR_SNAP_TOKEN_HERE', {
          onSuccess: function () {
            alert('Pembayaran Berhasil!');
            setLoadingPay(false);
          },
          onPending: function () {
            alert('Menunggu pembayaran...');
            setLoadingPay(false);
          },
          onError: function () {
            alert('Pembayaran gagal, silakan coba lagi.');
            setLoadingPay(false);
          },
        });
      } else {
        alert('Simulasi Midtrans: Integrasi Snap.js Siap Dipakai!');
        setLoadingPay(false);
      }
    } catch (err) {
      console.error(err);
      setLoadingPay(false);
    }
  };

  const invoice = customerData?.invoices[0];

  return (
    <div className="noc-pay-wrapper min-vh-100 py-0 py-md-5">
      <style>{`
        :root {
          --noc-bg-navy: #090e17;
          --noc-card-navy: #0f172a;
          --noc-accent-cyan: #0284c7;
          --noc-glow-cyan: #38bdf8;
          --noc-border-dark: rgba(255, 255, 255, 0.12);
        }

        body {
          background-color: var(--noc-bg-navy) !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .noc-app-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          background-color: var(--noc-bg-navy);
          position: relative;
        }

        @media (min-width: 768px) {
          .noc-app-container {
            border-radius: 28px;
            border: 1px solid var(--noc-border-dark);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
            overflow: hidden;
          }
        }

        /* HEADER LENGKUNG NOCSPHERE */
        .noc-curved-header {
          background: linear-gradient(180deg, #0f172a 0%, #090e17 100%);
          padding: 28px 24px 110px 24px;
          border-bottom-left-radius: 36px;
          border-bottom-right-radius: 36px;
          position: relative;
        }

        .noc-nav-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .noc-back-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .noc-back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .noc-main-content {
          margin-top: -85px;
          padding: 0 20px 30px 20px;
          position: relative;
          z-index: 10;
        }

        .noc-floating-card {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
          height: 100%;
        }

        .bill-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          font-size: 0.875rem;
          border-bottom: 1px dashed #e2e8f0;
        }

        .bill-row:last-child {
          border-bottom: none;
        }

        .bill-label {
          color: #64748b;
          font-weight: 500;
        }

        .bill-value {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }

        .badge-status-unpaid {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          font-size: 0.725rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 50px;
        }

        .badge-status-paid {
          background-color: #f0fdf4;
          color: #16a34a;
          border: 1px solid #86efac;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 50px;
        }

        .btn-pay-midtrans {
          background-color: #0284c7;
          color: #ffffff;
          font-weight: 800;
          padding: 14px;
          border-radius: 50px;
          border: none;
          width: 100%;
          font-size: 1rem;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
          transition: all 0.2s ease;
        }

        .btn-pay-midtrans:hover {
          background-color: #0369a1;
          transform: translateY(-1px);
        }

        .noc-side-panel {
          background-color: var(--noc-card-navy);
          border: 1px solid var(--noc-border-dark);
          border-radius: 24px;
          padding: 24px;
          height: 100%;
          color: #ffffff;
        }

        /* HISTORI ITEM INTERAKTIF */
        .history-item-clickable {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .history-item-clickable:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: var(--noc-glow-cyan);
          transform: translateX(4px);
        }

        /* TOMBOL TANYA ADMIN WHATSAPP */
        .btn-tanya-admin {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--noc-border-dark);
          color: #ffffff;
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-tanya-admin:hover {
          background-color: #25d366;
          color: #ffffff;
          border-color: #25d366;
        }

        /* MODAL DETAIL HISTORI */
        .noc-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .noc-modal-box {
          background: #ffffff;
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
          padding: 24px;
          color: #0f172a;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="noc-app-container">
        {/* HEADER LENGKUNG NOCSPHERE */}
        <div className="noc-curved-header">
          <div className="noc-nav-top">
            <button className="noc-back-btn" onClick={() => router.push('/')}>
              &#x2715;
            </button>
            <h5 className="fw-bold text-white mb-0">Rincian Pembayaran Tagihan</h5>
          </div>

          {/* BAGIAN DATA USER */}
          <div className="mt-3">
            <p className="text-white fw-semibold mb-1 fs-5">
              {customerData?.customerName || 'Alvinza Erza Farandhika'}
            </p>
            <small className="text-info fw-bold" style={{ letterSpacing: '0.5px' }}>
              {customerData?.customerId ? `ID: ${customerData.customerId}` : 'ID-10293'} • {customerData?.phone || ''}
            </small>
          </div>
        </div>

        {/* UTAMA: GRID RESPONSIVE DESKTOP & MOBILE */}
        <div className="noc-main-content">
          <div className="row g-4">
            
            {/* KOLOM KIRI: KARTU RINCIAN TAGIHAN */}
            <div className="col-12 col-lg-7">
              {customerData && invoice && (
                <div className="noc-floating-card">
                  {/* BRANDING LOGO (NOCSPHERE_BLACK.PNG) & NOMOR TAGIHAN */}
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
                    <img src="/img/nocsphere_black.png" alt="NocSphere" style={{ height: '30px', objectFit: 'contain' }} />
                    <span className="text-secondary small fw-bold">
                      ID Tagihan <strong className="text-dark">{invoice.id}</strong>
                    </span>
                  </div>

                  {/* STATUS & NOMINAL UTAMA */}
                  <div className="text-center my-4">
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                      <span className="text-muted small fw-bold">Periode {invoice.period}</span>
                      <span className="badge-status-unpaid">BELUM DIBAYAR</span>
                    </div>
                    <h2 className="fw-extrabold text-dark mb-1 display-6">{formatRupiah(invoice.totalAmount)}</h2>
                    <small className="text-danger fw-semibold d-block">
                      Jatuh Tempo: {invoice.dueDate}
                    </small>
                  </div>

                  <hr className="my-3 border-secondary opacity-25" />

                  {/* RINCIAN DATA PELANGGAN & BIAYA */}
                  <div className="d-flex flex-column gap-1 mb-4">
                    <div className="bill-row">
                      <span className="bill-label">Nama Pelanggan</span>
                      <span className="bill-value">{customerData.customerName}</span>
                    </div>
                    <div className="bill-row">
                      <span className="bill-label">ID Pelanggan</span>
                      <span className="bill-value">{customerData.customerId}</span>
                    </div>
                    <div className="bill-row">
                      <span className="bill-label">Paket Layanan</span>
                      <span className="bill-value">{customerData.packageName} ({customerData.speed})</span>
                    </div>
                    <div className="bill-row">
                      <span className="bill-label">Biaya Langganan</span>
                      <span className="bill-value">{formatRupiah(invoice.subtotal)}</span>
                    </div>
                    <div className="bill-row">
                      <span className="bill-label">PPN (11%)</span>
                      <span className="bill-value">{formatRupiah(invoice.taxFee)}</span>
                    </div>
                    <div className="bill-row">
                      <span className="bill-label">Biaya Admin</span>
                      <span className="bill-value">{formatRupiah(invoice.adminFee)}</span>
                    </div>
                  </div>

                  {/* TOMBOL BAYAR SEKARANG */}
                  <button
                    className="btn-pay-midtrans"
                    onClick={handleMidtransPay}
                    disabled={loadingPay}
                  >
                    {loadingPay ? 'Memproses Midtrans...' : 'Bayar Sekarang via Midtrans'}
                  </button>
                </div>
              )}
            </div>

            {/* KOLOM KANAN: PANEL HISTORI & TANYA ADMIN */}
            <div className="col-12 col-lg-5">
              <div className="noc-side-panel d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                    <h6 className="fw-bold mb-0 text-white">Riwayat Pembayaran</h6>
                    <small className="text-secondary opacity-75" style={{ fontSize: '0.725rem' }}>Klik untuk detail</small>
                  </div>

                  {/* LIST HISTORI PEMBAYARAN INTERAKTIF */}
                  <div className="history-list">
                    {customerData?.history?.map((item, idx) => (
                      <div 
                        className="history-item-clickable" 
                        key={idx}
                        onClick={() => setSelectedHistory(item)}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-white small">{item.period}</span>
                          <span className="badge-status-paid">LUNAS</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-secondary opacity-75" style={{ fontSize: '0.75rem' }}>
                            {item.date}
                          </span>
                          <span className="fw-bold text-info small">{formatRupiah(item.amount)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2 pt-1 border-top border-white border-opacity-10">
                          <small className="text-secondary opacity-50" style={{ fontSize: '0.7rem' }}>
                            {item.method}
                          </small>
                          <small className="text-info opacity-80" style={{ fontSize: '0.7rem' }}>
                            Lihat Struk
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOMBOL TANYA ADMIN */}
                <div className="mt-4 pt-2">
                  <a
                    href="https://wa.me/628123456789?text=Halo%20Admin%20NocSphere,%20saya%20butuh%20bantuan%20terkait%20tagihan%20internet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tanya-admin"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-whatsapp fs-5 text-success"></i>
                      <span>Tanya Admin</span>
                    </div>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* MODAL DETAIL BUKTI/STRUK HISTORI DIBAYAR */}
        {selectedHistory && (
          <div className="noc-modal-overlay" onClick={() => setSelectedHistory(null)}>
            <div className="noc-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <img src="/img/nocsphere_black.png" alt="NocSphere" style={{ height: '24px' }} />
                <button 
                  className="btn-close" 
                  onClick={() => setSelectedHistory(null)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="text-center my-3">
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill small mb-2">
                  TRANSAKSI SUCCESS
                </span>
                <h4 className="fw-bold text-dark mb-1">{formatRupiah(selectedHistory.amount)}</h4>
                <small className="text-muted">Periode {selectedHistory.period}</small>
              </div>

              <div className="bg-light p-3 rounded-3 mb-3" style={{ fontSize: '0.85rem' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">ID Transaksi</span>
                  <span className="fw-bold">{selectedHistory.id}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Waktu Pembayaran</span>
                  <span className="fw-bold text-end">{selectedHistory.date}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Metode Pembayaran</span>
                  <span className="fw-bold">{selectedHistory.method}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">No. Referensi</span>
                  <span className="fw-bold">{selectedHistory.refNumber}</span>
                </div>
              </div>

              <button 
                className="btn btn-outline-dark w-100 rounded-pill fw-bold"
                onClick={() => {
                  alert(`Mengunduh Struk ${selectedHistory.id}...`);
                }}
              >
                Cetak Struk Pembayaran
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}