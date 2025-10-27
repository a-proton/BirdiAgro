"use client";

import { Menu, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1ab189] text-white shadow-md z-50 flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* User section */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#1ab189] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">{user?.name || "User"}</div>
              <div className="text-xs opacity-90">
                {user?.role === "Admin" ? "व्यवस्थापक" : "स्टाफ"}
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 text-gray-800">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-600">{user?.email}</div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user?.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user?.role === "Admin" ? "व्यवस्थापक" : "स्टाफ"}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                लगआउट गर्नुहोस्
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
