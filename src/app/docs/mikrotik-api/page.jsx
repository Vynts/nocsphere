export default function MikrotikApi() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-primary fw-medium small">Konsep Dasar</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Menghubungkan Koneksi MikroTik API</h1>
      <p>Panduan ini menjelaskan langkah demi langkah mengintegrasikan RouterOS MikroTik Anda dengan panel kontrol NocSphere melalui API port standar maupun jalur secure tunnel.</p>
      
      <div className="alert alert-info">
        <strong>Prasyarat:</strong> Pastikan port API MikroTik Anda (default: 8728 atau 8729 untuk SSL) terbuka atau Anda telah mengaktifkan fitur Cloud Tunneling dari NocSphere.
      </div>

      <h3 className="text-dark fw-bold mt-4 h5">Langkah 1: Membuat User API di MikroTik</h3>
      <p>Buka Terminal MikroTik melalui Winbox, lalu jalankan perintah berikut untuk membuat user khusus dengan hak akses terbatas demi keamanan:</p>
      <pre className="bg-light p-3 rounded" style={{ fontSize: "0.85rem" }}>
        /user group add name=nocsphere-group policy=api,read,write,test,winbox{"\n"}
        /user add name=noc_api group=nocsphere-group password=PasswordRahasiaAnda
      </pre>

      <h3 className="text-dark fw-bold mt-4 h5">Langkah 2: Input Kredensial di Dashboard</h3>
      <ol>
        <li>Masuk ke Panel NocSphere &gt; Menu <strong>Router Management</strong> &gt; Klik <strong>Tambah Router</strong>.</li>
        <li>Masukkan Nama Router, IP Public / Domain / URL Cloud Tunnel Anda.</li>
        <li>Isi Username dengan <code>noc_api</code> dan Password yang telah dibuat sebelumnya.</li>
        <li>Klik <strong>Tes Koneksi</strong>. Jika sukses, status indikator akan berubah menjadi hijau.</li>
      </ol>
    </div>
  );
}