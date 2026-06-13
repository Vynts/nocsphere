// src/app/(auth)/layout.js
import React from 'react';

export const metadata = {
  title: "NocSphere - Billing Management System for MikroTik Business",
  description: "Automated billing and network management solution for MikroTik ISP business",
};

export default function AuthRootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Bootstrap 5, FontAwesome, & Icons CDN */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Custom CSS Murni dari folder public/css */}
        <link rel="stylesheet" href="/css/public.css" />
      </head>
      
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {children}
        
        {/* Script Bootstrap JS Bundle */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  );
}