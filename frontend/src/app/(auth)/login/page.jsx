"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import pembongkar token JWT

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Username atau Password Salah!");
      }

      if (result.status === "success") {
        // 2. Simpan token JWT dan metadata ke LocalStorage
        localStorage.setItem("nocsphere_token", result.access_token);
        localStorage.setItem("user_level", result.level);

        // 3. BONGKAR JWT Token untuk mendapatkan 'id_perusahaan'
        const decodedToken = jwtDecode(result.access_token);
        const idPerusahaan = decodedToken.id_perusahaan; // Mengambil data {"id_perusahaan": id_perusahaan} dari backend

        // 4. Alihkan halaman secara dinamis menggunakan ID Perusahaan di FE!
        // Hasilnya user akan diarahkan ke /dashboard/101, /dashboard/102, dst.
        router.push(`/dashboard/${idPerusahaan}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #060913 0%, #0b1120 100%)",
        padding: "20px",
      }}
    >
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="card-body p-4 p-sm-5">
          <h2
            className="fw-bold text-dark mb-1"
            style={{ fontSize: "28px", letterSpacing: "-0.5px" }}
          >
            Log in
          </h2>
          <p className="text-muted small mb-4">
            Masukkan kredensial NocSphere Anda.
          </p>

          {error && (
            <div
              className="alert alert-danger small py-2 border-0 rounded-3 mb-4"
              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control px-3 text-white"
                placeholder="Email"
                style={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  height: "48px",
                  borderRadius: "8px",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control px-3 text-white"
                placeholder="Password"
                style={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  height: "48px",
                  borderRadius: "8px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn text-white w-100 fw-bold"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #1e3a8a 0%, #0f172a 100%)",
                height: "46px",
                borderRadius: "8px",
                border: "none",
              }}
            >
              {loading ? "Otentikasi..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
