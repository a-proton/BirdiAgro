"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wheat,
  Bird,
  DollarSign,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Feeds", path: "/feeds", icon: Wheat },
    { name: "Kukhura", path: "/poultry", icon: Bird },
    { name: "Sales", path: "/sales", icon: DollarSign },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="pt-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-6 py-3 transition-colors border-l-4 ${
                      isActive
                        ? "bg-[#e8f8f7] border-[#1ab189] text-[#1ab189] font-semibold"
                        : "border-transparent text-gray-700 hover:bg-[#e8f8f7] hover:border-[#1ab189]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
