"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ViewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchData: {
    batchName: string;
    dateOfArrival: string;
    vaccinations: { date: string; name: string }[];
    medications: { date: string; name: string }[];
    paymentProof: string;
  } | null;
}

export default function ViewDetailModal({
  isOpen,
  onClose,
  batchData,
}: ViewDetailModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen && !show) return null;
  if (!batchData) return null;

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-xl font-semibold text-gray-900">ब्याच विवरण</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                ब्याच नाम:
              </span>
              <p className="text-base text-gray-900 font-semibold mt-1">
                {batchData.batchName}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                आगमन मिति:
              </span>
              <p className="text-base text-gray-900 font-semibold mt-1">
                {batchData.dateOfArrival}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              खोप विवरण
            </h4>
            <div className="space-y-2">
              {batchData.vaccinations.map((vacc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <span className="text-sm text-gray-900">{vacc.name}</span>
                  <span className="text-sm text-gray-600">{vacc.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              औषधि विवरण
            </h4>
            <div className="space-y-2">
              {batchData.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <span className="text-sm text-gray-900">{med.name}</span>
                  <span className="text-sm text-gray-600">{med.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <span className="text-sm font-medium text-gray-600">
              भुक्तानी प्रमाण:
            </span>
            <a
              href="#"
              className="block mt-2 text-[#1ab189] hover:text-[#158f6f] hover:underline"
            >
              {batchData.paymentProof}
            </a>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
