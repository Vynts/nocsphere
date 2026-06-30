export default function OtomatisasiIsolir() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-primary fw-medium small">Konsep Dasar</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Sistem Otomatisasi Isolir Pelanggan Menunggak</h1>
      <p>NocSphere mengeliminasi proses pemutusan manual pelanggan yang telat bayar. Sistem billing kami akan memantau jatuh tempo invoice secara otomatis setiap hari.</p>
      
      <h3 className="text-dark fw-bold mt-4 h5">Bagaimana Alur Isolir Bekerja?</h3>
      <ol>
        <li><strong>Deteksi Jatuh Tempo:</strong> Pada tanggal jatuh tempo pukul 00:01 WIB, sistem mengecek invoice yang belum terbayar.</li>
        <li><strong>Eksekusi Profil PPPoE:</strong> Sistem mengirimkan perintah API ke MikroTik untuk mengubah profil secret pelanggan secara instan dari profil reguler (misal: <code>10Mbps-Reguler</code>) ke profil isolir (misal: <code>Isolir-NocSphere</code>).</li>
        <li><strong>Pengalihan Halaman (Redirect):</strong> Pelanggan yang terisolir secara otomatis dialihkan ke halaman peringatan tagihan (Landing Page Isolir) saat mencoba membuka browser.</li>
      </ol>

      <h3 className="text-dark fw-bold mt-4 h5">Konfigurasi di Sisi MikroTik</h3>
      <p>Pastikan Anda memiliki IP Pool khusus isolir dan rule NAT redirect (Port 80/443) yang mengarah ke IP Web Server isolir agar halaman peringatan muncul dengan benar pada perangkat pelanggan.</p>
    </div>
  );
}