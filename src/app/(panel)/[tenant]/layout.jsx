import React from "react";
import TenantProvider from "./TenantProvider";
import DashboardClientWrapper from "./DashboardClientWrapper";

export default function PanelLayout({ children }) {
  return (
    <>
      {/* Next.js otomatis melakukan hoisting (mengangkat) tag link/script 
        di dalam TenantProvider ke tag <head> utama di root layout secara aman.
      */}
      <TenantProvider />

      {/* Karena kita tidak bisa pasang className AdminLTE di tag <body> root layout secara dinamis dari sini,
        kita bisa mengontrol sisa wrapper interaktif & useEffect di dalam client wrapper.
      */}
      <DashboardClientWrapper>
        {children}
      </DashboardClientWrapper>
    </>
  );
}