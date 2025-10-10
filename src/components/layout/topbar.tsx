"use client";
import { Menu, Search, User } from "lucide-react";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
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
        <h1 className="text-xl md:text-2xl font-bold">
          BirdiKhola Agro Farm - Inventory Management System
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search - hidden on mobile */}
        {/* <div className="hidden md:flex items-center bg-white/20 rounded-full px-4 py-2 focus-within:bg-white/30 transition-colors">
          <Search className="w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-white placeholder:text-white/70 w-40 lg:w-60"
          />
        </div> */}

        {/* User section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#1ab189] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <span className="hidden md:inline text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
