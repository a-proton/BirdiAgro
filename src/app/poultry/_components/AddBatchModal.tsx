"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

// 1️⃣ Define props type
interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 2️⃣ Define form data type
interface BatchFormData {
  batchName: string;
  dateOfArrival: string;
  numberOfChicks: string;
  price: string;
  supplier: string;
  paymentProof: File | null;
}

// 3️⃣ Typed component
export default function AddBatchModal({ isOpen, onClose }: AddBatchModalProps) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState<BatchFormData>({
    batchName: "",
    dateOfArrival: new Date().toISOString().split("T")[0],
    numberOfChicks: "",
    price: "",
    supplier: "",
    paymentProof: null,
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  // ✅ Add event type
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("नयाँ ब्याच:", formData);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setFormData({
        batchName: "",
        dateOfArrival: new Date().toISOString().split("T")[0],
        numberOfChicks: "",
        price: "",
        supplier: "",
        paymentProof: null,
      });
    }, 300);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            नयाँ ब्याच थप्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* All inputs remain unchanged */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ब्याचको नाम
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: ब्याच-००१"
                value={formData.batchName}
                onChange={(e) =>
                  setFormData({ ...formData, batchName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आगमन मिति
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                value={formData.dateOfArrival}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfArrival: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                कुखुराको संख्या
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: ५००"
                value={formData.numberOfChicks}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfChicks: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मूल्य
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: रु ५०,०००"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आपूर्तिकर्ता
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: नेपाल ह्याचरी प्रा. लि."
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                भुक्तानी प्रमाण (PDF/Image)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb]"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentProof: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
          </div>

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
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
            >
              ब्याच थप्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
