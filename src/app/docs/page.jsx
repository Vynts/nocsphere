"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NocSphereFullDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("konsep-dasar");
  const [activeSubSection, setActiveSubSection] = useState(""); // Untuk sub-judul artikel detail
  const [feedback, setFeedback] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null); 
  const searchInputRef = useRef(null);
  const router = useRouter();

  const backtoBeranda = (e) => {
  if (e) e.preventDefault();
  
  // 1. Reset semua state dokumentasi
  setActiveArticle(null);
  setSearchQuery("");
  setActiveSection("konsep-dasar");
  
  // 2. Arahkan halaman ke root (/)
  router.push("/");
  };

  // Database Dokumen Lengkap (Termasuk SLA, ToS, FUP, Privacy)
  const docsData = [
    { 
      id: "pengenalan", 
      title: "Pengenalan Sistem", 
      desc: "Pahami arsitektur penagihan cloud radius dan manajemen profil PPPoE NocSphere.", 
      section: "konsep-dasar",
      icon: "bi-book",
      subHeadings: [
        { id: "tentang-nocsphere", text: "Mengapa NocSphere?" },
        { id: "arsitektur-utama", text: "Arsitektur Utama" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Pengenalan Sistem NocSphere</h1>
          <p className="lead text-muted">NocSphere adalah platform manajemen PPPoE dan billing otomatis yang dirancang khusus untuk mempercepat dan mengamankan operasional ISP serta jaringan RT/RW Net berskala mikro hingga enterprise.</p>
          
          <h3 id="tentang-nocsphere" className="text-dark fw-bold mt-4 h5 scroll-target">Mengapa NocSphere?</h3>
          <p>Berbeda dengan aplikasi billing konvensional yang terus-menerus melakukan spamming perintah API ke MikroTik, NocSphere menggunakan arsitektur pintar berbasis <strong>Cloud Radius</strong> dan <strong>Smart Caching System</strong>. Sistem ini memastikan sinkronisasi data pelanggan tetap <em>real-time</em> tanpa mengorbankan performa resource CPU router Anda.</p>
          
          <h3 id="arsitektur-utama" className="text-dark fw-bold mt-4 h5 scroll-target">Arsitektur Utama</h3>
          <ul>
            <li><strong>NocSphere Core Dashboard:</strong> Panel manajemen berbasis web pusat untuk mengelola paket, data pelanggan, invoice, dan keuangan.</li>
            <li><strong>Hybrid Integration Engine:</strong> Menghubungkan cloud dashboard secara aman ke satu atau beberapa router MikroTik sekaligus melalui jalur terenkripsi.</li>
          </ul>
        </>
      )
    },
    { 
      id: "mikrotik-api", 
      title: "Koneksi MikroTik API", 
      desc: "Cara menghubungkan remote API RouterOS v6/v7 menggunakan enkripsi tunneling aman.", 
      section: "konsep-dasar",
      icon: "bi-router",
      subHeadings: [
        { id: "langkah-1", text: "Langkah 1: Membuat User API" },
        { id: "langkah-2", text: "Langkah 2: Input Kredensial" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Menghubungkan Koneksi MikroTik API</h1>
          <p>Panduan ini menjelaskan langkah demi langkah mengintegrasikan RouterOS MikroTik Anda dengan panel kontrol NocSphere melalui API port standar maupun jalur secure tunnel.</p>
          <div className="alert alert-info py-2 small my-3">
            <strong>Prasyarat:</strong> Pastikan port API MikroTik Anda (default: 8728 atau 8729 untuk SSL) terbuka atau Anda telah mengaktifkan fitur Cloud Tunneling dari NocSphere.
          </div>
          
          <h3 id="langkah-1" className="text-dark fw-bold mt-4 h5 scroll-target">Langkah 1: Membuat User API di MikroTik</h3>
          <p>Buka Terminal MikroTik melalui Winbox, lalu jalankan perintah berikut untuk membuat user khusus dengan hak akses terbatas demi keamanan:</p>
          <pre className="bg-light p-3 rounded" style={{ fontSize: "0.85rem" }}>
            /user group add name=nocsphere-group policy=api,read,write,test,winbox{"\n"}
            /user add name=noc_api group=nocsphere-group password=PasswordRahasiaAnda
          </pre>
          
          <h3 id="langkah-2" className="text-dark fw-bold mt-4 h5 scroll-target">Langkah 2: Input Kredensial di Dashboard</h3>
          <ol>
            <li>Masuk ke Panel NocSphere &gt; Menu <strong>Router Management</strong> &gt; Klik <strong>Tambah Router</strong>.</li>
            <li>Masukkan Nama Router, IP Public / Domain / URL Cloud Tunnel Anda.</li>
            <li>Isi Username dengan <code>noc_api</code> dan Password yang telah dibuat sebelumnya.</li>
            <li>Klik <strong>Tes Koneksi</strong>. Jika sukses, status indikator akan berubah menjadi hijau.</li>
          </ol>
        </>
      )
    },
    { 
      id: "isolir", 
      title: "Otomatisasi Isolir", 
      desc: "Skema perpindahan profil ke mode isolir otomatis tepat waktu saat jatuh tempo.", 
      section: "konsep-dasar",
      icon: "bi-shield-lock",
      subHeadings: [
        { id: "alur-isolir", text: "Bagaimana Alur Isolir Bekerja?" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Sistem Otomatisasi Isolir Pelanggan Menunggak</h1>
          <p>NocSphere mengeliminasi proses pemutusan manual pelanggan yang telat bayar. Sistem billing kami akan memantau jatuh tempo invoice secara otomatis setiap hari.</p>
          <h3 id="alur-isolir" className="text-dark fw-bold mt-4 h5 scroll-target">Bagaimana Alur Isolir Bekerja?</h3>
          <ol>
            <li><strong>Deteksi Jatuh Tempo:</strong> Pada tanggal jatuh tempo pukul 00:01 WIB, sistem mengecek invoice yang belum terbayar.</li>
            <li><strong>Eksekusi Profil PPPoE:</strong> Sistem mengirimkan perintah API ke MikroTik untuk mengubah profil secret pelanggan secara instan dari profil reguler ke profil isolir (misal: <code>Isolir-NocSphere</code>).</li>
            <li><strong>Pengalihan Halaman (Redirect):</strong> Pelanggan yang terisolir secara otomatis dialihkan ke halaman peringatan tagihan saat mencoba membuka browser.</li>
          </ol>
        </>
      )
    },
    { 
      id: "whatsapp", 
      title: "Notifikasi Billing WhatsApp", 
      desc: "Integrasi pengiriman invoice PDF otomatis langsung ke nomor kontak pelanggan.", 
      section: "konsep-dasar",
      icon: "bi-whatsapp",
      subHeadings: [
        { id: "fitur-wa", text: "Fitur Unggulan" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Integrasi Notifikasi Billing WhatsApp</h1>
          <p>Tingkatkan angka konversi penagihan Anda dengan mengirimkan invoice digital, pengingat harian, dan struk lunas langsung ke chat WhatsApp pelanggan secara otomatis.</p>
          <h3 id="fitur-wa" className="text-dark fw-bold mt-4 h5 scroll-target">Fitur Unggulan</h3>
          <ul>
            <li><strong>H-3 Pengingat:</strong> Mengirimkan pesan pengingat tagihan otomatis 3 hari sebelum tanggal jatuh tempo.</li>
            <li><strong>Pesan Isolir:</strong> Mengabarkan pelanggan secara instan sesaat setelah layanannya diisolir oleh sistem.</li>
            <li><strong>Pemberitahuan Lunas:</strong> Struk digital otomatis dikirim beserta tautan unduhan PDF invoice resmi begitu pembayaran terkonfirmasi.</li>
          </ul>
        </>
      )
    },
    { 
      id: "trouble-isolir", 
      title: "Gagal Lepas Isolir Instan", 
      desc: "Solusi jika status isolir user PPPoE tidak otomatis terlepas setelah pembayaran VA/QRIS sukses.", 
      section: "troubleshooting",
      icon: "bi-qr-code-scan",
      subHeadings: [
        { id: "cek-log", text: "1. Periksa Log API" },
        { id: "sinkron-manual", text: "2. Sinkronisasi Manual" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Solusi Gagal Lepas Isolir Otomatis setelah Bayar</h1>
          <p>Jika pelanggan mengeluh layanannya masih terisolir padahal sudah sukses melakukan pembayaran via QRIS/VA, berikut adalah poin pengecekan utama:</p>
          <h3 id="cek-log" className="text-dark fw-bold mt-4 h5 scroll-target">1. Periksa Log API Router</h3>
          <p>Buka Log di Winbox MikroTik Anda. Cek apakah ada error bertuliskan <code>action failed: ip pppoe secret command timeout</code>. Jika iya, berarti koneksi internet dari server ke router Anda mengalami interupsi sesaat.</p>
          <h3 id="sinkron-manual" className="text-dark fw-bold mt-4 h5 scroll-target">2. Cara Sinkronisasi Manual (Force Clear)</h3>
          <ol>
            <li>Masuk ke Dashboard NocSphere &gt; Menu <strong>Pelanggan Aktif</strong>.</li>
            <li>Cari nama pelanggan yang bermasalah, klik opsi &gt; Pilih <strong>Sinkronisasi Ulang Profil</strong>.</li>
            <li>Sistem akan mengirim ulang profil reguler dan menendang (kick) session PPPoE aktif agar pelanggan mendapatkan IP baru bebas isolir.</li>
          </ol>
        </>
      )
    },
    { 
      id: "trouble-cpu", 
      title: "Optimasi CPU Load MikroTik", 
      desc: "Mengatur interval caching query data agar load API tidak membebani resource router core.", 
      section: "troubleshooting",
      icon: "bi-speedometer2",
      subHeadings: [
        { id: "langkah-optimasi", text: "Langkah Optimasi CPU" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Mengatasi High CPU Load akibat Request API</h1>
          <p>Penggunaan router seri lawas (seperti RB750Gr3) terkadang rentan mengalami lonjakan CPU Load jika mengelola ratusan user dengan interval monitoring yang terlalu rapat.</p>
          <h3 id="langkah-optimasi" className="text-dark fw-bold mt-4 h5 scroll-target">Langkah Optimasi</h3>
          <ul>
            <li><strong>Sesuaikan Interval Sinkronisasi:</strong> Masuk ke Pengaturan Router di NocSphere, ubah <em>Sync Interval</em> dari tiap 1 menit menjadi <strong>5 menit</strong> atau <strong>10 menit</strong>. Ini memangkas beban query database router secara signifikan.</li>
            <li><strong>Traffic Monitor:</strong> Matikan grafik bandwidth lalu-lintas per detik pelanggan di dashboard jika tidak terlalu dibutuhkan untuk menghemat utilitas CPU MikroTik.</li>
          </ul>
        </>
      )
    },
    { 
      id: "trouble-sync", 
      title: "Masalah Sinkronisasi Secret", 
      desc: "Mengatasi kegagalan sinkronisasi berkala antara panel dashboard NocSphere dan list secrets lokal.", 
      section: "troubleshooting",
      icon: "bi-globe",
      subHeadings: [
        { id: "solusi-sync", text: "Solusi Penyamaan Data" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Mengatasi Kegagalan Sinkronisasi List Secret</h1>
          <p>Masalah ini terjadi ketika Anda menambah, menghapus, atau mengubah nama user PPPoE langsung dari Winbox tanpa melalui panel NocSphere, sehingga menyebabkan ketidakcocokan data.</p>
          <div className="alert alert-warning py-2 small">
            <strong>Aturan Emas:</strong> Selalu lakukan manajemen user (Tambah/Edit/Hapus) langsung dari panel web NocSphere agar langsung diaplikasikan ke MikroTik secara bersih.
          </div>
          <h3 id="solusi-sync" className="text-dark fw-bold mt-4 h5 scroll-target">Solusi Penyamaan Data</h3>
          <p>Jika data terlanjur berantakan, masuk ke panel NocSphere &gt; pilih router Anda &gt; klik fitur <strong>Import Existing Secrets</strong> untuk menyamakan ulang seluruh database.</p>
        </>
      )
    },
    { 
      id: "tos", 
      title: "Ketentuan Layanan (ToS)", 
      desc: "Aturan mengikat mengenai batasan lisensi, pemakaian cloud radius, dan pengelolaan sistem.", 
      section: "kebijakan",
      icon: "bi-file-earmark-text",
      subHeadings: [
        { id: "aturan-penggunaan", text: "Aturan Penggunaan Atas Lisensi" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Ketentuan Layanan (Terms of Service)</h1>
          <p>Dengan mendaftar dan menggunakan layanan NocSphere, Anda secara sadar mengikatkan diri dan setuju untuk mematuhi semua aturan operasional di bawah ini:</p>
          <h3 id="aturan-penggunaan" className="text-dark fw-bold mt-4 h5 scroll-target">Aturan Penggunaan Atas Lisensi</h3>
          <ul>
            <li>Layanan NocSphere digunakan eksklusif untuk mengelola administrasi internal router Anda sendiri secara sah. Segala bentuk modifikasi ilegal atau penembusan celah keamanan merupakan tanggung jawab hukum pengguna sepenuhnya.</li>
            <li>NocSphere berhak menangguhkan (suspend) akun sementara jika mendeteksi aktivitas mencurigakan berupa serangan brute-force API ke kluster server utama kami.</li>
          </ul>
        </>
      )
    },
    { 
      id: "privacy", 
      title: "Kebijakan Privasi", 
      desc: "Bagaimana kami mengamankan dan mengisolasi data kredensial API serta list pelanggan Anda.", 
      section: "kebijakan",
      icon: "bi-person-vcard",
      subHeadings: [
        { id: "keamanan-kredensial", text: "Enkripsi Kredensial API" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Kebijakan Privasi</h1>
          <p>NocSphere berkomitmen penuh menjaga integritas, privasi, dan keamanan data jaringan bisnis Anda tanpa kompromi.</p>
          <h3 id="keamanan-kredensial" className="text-dark fw-bold mt-4 h5 scroll-target">Enkripsi Kredensial API</h3>
          <ul>
            <li><strong>Kredensial API Router:</strong> Seluruh password API router dan token otentikasi disimpan menggunakan teknologi enkripsi AES-256 tingkat tinggi di database terisolasi.</li>
            <li><strong>Data Pelanggan:</strong> Kami menghormati hak privasi Anda; NocSphere tidak akan pernah membagikan, menyewakan, atau menjual log data pelanggan, nomor telepon WhatsApp, atau rekam jejak invoice Anda kepada pihak ketiga mana pun.</li>
          </ul>
        </>
      )
    },
    { 
      id: "fup", 
      title: "Kebijakan Batas Pemakaian (FUP)", 
      desc: "Panduan batas wajar request interval hit API router agar kestabilan server radius terjaga.", 
      section: "kebijakan",
      icon: "bi-file-earmark-check",
      subHeadings: [
        { id: "rate-limits", text: "Batasan Rate Limits Akses" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Fair Use Policy (FUP)</h1>
          <p>Untuk memastikan server cloud radius kami tetap responsif, stabil, dan adil bagi seluruh pengguna interkoneksi, batas pemakaian wajar berikut diterapkan:</p>
          <h3 id="rate-limits" className="text-dark fw-bold mt-4 h5 scroll-target">Batasan Rate Limits Akses</h3>
          <ul>
            <li>Batas maksimal permintaan interaksi hit API default adalah 60 request per menit per akun router.</li>
            <li>Akun yang terbukti secara sengaja memodifikasi script eksternal untuk melakukan spamming query massal terus-menerus akan dibatasi kecepatannya (*throttled*) demi menjaga kestabilan pengguna lain dalam satu cluster server.</li>
          </ul>
        </>
      )
    },
    { 
      id: "sla", 
      title: "Service Level Agreement (SLA)", 
      desc: "Jaminan stabilitas uptime sistem billing cloud dan responsivitas otomatisasi isolir.", 
      section: "kebijakan",
      icon: "bi-shield-shaded",
      subHeadings: [
        { id: "uptime-guarantee", text: "Jaminan 99.9% Uptime Server" }
      ],
      content: (
        <>
          <h1 className="fw-bold text-dark mb-3">Service Level Agreement (SLA)</h1>
          <h3 id="uptime-guarantee" className="text-dark fw-bold mt-4 h5 scroll-target">Jaminan 99.9% Uptime Server</h3>
          <p>Kami memberikan jaminan ketersediaan layanan (*uptime guarantee*) infrastruktur inti sebesar <strong>99.9%</strong> setiap bulannya untuk kluster server Radius Cloud dan Dashboard Billing NocSphere.</p>
          <p>Kompensasi berupa penambahan masa aktif paket gratis secara proporsional akan diberikan jika terjadi gangguan infrastruktur massal di luar jadwal perawatan resmi (*scheduled maintenance*) yang diumumkan sebelumnya.</p>
        </>
      )
    }
  ];

  const filteredDocs = docsData.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hybrid ScrollSpy (Menangani deteksi posisi scroll halaman utama / sub-materi)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      if (activeArticle) {
        const subSections = document.querySelectorAll(".scroll-target");
        subSections.forEach(subSec => {
          const top = subSec.offsetTop;
          const height = subSec.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height + 250) {
            setActiveSubSection(subSec.getAttribute("id"));
          }
        });
      } else {
        const sections = document.querySelectorAll("section[id]");
        sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.getAttribute("id"));
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeArticle]);

  // Fungsi Reset kembali ke Menu Utama Beranda Docs (Perbaikan Utama Navbar Bug)
  const handleBackToHome = (e) => {
    if (e) e.preventDefault();
    setActiveArticle(null);
    setSearchQuery("");
    setActiveSection("konsep-dasar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Smooth Scroll ke Target Element ID
  const scrollToId = (e, id, isSub = false) => {
    if (e) e.preventDefault();
    
    // Jika user klik menu utama saat sedang berada di dalam artikel detail
    if (!isSub && activeArticle) {
      setActiveArticle(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({ top: element.offsetTop - 110, behavior: "smooth" });
          setActiveSection(id);
        }
      }, 80);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 110, behavior: "smooth" });
      if (isSub) setActiveSubSection(id);
    }
  };

  const openArticle = (doc) => {
    setActiveArticle(doc);
    setActiveSubSection(doc.subHeadings?.[0]?.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-vh-100 text-secondary" style={{ fontFamily: "'Inter', sans-serif", color: "#334155" }}>
      
      {/* ================= NAVBAR (FIXED WORKING) ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top py-2 border-bottom border-light-subtle">
        <div className="container-fluid px-4 mx-md-5 my-1">
          {/* Logo klik: Kembali ke menu awal */}
          <a className="navbar-brand d-flex align-items-center fw-semibold text-dark" href="#" onClick={handleBackToHome}>
            <i className="bi bi-hexagon-fill text-dark me-2"></i> nocsphere docs
          </a>
          
          <div className="d-none d-md-flex align-items-center mx-auto position-relative">
            <i className="bi bi-search position-absolute text-muted start-0 ms-3" style={{ pointerEvents: "none" }}></i>
            <input 
              ref={searchInputRef}
              type="text" 
              className="form-control ps-5 pe-5" 
              placeholder="Cari dokumentasi..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if(activeArticle) setActiveArticle(null); }}
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "0.875rem", width: "260px" }}
            />
            <span className="position-absolute end-0 me-2 text-muted" style={{ backgroundColor: "#cbd5e1", color: "#64748b", fontSize: "0.75rem", padding: "2px 4px", borderRadius: "4px" }}>Ctrl K</span>
          </div>

          <div className="d-flex align-items-center">
            <a href="#hubungi-kami" onClick={(e) => { e.preventDefault(); const el = document.getElementById("hubungi-kami"); if(el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" }); }} className="nav-link text-muted me-3" style={{ fontSize: "0.9rem" }}>Support</a>
            {/* Tombol Beranda klik: Kembali ke menu awal */}
            <button className="btn btn-primary btn-sm px-3 d-flex align-items-center" onClick={ backtoBeranda } style={{ borderRadius: "6px", backgroundColor: "#0052cc", border: "none" }}>
              Beranda <i className="bi bi-chevron-right ms-1" style={{ fontSize: "0.75rem" }}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container-fluid px-4 py-4 mt-5 pt-5">
        <div className="row mx-md-5">
          
          <div className="col-12 col-lg-9 pe-lg-5">
            
            {activeArticle ? (
              /* TAMPILAN ARTIKEL DETAIL */
              <article className="animate-fade-in mb-5">
                <button className="btn btn-link text-decoration-none text-muted p-0 mb-4 small d-flex align-items-center gap-1" onClick={handleBackToHome}>
                  <i className="bi bi-arrow-left"></i> Kembali ke Menu Utama
                </button>
                <div className="text-dark custom-article-view">
                  {activeArticle.content}
                </div>
              </article>
            ) : (
              /* TAMPILAN BERANDA UTAMA DOKUMENTASI */
              <>
                {(!searchQuery || filteredDocs.length > 0) ? (
                  <>
                    <span className="text-primary fw-medium" style={{ fontSize: "0.8rem" }}>Getting Started</span>
                    <h1 className="fw-bold text-dark mt-1 mb-3" style={{ fontSize: "2rem" }}>Welcome to NocSphere Docs</h1>
                    <p className="text-muted mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                      Pusat panduan konfigurasi, integrasi MikroTik API, otomatisasi billing PPPoE, sistem isolir, dan dokumentasi penagihan gateway NocSphere.
                    </p>

                    {/* SEKSI 1: KONSEP DASAR */}
                    <section id="konsep-dasar" className="mb-5">
                      <h2 className="fw-bold text-dark mt-4 mb-3" style={{ fontSize: "1.15rem" }}>Konsep Dasar & Integrasi</h2>
                      <div className="row g-3">
                        {filteredDocs.filter(d => d.section === "konsep-dasar").map(doc => (
                          <div className="col-12 col-md-6" key={doc.id} onClick={() => openArticle(doc)}>
                            <div className="card p-3 h-100 custom-docs-card" style={{ cursor: "pointer" }}>
                              <div className="text-primary mb-2" style={{ fontSize: "1.25rem" }}><i className={`bi ${doc.icon}`}></i></div>
                              <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>{doc.title}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>{doc.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* SEKSI 2: TROUBLESHOOTING */}
                    <section id="troubleshooting" className="mb-5">
                      <h2 className="fw-bold text-dark mt-5 mb-3" style={{ fontSize: "1.15rem" }}>Panduan & Troubleshooting</h2>
                      <div className="row g-3">
                        {filteredDocs.filter(d => d.section === "troubleshooting").map(doc => (
                          <div className="col-12 col-md-6" key={doc.id} onClick={() => openArticle(doc)}>
                            <div className="card p-3 h-100 custom-docs-card" style={{ cursor: "pointer" }}>
                              <div className="text-primary mb-2" style={{ fontSize: "1.25rem" }}><i className={`bi ${doc.icon}`}></i></div>
                              <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>{doc.title}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>{doc.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* SEKSI 3: KEBIJAKAN (TOS, SLA, FUP LENGKAP) */}
                    <section id="kebijakan" className="mb-5">
                      <h2 className="fw-bold text-dark mt-5 mb-3" style={{ fontSize: "1.15rem" }}>Kebijakan & Ketentuan</h2>
                      <div className="row g-3">
                        {filteredDocs.filter(d => d.section === "kebijakan").map(doc => (
                          <div className="col-12 col-md-6" key={doc.id} onClick={() => openArticle(doc)}>
                            <div className="card p-3 h-100 custom-docs-card" style={{ cursor: "pointer" }}>
                              <div className="text-primary mb-2" style={{ fontSize: "1.25rem" }}><i className={`bi ${doc.icon}`}></i></div>
                              <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>{doc.title}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>{doc.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : (
                  <div className="text-center py-5 my-5">
                    <i className="bi bi-search text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
                    <h4 className="fw-bold text-dark">Hasil tidak ditemukan</h4>
                    <p className="text-muted">Tidak ada dokumentasi yang cocok dengan kata kunci "{searchQuery}"</p>
                  </div>
                )}
              </>
            )}

            {/* NEED HELP BOX */}
            <section id="hubungi-kami" className="mt-5 pt-2">
              <h2 className="fw-bold text-dark mb-3" style={{ fontSize: "1.15rem" }}>Butuh Bantuan?</h2>
              <div className="p-3 d-flex align-items-start justify-content-between rounded-3 border border-light-subtle bg-white shadow-sm">
                <div className="d-flex align-items-start">
                  <div className="text-primary me-3 mt-1" style={{ fontSize: "1.2rem" }}><i className="bi bi-envelope"></i></div>
                  <div>
                    <h6 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.9rem" }}>Hubungi Tim Support</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Kirimkan kendala integrasi atau pertanyaan Anda ke Whatsapp <a href="mailto:support@nocsphere.host" className="text-decoration-none fw-medium text-dark border-bottom border-dark">+62831-7016-5995</a>.</p>
                  </div>
                </div>
                <a href="mailto:support@nocsphere.host" className="text-muted ms-2"><i className="bi bi-arrow-up-right" style={{ fontSize: "0.8rem" }}></i></a>
              </div>
            </section>

            {/* FEEDBACK */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between border-top pt-4 mt-5 mb-4">
              {feedback === null ? (
                <>
                  <span className="text-muted mb-2 mb-sm-0" style={{ fontSize: "0.85rem" }}>Apakah panduan ini membantu?</span>
                  <div className="d-flex gap-2">
                    <button onClick={() => setFeedback('yes')} className="btn btn-outline-secondary btn-sm px-3 d-flex align-items-center gap-1" style={{ fontSize: "0.8rem", borderColor: "#cbd5e1" }}><i className="bi bi-hand-thumbs-up"></i> Ya</button>
                    <button onClick={() => setFeedback('no')} className="btn btn-outline-secondary btn-sm px-3 d-flex align-items-center gap-1" style={{ fontSize: "0.8rem", borderColor: "#cbd5e1" }}><i className="bi bi-hand-thumbs-down"></i> Tidak</button>
                  </div>
                </>
              ) : (
                <span className="text-success fw-medium"><i className="bi bi-check-circle-fill me-1"></i> Terima kasih atas feedback Anda!</span>
              )}
            </div>

            {/* FOOTER */}
            <footer className="d-flex align-items-center justify-content-between border-top pt-3 pb-4">
              <div className="d-flex gap-3" style={{ fontSize: "1.1rem" }}>
                <a href="#" className="text-secondary opacity-50 hov-opacity-100"><i className="bi bi-globe"></i></a>
                <a href="#" className="text-secondary opacity-50 hov-opacity-100"><i className="bi bi-discord"></i></a>
                <a href="#" className="text-secondary opacity-50 hov-opacity-100"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-secondary opacity-50 hov-opacity-100"><i className="bi bi-youtube"></i></a>
              </div>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>Powered by <a href="#" className="text-decoration-none text-muted fw-semibold">nocsphere docs</a></span>
            </footer>

          </div>

          {/* ================= STICKY SIDEBAR RIGHT (DYNAMIC FIX) ================= */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="position-sticky ps-3 border-start border-light-subtle" style={{ top: "6rem", fontSize: "0.85rem" }}>
              
              {activeArticle ? (
                /* SIDEBAR JIKA SEDANG BACA MATERI DETAIL */
                <>
                  <div className="fw-medium text-dark mb-2 d-flex align-items-center gap-1" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                    <i className="bi bi-bookmark-fill text-primary"></i> MATERI ARTIKEL
                  </div>
                  <ul className="list-unstyled d-flex flex-column gap-2.5 m-0 mb-3">
                    {activeArticle.subHeadings?.map((sub, idx) => (
                      <li key={idx}>
                        <a 
                          href={`#${sub.id}`} 
                          onClick={(e) => scrollToId(e, sub.id, true)} 
                          className={`text-decoration-none transition-all ${activeSubSection === sub.id ? 'text-primary fw-semibold' : 'text-muted'}`}
                        >
                          {sub.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2 text-muted opacity-25" />
                  <a href="#" onClick={handleBackToHome} className="text-decoration-none text-muted small d-flex align-items-center gap-1 transition-all hov-primary">
                    <i className="bi bi-arrow-left-short"></i> Kembali ke Menu Utama
                  </a>
                </>
              ) : (
                /* SIDEBAR JIKA DI HALAMAN BERANDA DOCS */
                <>
                  <div className="fw-medium text-dark mb-2 d-flex align-items-center gap-1" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                    <i className="bi bi-list-nested"></i> Halaman Ini
                  </div>
                  <ul className="list-unstyled d-flex flex-column gap-2.5 m-0">
                    <li><a href="#konsep-dasar" onClick={(e) => scrollToId(e, "konsep-dasar")} className={`text-decoration-none transition-all ${activeSection === 'konsep-dasar' ? 'text-primary fw-semibold' : 'text-muted'}`}>Konsep Dasar</a></li>
                    <li><a href="#troubleshooting" onClick={(e) => scrollToId(e, "troubleshooting")} className={`text-decoration-none transition-all ${activeSection === 'troubleshooting' ? 'text-primary fw-semibold' : 'text-muted'}`}>Guides & Troubleshooting</a></li>
                    <li><a href="#kebijakan" onClick={(e) => scrollToId(e, "kebijakan")} className={`text-decoration-none transition-all ${activeSection === 'kebijakan' ? 'text-primary fw-semibold' : 'text-muted'}`}>Kebijakan & Ketentuan</a></li>
                  </ul>
                </>
              )}
              
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-docs-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease-in-out;
          background-color: #ffffff;
        }
        .custom-docs-card:hover {
          border-color: #0052cc;
          box-shadow: 0 4px 12px rgba(0, 82, 204, 0.06);
          transform: translateY(-2px);
        }
        .custom-article-view h1 { font-size: 1.85rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a; }
        .custom-article-view h3 { font-size: 1.1rem; font-weight: 600; margin-top: 1.8rem; margin-bottom: 0.6rem; color: #1e293b; padding-top: 10px; }
        .custom-article-view p, .custom-article-view li { font-size: 0.925rem; line-height: 1.6; color: #475569; }
        .hov-opacity-100:hover { opacity: 1 !important; }
        .transition-all { transition: all 0.15s ease-in-out; }
        .hov-primary:hover { color: #0052cc !important; }
      `}</style>

    </div>
  );
}