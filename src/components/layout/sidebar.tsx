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
  ChevronDown,
  ChevronRight,
  Disc,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [feedsOpen, setFeedsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop vs mobile
  useEffect(() => {
    setMounted(true);
    setFeedsOpen(pathname.startsWith("/feeds"));

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  if (!mounted) return null;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      name: "Feeds",
      path: "/feeds",
      icon: Wheat,
      hasSubmenu: true,
      submenu: [
        { name: "Feed Information", path: "/feeds/information" },
        { name: "Feed Consumption", path: "/feeds/consumption" },
      ],
    },
    { name: "Kukhura", path: "/poultry", icon: Bird },
    { name: "Sales", path: "/sales", icon: DollarSign },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
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

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen || isDesktop ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl z-50 overflow-y-auto"
      >
        {/* Mobile close button */}
        {!isDesktop && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Navigation */}
        <nav className="pt-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const isSubmenuActive = item.submenu?.some(
                (sub) => pathname === sub.path
              );

              // Parent menu with submenu
              if (item.hasSubmenu && item.submenu) {
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => setFeedsOpen(!feedsOpen)}
                      className={`w-full flex items-center justify-between px-6 py-3 rounded-lg transition-all duration-200 border-l-4 ${
                        isActive || isSubmenuActive
                          ? "bg-[#e8f8f7] border-[#1ab189] text-[#1ab189] font-semibold"
                          : "border-transparent text-gray-700 hover:bg-[#e8f8f7] hover:border-[#1ab189]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: feedsOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>

                    {/* Submenu animation */}
                    <AnimatePresence>
                      {feedsOpen && (
                        <motion.ul
                          key="submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="bg-gray-50 overflow-hidden"
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
                                  className={`flex items-center gap-3 pl-14 pr-6 py-2.5 transition-colors border-l-4 ${
                                    isSubActive
                                      ? "bg-[#d4f4ed] border-[#1ab189] text-[#1ab189] font-medium"
                                      : "border-transparent text-gray-600 hover:bg-[#e8f8f7] hover:text-[#1ab189]"
                                  }`}
                                >
                                  <Disc className="w-2 h-2 fill-current" />
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

              // Single menu item
              return (
                <motion.li
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 border-l-4 ${
                      isActive
                        ? "bg-[#e8f8f7] border-[#1ab189] text-[#1ab189] font-semibold"
                        : "border-transparent text-gray-700 hover:bg-[#e8f8f7] hover:border-[#1ab189]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
}
