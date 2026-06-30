export default function TroubleSync() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-danger fw-medium small">Troubleshooting</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Mengatasi Kegagalan Sinkronisasi List Secret</h1>
      <p>Masalah ini terjadi ketika Anda menambah, menghapus, atau mengubah nama user PPPoE langsung dari Winbox tanpa melalui panel NocSphere, sehingga menyebabkan ketidakcocokan (*mismatch*) data.</p>
      
      <h3 className="text-dark fw-bold mt-4 h5">Aturan Emas Penggunaan</h3>
      <div className="alert alert-warning">
        Selalu lakukan manajemen user (Tambah/Edit/Hapus) langsung dari panel web NocSphere. Perubahan yang Anda lakukan di web akan otomatis langsung diaplikasikan ke MikroTik.
      </div>

      <h3 className="text-dark fw-bold mt-4 h5">Solusi Penyamaan Data</h3>
      <p>Jika data terlanjur berantakan, masuk ke panel NocSphere &gt; pilih router Anda &gt; klik fitur <strong>Import Existing Secrets</strong>. Sistem akan membaca ulang seluruh database MikroTik Anda dan menyamakannya dengan database cloud NocSphere secara bersih.</p>
    </div>
  );
}