"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wheat,
  Bird,
  DollarSign,
  Settings,
  X,
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
        className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl z-50 overflow-y-auto"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4">
          {/* Logo Section */}
          <div className="flex items-center ps-2.5 mb-5">
            <div className="h-8 w-8 relative rounded-lg overflow-hidden">
              <Image
                src="/chicken icon.jpg"
                alt="Kukhura Farm Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="self-center text-xl font-semibold whitespace-nowrap ms-3 text-gray-900">
              Kukhura Farm
            </span>
          </div>

          {/* Mobile close button */}
          {!isDesktop && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}

          {/* Navigation */}
          <nav>
            <ul className="space-y-2 font-medium">
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
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-75 group ${
                          isActive || isSubmenuActive
                            ? "bg-[#e8f8f7] text-[#1ab189]"
                            : "text-gray-900 hover:bg-[#e8f8f7]"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon
                            className={`w-5 h-5 shrink-0 transition-colors duration-75 ${
                              isActive || isSubmenuActive
                                ? "text-[#1ab189]"
                                : "text-gray-500 group-hover:text-[#1ab189]"
                            }`}
                          />
                          <span className="flex-1 ms-3 whitespace-nowrap text-left">
                            {item.name}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: feedsOpen ? 90 : 0 }}
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

                      {/* Submenu animation */}
                      <AnimatePresence>
                        {feedsOpen && (
                          <motion.ul
                            key="submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
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
                                    className={`flex items-center gap-3 pl-11 pr-2 py-2 rounded-lg transition-colors group ${
                                      isSubActive
                                        ? "bg-[#d4f4ed] text-[#1ab189]"
                                        : "text-gray-600 hover:bg-[#e8f8f7] hover:text-[#1ab189]"
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
                      className={`flex items-center p-2 rounded-lg transition-all duration-75 group ${
                        isActive
                          ? "bg-[#e8f8f7] text-[#1ab189]"
                          : "text-gray-900 hover:bg-[#e8f8f7]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors duration-75 ${
                          isActive
                            ? "text-[#1ab189]"
                            : "text-gray-500 group-hover:text-[#1ab189]"
                        }`}
                      />
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        {item.name}
                      </span>
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
