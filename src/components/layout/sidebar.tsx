"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
interface MenuItem {
  name: string;
  path: string;
  icon: string;
  hasSubmenu?: boolean;
  submenu?: { name: string; path: string; icon?: string }[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newOpenSubmenus: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.hasSubmenu && item.submenu) {
        const isActive = item.submenu.some((sub) => pathname === sub.path);
        if (isActive) newOpenSubmenus[item.path] = true;
      }
    });
    setOpenSubmenus(newOpenSubmenus);
  }, [pathname]);

  const toggleSubmenu = (path: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const menuItems: MenuItem[] = [
    { name: "ड्यासबोर्ड", path: "/dashboard", icon: "/icons/dashboard.png" },
    {
      name: "खाद्य",
      path: "/feeds",
      icon: "/icons/feeds.png",
      hasSubmenu: true,
      submenu: [
        { name: "खाद्य जानकारी", path: "/feeds/information" },
        { name: "खाद्य खपत", path: "/feeds/consumption" },
      ],
    },
    { name: "कुखुरा", path: "/poultry", icon: "/icons/chicken.jpg" },
    { name: "बिक्री", path: "/sales", icon: "/icons/sales.png" },
    { name: "सेटिङ्स", path: "/settings", icon: "/icons/settings.png" },
    { name: "खर्च", path: "/expenses", icon: "/icons/expenses.png" },
    { name: "प्रतिवेदन", path: "/reports", icon: "/icons/reports.png" },
  ];

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen || isDesktop ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl z-50 overflow-y-auto"
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-5">
          {/* Logo with image */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src="/icons/chicken.jpg"
                alt="Kukhura Farm Logo"
                width={32}
                height={32}
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none"; // hide if broken
                }}
              />
            </div>
            <span className="text-xl font-bold text-gray-900 ms-3">
              Kukhura Farm
            </span>
          </div>

          {!isDesktop && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}

          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const isSubmenuActive = item.submenu?.some(
                  (sub) => pathname === sub.path
                );
                const isExpanded = openSubmenus[item.path] || false;

                if (item.hasSubmenu && item.submenu) {
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => toggleSubmenu(item.path)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                          isActive || isSubmenuActive
                            ? "bg-[#e8f8f7] text-[#1ab189] font-medium"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <Image
                            src={item.icon}
                            alt=""
                            width={20}
                            height={20}
                            className={`me-3 opacity-60 ${
                              isActive || isSubmenuActive
                                ? "opacity-100"
                                : "group-hover:opacity-100"
                            }`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.opacity =
                                "0";
                            }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight
                            className={`w-4 h-4 ${
                              isActive || isSubmenuActive
                                ? "text-[#1ab189]"
                                : "text-gray-500"
                            }`}
                          />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            key="submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden space-y-1 mt-1"
                          >
                            {item.submenu.map((subItem) => {
                              const isSubActive = pathname === subItem.path;
                              return (
                                <motion.li
                                  key={subItem.path}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    href={subItem.path}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                      isSubActive
                                        ? "bg-[#d4f4ed] text-[#1ab189]"
                                        : "text-gray-600 hover:bg-[#e8f8f7] hover:text-[#1ab189]"
                                    }`}
                                  >
                                    <Image
                                      src="/icons/disc.png"
                                      alt=""
                                      width={8}
                                      height={8}
                                      className="opacity-60"
                                    />
                                    <span className="text-sm">
                                      {subItem.name}
                                    </span>
                                  </Link>
                                </motion.li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <motion.li
                    key={item.path}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={item.path}
                      onClick={onClose}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#e8f8f7] text-[#1ab189] font-medium"
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={20}
                        height={20}
                        className={`me-3 opacity-60 ${
                          isActive ? "opacity-100" : "group-hover:opacity-100"
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0";
                        }}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
