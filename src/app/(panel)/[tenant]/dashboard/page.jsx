import React from "react";

const DashboardOverview = () => {
  return (
    <main className="app-main">
      {/*-begin::App Content Header-*/}
      <div className="app-content-header">
        {/*-begin::Container-*/}
        <div className="container-fluid">
          {/*-begin::Row-*/}
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0 fw-bold">Dashboard Overview</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dashboard
                </li>
              </ol>
            </div>
          </div>
          {/*-end::Row-*/}
        </div>
        {/*-end::Container-*/}
      </div>

      <div className="app-content">
        {/*-begin::Container-*/}
        <div className="container-fluid">
          <div className="sc-sync-card my-4">
            <div className="sc-sync-watermark">
              <i className="bi bi-hdd"></i>
            </div>

            <div className="sc-sync-content">
              <div className="sc-sync-text">
                <h6 className="sc-sync-title">Router Data Synchronization</h6>
                <p className="sc-sync-desc">
                  Sinkronisasi data yang ada di router secara real-time untuk
                  memastikan konfigurasi jaringan tetap up-to-date.
                </p>
              </div>

              <div className="sc-sync-action">
                <a href="#" className="sc-sync-btn">
                  <span>Asinkron</span>
                  <i className="bi bi-arrow-right-short"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Info boxes */}
          <div className="row">
            <div className="col-12 col-sm-6 col-md-3 my-2">
              <div className="info-box">
                <span className="info-box-icon text-bg-primary shadow-sm">
                  <i className="bi bi-people"></i>
                </span>

                <div className="info-box-content">
                  <span className="info-box-text fw-bold">Total Customer</span>
                  <span className="info-box-number">
                    10
                    <small>%</small>
                  </span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}

            <div className="col-12 col-sm-6 col-md-3 my-2">
              <div className="info-box">
                <span className="info-box-icon text-bg-danger shadow-sm">
                  <i className="bi bi-people"></i>
                </span>

                <div className="info-box-content">
                  <span className="info-box-text fw-bold">Pending Invoice</span>
                  <span className="info-box-number">41s</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}

            {/* fix for small devices only */}
            {/* <div className="clearfix hidden-md-up"></div> */}

            <div className="col-12 col-sm-6 col-md-3 my-2">
              <div className="info-box">
                <span className="info-box-icon text-bg-success shadow-sm">
                  <i className="bi bi-wallet2"></i>
                </span>

                <div className="info-box-content">
                  <span className="info-box-text fw-bold">Monthly Income</span>
                  <span className="info-box-number">760</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}

            <div className="col-12 col-sm-6 col-md-3 my-2">
              <div className="info-box">
                <span className="info-box-icon text-bg-primary shadow-sm">
                  <i className="bi bi-person-check"></i>
                </span>

                <div className="info-box-content">
                  <span className="info-box-text fw-bold">Users Online</span>
                  <span className="info-box-number">2,000</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}

          {/*-begin::Row-*/}
          <div className="card my-2">
            <div className="card-header d-flex flex-wrap gap-2 align-items-center">
              <h3 className="card-title mb-0 me-auto fw-bold">
                Data Invoice Terbaru
              </h3>
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
                  placeholder="Cari Invoice.."
                  aria-label="Search projects"
                />
              </div>
              <select
                className="form-select form-select-sm"
                style={{ width: "10rem" }}
                aria-label="Filter by status"
                defaultValue=""
              >
                <option value="">Semua Status</option>
                <option>Sudah Bayar</option>
                <option>Belum Bayar</option>
                <option>Batal</option>
              </select>
              <button className="btn btn-primary btn-sm" type="button">
                Detail
                <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>#</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>No Invoice</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>Customer</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>Paket</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>Harga</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>Tanggal</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th
                        className="sortable"
                        data-column="invoice"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center justify-content-start">
                          <span>Status</span>
                          <span className="sort-icons">
                            <i className="bi bi-caret-up-fill"></i>
                            <i className="bi bi-caret-down-fill"></i>
                          </span>
                        </div>
                      </th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span>1</span>
                      </td>
                      <td>
                        <span className="badge text-bg-success">
                          {" "}
                          INV-8013801012{" "}
                        </span>
                      </td>
                      <td style={{ minWidth: "8rem" }}>Agung Sumberagung</td>
                      <td>
                        <span>Paket 10MB</span>
                      </td>
                      <td className="text-nowrap">Rp. 150.000</td>
                      <td className="text-nowrap">Jun 14, 2026</td>
                      <td>
                        <span className="badge text-bg-danger">
                          {" "}
                          Belum bayar{" "}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-success"
                            type="button"
                            title="View"
                          >
                            <i className="bi bi-eye" aria-hidden="true"></i>
                          </button>
                          <button
                            className="btn btn-primary"
                            type="button"
                            title="Edit"
                          >
                            <i className="bi bi-pencil" aria-hidden="true"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            type="button"
                            title="More"
                          >
                            <i
                              className="bi bi-three-dots-vertical"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3">
              <small className="text-secondary"> Showing 6 of 6 </small>
              <nav aria-label="Pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <a className="page-link" href="#">
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
          {/*-end::Row-*/}
        </div>
        {/*-end::Container-*/}
      </div>
      {/*-end::App Content-*/}
    </main>
  );
};

export default DashboardOverview;
