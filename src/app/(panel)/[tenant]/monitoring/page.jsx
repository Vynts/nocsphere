import React from "react";

export default function MonitoringPage() {
  return (
    <main className="app-main">
      {/* --- begin::App Content Header --- */}
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0 fw-bold">Monitoring</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Monitoring
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* --- end::App Content Header --- */}

      {/* --- begin::App Content --- */}
      <div className="app-content">
        <div className="container-fluid">
          {/* --- begin::Card Tabel Konten --- */}
          <div className="card my-2 shadow-sm">
            {/* Header Tabel */}
            <div className="card-header d-flex flex-wrap gap-2 align-items-center">
              <h3 className="card-title mb-0 me-auto fw-bold">Router</h3>

              {/* Search Bar */}
              <div
                className="input-group input-group-sm"
                style={{ width: "16rem" }}
              >
                <span className="input-group-text">
                  <i className="bi bi-search" aria-hidden="true"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Cari Router.."
                  aria-label="Search projects"
                />
              </div>

              {/* Tombol Refresh */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                type="button"
              >
                <i className="bi bi-arrow-clockwise"></i>
                Refresh
              </button>
            </div>

            {/* Isi Tabel Utama */}
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="sortable" style={{ cursor: "pointer" }}>
                        <div className="d-flex align-items-center justify-content-start gap-1">
                          <span>#</span>
                          <span
                            className="sort-icons d-inline-flex flex-column text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-caret-up-fill lh-1"></i>
                            <i className="bi bi-caret-down-fill lh-1"></i>
                          </span>
                        </div>
                      </th>
                      <th className="sortable" style={{ cursor: "pointer" }}>
                        <div className="d-flex align-items-center justify-content-start gap-1">
                          <span>Router</span>
                          <span
                            className="sort-icons d-inline-flex flex-column text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-caret-up-fill lh-1"></i>
                            <i className="bi bi-caret-down-fill lh-1"></i>
                          </span>
                        </div>
                      </th>
                      <th className="sortable" style={{ cursor: "pointer" }}>
                        <div className="d-flex align-items-center justify-content-start gap-1">
                          <span>CPU Load</span>
                          <span
                            className="sort-icons d-inline-flex flex-column text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-caret-up-fill lh-1"></i>
                            <i className="bi bi-caret-down-fill lh-1"></i>
                          </span>
                        </div>
                      </th>
                      <th className="sortable" style={{ cursor: "pointer" }}>
                        <div className="d-flex align-items-center justify-content-start gap-1">
                          <span>Memory</span>
                          <span
                            className="sort-icons d-inline-flex flex-column text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-caret-up-fill lh-1"></i>
                            <i className="bi bi-caret-down-fill lh-1"></i>
                          </span>
                        </div>
                      </th>
                      <th className="sortable" style={{ cursor: "pointer" }}>
                        <div className="d-flex align-items-center justify-content-start gap-1">
                          <span>Uptime</span>
                          <span
                            className="sort-icons d-inline-flex flex-column text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-caret-up-fill lh-1"></i>
                            <i className="bi bi-caret-down-fill lh-1"></i>
                          </span>
                        </div>
                      </th>
                      <th className="sortable" style={{ cursor: "pointer" }}>
                        <div className="d-flex align-items-center justify-content-start gap-1">
                          <span>Status</span>
                          <span
                            className="sort-icons d-inline-flex flex-column text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <i className="bi bi-caret-up-fill lh-1"></i>
                            <i className="bi bi-caret-down-fill lh-1"></i>
                          </span>
                        </div>
                      </th>
                      <th className="text-end px-3">
                        <span>Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Baris Data Router 1 */}
                    <tr>
                      <td className="px-3">
                        <span>1</span>
                      </td>
                      <td>
                        <span className="fw-semibold">Router Metro</span>
                      </td>
                      <td style={{ minWidth: "8rem" }}>
                        <div className="d-flex align-items-center gap-2">
                          <span>80%</span>
                          <div
                            className="progress w-100"
                            style={{ height: "6px" }}
                          >
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{ width: "80%" }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span>400M</span>
                      </td>
                      <td className="text-nowrap">16:00:00</td>
                      <td>
                        <span className="badge text-bg-success bg-opacity-10 text-success border border-success border-opacity-20 d-inline-flex align-items-center gap-1 py-1 px-2.5">
                          <span
                            className="rounded-circle bg-success"
                            style={{ width: "6px", height: "6px" }}
                          ></span>
                          Online
                        </span>
                      </td>
                      <td className="text-end px-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          type="button"
                          title="View Details"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Card / Bagian Paginasi */}
            <div className="card-footer d-flex align-items-center bg-transparent border-top p-3">
              {/* Teks informasi page dipaksa ke kiri penuh */}
              <div className="me-auto">
                <small className="text-secondary">Showing 6 of 6</small>
              </div>

              {/* Navigasi paginasi dipaksa ke kanan penuh */}
              <div className="ms-auto">
                <nav aria-label="Pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex="-1">
                        Previous
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item disabled">
                      <a className="page-link" href="#">
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          {/* --- end::Card Tabel Konten --- */}
        </div>
      </div>
      {/* --- end::App Content --- */}
    </main>
  );
}
