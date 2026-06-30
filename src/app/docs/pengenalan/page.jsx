export default function PengenalanSistem() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-primary fw-medium small">Konsep Dasar</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Pengenalan Sistem NocSphere</h1>
      <p>NocSphere adalah platform manajemen PPPoE dan billing otomatis yang dirancang khusus untuk mempercepat, menyederhanakan, dan mengamankan operasional ISP (Internet Service Provider) serta jaringan RT/RW Net berskala mikro hingga enterprise.</p>
      
      <h3 className="text-dark fw-bold mt-4 h5">Mengapa NocSphere?</h3>
      <p>Berbeda dengan aplikasi billing konvensional yang terus-menerus melakukan *spamming* perintah API ke MikroTik, NocSphere menggunakan arsitektur pintar berbasis <strong>Cloud Radius</strong> dan <strong>Smart Caching System</strong>. Sistem ini memastikan sinkronisasi data pelanggan tetap *real-time* tanpa mengorbankan performa router.</p>
      
      <h3 className="text-dark fw-bold mt-4 h5">Arsitektur Utama</h3>
      <ul>
        <li><strong>NocSphere Core Dashboard:</strong> Panel manajemen berbasis web untuk mengelola paket, data pelanggan, invoice, dan keuangan.</li>
        <li><strong>Hybrid Integration Engine:</strong> Menghubungkan cloud dashboard secara aman ke satu atau beberapa router MikroTik sekaligus melalui jalur terenkripsi.</li>
      </ul>
    </div>
  );
}