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
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
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
