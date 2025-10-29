// app/layout.tsx
"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Inter - modern, clean, and excellent for both English and Nepali
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoginPage) {
    return (
      <html lang="ne">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="ne">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-col flex-1 lg:ml-64">
            <Topbar onMenuToggle={() => setSidebarOpen(true)} />
            <main className="flex-1 p-4 pt-20">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
