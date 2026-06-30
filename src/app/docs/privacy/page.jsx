export default function PrivacyPolicy() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-muted fw-medium small">Policies</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Kebijakan Privasi</h1>
      <p>NocSphere berkomitmen penuh menjaga keamanan data jaringan Anda.</p>
      <ul>
        <li><strong>Kredensial API:</strong> Seluruh password API router dan token enkripsi disimpan menggunakan teknologi hashing satu arah tingkat lanjut di database terisolasi.</li>
        <li><strong>Data Pelanggan:</strong> Kami tidak pernah membagikan atau menjual data pelanggan, nomor telepon WhatsApp, atau rekam jejak invoice Anda kepada pihak ketiga mana pun.</li>
      </ul>
    </div>
  );
}