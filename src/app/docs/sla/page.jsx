export default function Sla() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-muted fw-medium small">Policies</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Service Level Agreement (SLA)</h1>
      <p>Kami memberikan jaminan ketersediaan layanan (*uptime guarantee*) sebesar <strong>99.9%</strong> setiap bulannya untuk infrastruktur inti server Radius Cloud dan Dashboard Billing NocSphere.</p>
      <p>Kompensasi berupa perpanjangan masa aktif paket gratis akan diberikan secara proporsional jika terjadi gangguan infrastruktur massal di luar jadwal perawatan resmi (*maintenance scheduled*) yang diumumkan sebelumnya.</p>
    </div>
  );
}