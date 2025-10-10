"use client";

import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import Topbar from "@/components/layout/topbar";
import Sidebar from "@/components/layout/sidebar";
import { useState, Suspense } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="pt-16 lg:pl-64 min-h-screen bg-gray-50">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
        <Analytics />
      </Suspense>
    </>
  );
}
