export default function TroubleCpu() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-danger fw-medium small">Troubleshooting</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Mengatasi High CPU Load akibat Request API</h1>
      <p>Penggunaan router seri lawas (seperti RB750Gr3 atau hEX series) terkadang rentan mengalami lonjakan CPU Load jika mengelola ratusan user dengan interval monitoring yang terlalu rapat.</p>
      
      <h3 className="text-dark fw-bold mt-4 h5">Langkah Optimasi</h3>
      <ul>
        <li><strong>Sesuaikan Interval Sinkronisasi:</strong> Masuk ke Pengaturan Router di NocSphere, ubah <em>Sync Interval</em> dari tiap 1 menit menjadi <strong>5 menit</strong> atau <strong>10 menit</strong>. Ini memangkas beban query database router secara signifikan.</li>
        <li><strong>Matikan Fitur Traffic Monitor Realtime yang Tidak Perlu:</strong> Jika Anda tidak terlalu membutuhkan grafik bandwidth lalu-lintas per detik pelanggan di dashboard, matikan opsi tersebut untuk menghemat utilitas CPU MikroTik.</li>
      </ul>
    </div>
  );
}