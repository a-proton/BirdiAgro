"use client";
import { X } from "lucide-react";

interface ViewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: { label: string; value: string }[];
}

export default function ViewDetailModal({
  isOpen,
  onClose,
  title,
  details,
}: ViewDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm font-medium text-gray-600">
                {detail.label}:
              </span>
              <span className="text-sm text-gray-900 font-semibold">
                {detail.value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
