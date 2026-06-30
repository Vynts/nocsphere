export default function FairUsePolicy() {
  return (
    <div className="container py-5 text-secondary" style={{ maxWidth: "800px" }}>
      <span className="text-muted fw-medium small">Policies</span>
      <h1 className="fw-bold text-dark mt-1 mb-4">Fair Use Policy (FUP)</h1>
      <p>Untuk memastikan server cloud radius kami tetap responsif dan stabil bagi seluruh pengguna, batasan wajar (*rate limits*) berikut diberlakukan:</p>
      <ul>
        <li>Batas maksimal permintaan interaksi hit API adalah 60 request per menit per akun router.</li>
        <li>Akun yang terbukti sengaja memodifikasi script sistem untuk melakukan spamming query massal terus-menerus akan dibatasi kecepatannya (*throttled*) demi menjaga kenyamanan pengguna lain dalam satu cluster server.</li>
      </ul>
    </div>
  );
}