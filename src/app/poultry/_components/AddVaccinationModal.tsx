"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Props Interface
interface AddVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Form Data Interface
interface VaccinationFormData {
  batch: string;
  week: string;
  vaccinationDate: string;
}

export default function AddVaccinationModal({
  isOpen,
  onClose,
}: AddVaccinationModalProps) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState<VaccinationFormData>({
    batch: "",
    week: "",
    vaccinationDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("खोप रेकर्ड:", formData);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">खोप थप्नुहोस्</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ब्याच छान्नुहोस्
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                value={formData.batch}
                onChange={(e) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
              >
                <option value="">ब्याच छान्नुहोस्</option>
                <option value="Batch-001">ब्याच-००१</option>
                <option value="Batch-002">ब्याच-००२</option>
                <option value="Batch-003">ब्याच-००३</option>
              </select>
            </div>

            {/* Week Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                हप्ता छान्नुहोस्
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                value={formData.week}
                onChange={(e) =>
                  setFormData({ ...formData, week: e.target.value })
                }
              >
                <option value="">हप्ता छान्नुहोस्</option>
                <option value="Week-1">हप्ता १</option>
                <option value="Week-2">हप्ता २</option>
                <option value="Week-3">हप्ता ३</option>
                <option value="Week-4">हप्ता ४</option>
              </select>
            </div>

            {/* Vaccination Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खोप मिति
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                value={formData.vaccinationDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vaccinationDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              खोप थप्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
