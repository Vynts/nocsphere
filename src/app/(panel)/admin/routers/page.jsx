"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoutersPage() {
  const router = useRouter();

  // State API Data & UI Status
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Filter & Pagination
  const [statusFilter, setStatusFilter] = useState("All Routers");
  const [sortFilter, setSortFilter] = useState("Newest");
  const [perPage, setPerPage] = useState(10);

  // State Modal Router
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id_router: "",
    label_router: "",
    host: "",
    port: 8728,
    username_router: "",
    password_router: "",
    autoIsolir: true,
    status: "offline",
  });

  const cardCleanStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  const dropdownMenuStyle = {
    fontSize: "13px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
    padding: "6px",
  };

  // -------------------------------------------------------------
  // 1. Fetch Routers dari Backend API FastAPI
  // -------------------------------------------------------------
  const fetchRouters = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");
      if (!token) {
        router.replace("/login_admin");
        return;
      }

      const response = await fetch("http://localhost:8000/api/router/list", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login_admin");
          throw new Error("Sesi telah berakhir. Silakan login ulang.");
        }
        throw new Error(`Gagal mengambil data. Status: ${response.status}`);
      }

      const data = await response.json();
      setRouters(data);
    } catch (err) {
      console.error("Fetch Router Error:", err);
      if (showLoadingState) setError(err.message);
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. Initial Fetch & Auto Polling (10s)
  // -------------------------------------------------------------
  useEffect(() => {
    fetchRouters(true);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchRouters(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // 3. Dynamic Metrics & Filter/Sort Logic
  // -------------------------------------------------------------

  // Helper fungsi untuk normalisasi status dari API (Letakkan di atas)
  const getRouterStatus = (r) => {
    if (typeof r.status === "boolean") return r.status ? "online" : "offline";
    if (typeof r.is_online === "boolean")
      return r.is_online ? "online" : "offline";
    if (typeof r.status === "string") return r.status.toLowerCase();
    return "offline";
  };

  // Gunakan getRouterStatus di sini
  const onlineCount = routers.filter(
    (r) => getRouterStatus(r) === "online",
  ).length;

  const offlineCount = routers.filter(
    (r) => getRouterStatus(r) === "offline",
  ).length;

  // Filter & Sort Routers
  const filteredRouters = routers
    .filter((r) => {
      const status = getRouterStatus(r);
      if (statusFilter === "Online" || statusFilter === "Online Routers")
        return status === "online";
      if (statusFilter === "Offline" || statusFilter === "Offline Routers")
        return status === "offline";
      return true;
    })
    .sort((a, b) => {
      const idA = a.id_router || a.id || 0;
      const idB = b.id_router || b.id || 0;
      return sortFilter === "Newest" ? idB - idA : idA - idB;
    });

  // -------------------------------------------------------------
  // 4. Modal Handlers
  // -------------------------------------------------------------
  const handleOpenEdit = (routerItem) => {
    setSelectedRouter(routerItem);
    setEditFormData({
      id_router: routerItem.id_router || routerItem.id,
      label_router: routerItem.label_router || routerItem.nama_router || "",
      host: routerItem.host || routerItem.ip_address || "",
      port: routerItem.port || 8728,
      username_router: routerItem.username_router || "",
      password_router: routerItem.password_router || "",
      autoIsolir: routerItem.autoIsolir ?? true,
      status: routerItem.status || "offline",
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -------------------------------------------------------------
  // Handler Save Edit (Update State & API)
  // -------------------------------------------------------------
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      const targetId = editFormData.id_router || editFormData.id;

      // Optional: Kirim update ke Backend FastAPI jika endpoint sudah siap
      /*
    await fetch(`http://localhost:8000/api/router/${targetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editFormData),
    });
    */

      // Update state lokal routers
      setRouters((prev) =>
        prev.map((r) =>
          (r.id_router || r.id) === targetId ? { ...r, ...editFormData } : r,
        ),
      );

      // Close Modal via Bootstrap API
      const modalElement = document.getElementById("editRouterModal");
      if (modalElement && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    } catch (err) {
      console.error("Gagal memperbarui router:", err);
    }
  };

  // Handler Hapus Router
  const handleDeleteRouter = () => {
    if (selectedRouter) {
      const targetId = selectedRouter.id_router || selectedRouter.id;
      setRouters((prev) =>
        prev.filter((r) => (r.id_router || r.id) !== targetId),
      );
      setSelectedRouter(null);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Global CSS fix untuk penanganan bug backdrop/container scrollbar modal */}
      <style jsx global>{`
        body.modal-open {
          overflow: hidden !important;
          padding-right: 0px !important;
        }
      `}</style>

      {/* Header Info */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">Routers / NAS</h3>
        <p className="text-muted mb-0 small fs-md-6 text-break">
          Kelola seluruh perangkat MikroTik, monitor status online/offline, dan
          bandwidth rata-rata secara terpusat.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* LEFT COLUMN: Quick Actions */}
        <div className="col-12 col-xl-3">
          <div className="card p-3 p-sm-4" style={cardCleanStyle}>
            <h6 className="fw-bold text-dark mb-3 fs-6">Quick Actions</h6>

            <div className="d-flex flex-column gap-2">
              <a
                href="/admin/routers/add"
                className="btn btn-primary rounded-3 fw-semibold text-start d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                style={{ fontSize: "14px" }}
              >
                <i className="bi bi-plus-lg fs-6"></i>
                <span>Add New Router</span>
              </a>

              <hr className="my-2 opacity-10" />

              <button
                className={`btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 fw-medium border-0 ${
                  statusFilter === "All Routers"
                    ? "bg-light text-primary fw-bold"
                    : "text-secondary"
                }`}
                onClick={() => setStatusFilter("All Routers")}
                style={{ fontSize: "14px" }}
              >
                <span>All Routers</span>
                <span className="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill px-2">
                  {routers.length}
                </span>
              </button>

              <button
                className={`btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 fw-medium border-0 ${
                  statusFilter === "Online" || statusFilter === "Online Routers"
                    ? "bg-light text-success fw-bold"
                    : "text-secondary"
                }`}
                onClick={() => setStatusFilter("Online")}
                style={{ fontSize: "14px" }}
              >
                <span>Online Routers</span>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2">
                  {onlineCount} {/* Gunakan variabel onlineCount */}
                </span>
              </button>

              <button
                className={`btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 fw-medium border-0 ${
                  statusFilter === "Offline" ||
                  statusFilter === "Offline Routers"
                    ? "bg-light text-danger fw-bold"
                    : "text-secondary"
                }`}
                onClick={() => setStatusFilter("Offline")}
                style={{ fontSize: "14px" }}
              >
                <span>Offline Routers</span>
                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-2">
                  {offlineCount} {/* Gunakan variabel offlineCount */}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Bandwidth & Table */}
        <div className="col-12 col-xl-9" style={{ minWidth: 0 }}>
          {/* 2 BANDWIDTH CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-secondary small fw-medium">
                    Avg Upload Bandwidth
                  </span>
                  <div
                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <i className="bi bi-arrow-up-right fs-6"></i>
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-1 fs-4">342.5 Mbps</h3>
                <span className="text-muted small" style={{ fontSize: "12px" }}>
                  Rata-rata trafik keluar dari semua router
                </span>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="card p-3 p-sm-4 h-100" style={cardCleanStyle}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-secondary small fw-medium">
                    Avg Download Bandwidth
                  </span>
                  <div
                    className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <i className="bi bi-arrow-down-left fs-6"></i>
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-1 fs-4">1.28 Gbps</h3>
                <span className="text-muted small" style={{ fontSize: "12px" }}>
                  Rata-rata trafik masuk dari semua router
                </span>
              </div>
            </div>
          </div>

          {/* MAIN TABLE CARD */}
          <div className="card overflow-hidden" style={cardCleanStyle}>
            <div className="p-3 p-sm-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="fw-bold text-dark mb-0 fs-6 fs-md-5 me-2">
                  Routers / NAS List
                </h5>
              </div>
            </div>

            <div className="table-responsive">
              <table
                className="table align-middle mb-0"
                style={{ fontSize: "14px" }}
              >
                <thead>
                  <tr
                    className="text-uppercase text-secondary"
                    style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                  >
                    <th className="px-3 px-sm-4 py-3 fw-bold border-bottom">
                      Router ID
                    </th>
                    <th className="py-3 fw-bold border-bottom">Device Model</th>
                    <th className="py-3 fw-bold border-bottom">IP / Host</th>
                    <th className="py-3 fw-bold border-bottom">Port</th>
                    <th className="py-3 fw-bold border-bottom">Status</th>
                    <th className="px-3 px-sm-4 py-3 border-bottom text-end">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-5 text-muted small"
                      >
                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                        Memuat data router...
                      </td>
                    </tr>
                  ) : filteredRouters.length > 0 ? (
                    filteredRouters.map((router, index) => {
                      // Safe fallback untuk ID, Name, Host, & Status
                      const routerId =
                        router.id_router || router.id || `router-${index}`;
                      const routerName =
                        router.label_router ||
                        router.name ||
                        `Router ${routerId}`;
                      const routerHost = router.host || router.ip || "-";
                      const isOnline =
                        router.status?.toLowerCase() === "online";

                      return (
                        <tr key={routerId}>
                          <td className="px-3 px-sm-4 py-3 fw-bold text-dark text-nowrap">
                            <span>{routerId}</span>
                          </td>
                          <td className="py-3 text-secondary text-nowrap">
                            {routerName}
                          </td>
                          <td
                            className="py-3 text-dark fw-semibold text-nowrap"
                            style={{ fontSize: "13px" }}
                          >
                            <a className="text-decoration-none" href={`http://${routerHost}:${router.port || 80}`} target="_blank" rel="noopener noreferrer">
                              {routerHost}
                            </a>
                          </td>
                          <td className="py-3 text-secondary text-nowrap">
                            {router.port || "-"}
                          </td>
                          <td className="py-3 text-nowrap">
                            <span
                              className="badge rounded-pill px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                              style={{
                                backgroundColor: isOnline
                                  ? "#e6f4ea"
                                  : "#fce8e6",
                                color: isOnline ? "#137333" : "#c5221f",
                                fontSize: "12px",
                              }}
                            >
                              <i
                                className={
                                  isOnline
                                    ? "bi bi-check-circle-fill"
                                    : "bi bi-x-circle-fill"
                                }
                                style={{ fontSize: "11px" }}
                              ></i>
                              <span className="text-capitalize">
                                {router.status || "offline"}
                              </span>
                            </span>
                          </td>
                          <td className="px-3 px-sm-4 py-3 text-end text-nowrap">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              {/* Edit Button */}
                              <button
                                className="btn btn-sm btn-outline-primary border-0 rounded-2 p-1 px-2 d-inline-flex align-items-center"
                                data-bs-toggle="modal"
                                data-bs-target="#editRouterModal"
                                onClick={() => handleOpenEdit(router)}
                                title="Edit Router"
                              >
                                <i className="bi bi-pencil-fill fs-6"></i>
                              </button>

                              {/* Delete Button */}
                              <button
                                className="btn btn-sm btn-outline-danger border-0 rounded-2 p-1 px-2 d-inline-flex align-items-center"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteRouterModal"
                                onClick={() => setSelectedRouter(router)}
                                title="Hapus Router"
                              >
                                <i className="bi bi-trash-fill fs-6"></i>
                              </button>

                              {/* Detail Link Page Button (Menggunakan Link dari next/link) */}
                              <Link
                                href={`/admin/routers/${routerId}`}
                                className="btn btn-sm btn-link text-secondary p-1 text-decoration-none d-inline-flex align-items-center"
                                title="Lihat Detail Router"
                              >
                                <i className="bi bi-arrow-right fs-6"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-4 text-muted small"
                      >
                        Tidak ada router yang sesuai dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Per Page Footer */}
            <div className="p-3 p-sm-4 border-top d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">Per page</span>
                <select
                  className="form-select form-select-sm bg-white border rounded-3 text-secondary fw-semibold shadow-none"
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  style={{ width: "70px", borderColor: "#cbd5e1" }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-light border rounded-3 fw-semibold text-secondary px-3 py-1 shadow-none"
                  disabled
                  style={{ borderColor: "#cbd5e1" }}
                >
                  <i
                    className="bi bi-chevron-left me-1"
                    style={{ fontSize: "11px" }}
                  ></i>{" "}
                  Previous
                </button>
                <button
                  className="btn btn-sm btn-light border rounded-3 fw-semibold text-secondary px-3 py-1 shadow-none"
                  disabled
                  style={{ borderColor: "#cbd5e1" }}
                >
                  Next{" "}
                  <i
                    className="bi bi-chevron-right ms-1"
                    style={{ fontSize: "11px" }}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL EDIT ROUTER (FORM LENGKAP) ================= */}
      <div
        className="modal fade"
        id="editRouterModal"
        tabIndex="-1"
        aria-labelledby="editRouterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header border-bottom pb-3 px-4 pt-4">
              <h5
                className="modal-title fw-bold text-dark fs-5"
                id="editRouterModalLabel"
              >
                Edit Router ({editFormData.id})
              </h5>
              <button
                type="button"
                className="btn-close shadow-none"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Nama Router / Identity{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3 py-2 shadow-none"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Lokasi / Sektor
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3 py-2 shadow-none"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* IP / Host */}
                  <div className="col-12 col-md-8">
                    <label className="form-label fw-semibold text-dark small">
                      IP Address / Domain VPN{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3 py-2 fw-semibold shadow-none"
                      name="ip"
                      value={editFormData.ip}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  {/* API Port */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-dark small">
                      Port API MikroTik <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm rounded-3 py-2 fw-semibold shadow-none"
                      name="apiPort"
                      value={editFormData.apiPort}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      API Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3 py-2 shadow-none"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      API Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-sm rounded-3 py-2 shadow-none"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Status Manual
                    </label>
                    <select
                      className="form-select form-select-sm rounded-3 py-2 shadow-none"
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditChange}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

                  {/* Auto Isolir Switch */}
                  <div className="col-12 mt-3">
                    <div className="form-check form-switch d-flex align-items-center gap-2 ps-0">
                      <input
                        className="form-check-input ms-0 me-2"
                        type="checkbox"
                        role="switch"
                        id="editAutoIsolir"
                        name="autoIsolir"
                        checked={editFormData.autoIsolir}
                        onChange={handleEditChange}
                        style={{
                          cursor: "pointer",
                          width: "38px",
                          height: "20px",
                        }}
                      />
                      <label
                        className="form-check-label fw-semibold text-dark small cursor-pointer"
                        htmlFor="editAutoIsolir"
                      >
                        Aktifkan Fitur Isolir Otomatis (PPPoE / Secret) untuk
                        Router ini
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top pt-3 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-light border rounded-3 fw-semibold px-3 py-2 text-secondary shadow-none"
                  data-bs-dismiss="modal"
                  style={{ fontSize: "13px" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 fw-semibold px-4 py-2 shadow-none"
                  data-bs-dismiss="modal"
                  style={{ fontSize: "13px" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ================= MODAL DELETE ROUTER ================= */}
      <div
        className="modal fade"
        id="deleteRouterModal"
        tabIndex="-1"
        aria-labelledby="deleteRouterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 rounded-4 shadow text-center p-3">
            <div className="modal-body py-2">
              <div
                className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "48px", height: "48px" }}
              >
                <i className="bi bi-trash-fill fs-5"></i>
              </div>
              <h6 className="fw-bold text-dark mb-2">Hapus Router Ini?</h6>
              <p className="text-muted small mb-0" style={{ fontSize: "13px" }}>
                Apakah Anda yakin ingin menghapus{" "}
                <strong>{selectedRouter?.id}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
              <button
                type="button"
                className="btn btn-light border rounded-3 fw-semibold w-100 py-2 text-secondary shadow-none"
                data-bs-dismiss="modal"
                style={{ fontSize: "13px" }}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-3 fw-semibold w-100 py-2 shadow-none"
                data-bs-dismiss="modal"
                onClick={handleDeleteRouter}
                style={{ fontSize: "13px" }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
