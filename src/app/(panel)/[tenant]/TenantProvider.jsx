import React from "react";

export default function TenantProvider() {
  return (
    <>
      {/* Meta Tags */}
      <meta
        name="theme-color"
        content="#007bff"
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content="#1a1a1a"
        media="(prefers-color-scheme: dark)"
      />
      <meta name="supported-color-schemes" content="light dark" />

      {/* Fonts & Plugins CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/source-sans-3@5.0.12/index.css"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/styles/overlayscrollbars.min.css"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.css"
        crossOrigin="anonymous"
      />

      {/* SweetAlert2 */}
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" async></script>

      {/* CSS Lokal AdminLTE */}
      <link rel="stylesheet" href="/css/adminlte.css" />
    </>
  );
}
