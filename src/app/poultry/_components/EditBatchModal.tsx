"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateBatch } from "@/lib/api/batch";

interface Vaccination {
  date: string;
  name: string;
}

interface Medication {
  date: string;
  name: string;
}

interface BatchData {
  id: number;
  batchName: string;
  dateOfArrival: string;
  numberOfChicks?: number;
  price?: number;
  supplier?: string;
  vaccinations: Vaccination[];
  medications: Medication[];
  paymentProofName: string;
  paymentProofPath: string;
}

interface EditBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchData: BatchData | null;
  onSave: () => void;
}

export default function EditBatchModal({
  isOpen,
  onClose,
  batchData,
  onSave,
}: EditBatchModalProps) {
  const [show, setShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    batchName: "",
    dateOfArrival: "",
    numberOfChicks: "",
    price: "",
    supplier: "",
    paymentProof: null as File | null,
  });

  // Load existing batch data into form
  useEffect(() => {
    if (batchData) {
      setFormData({
        batchName: batchData.batchName,
        dateOfArrival: batchData.dateOfArrival,
        numberOfChicks: batchData.numberOfChicks?.toString() || "",
        price: batchData.price?.toString() || "",
        supplier: batchData.supplier || "",
        paymentProof: null,
      });
    }
  }, [batchData]);

  // Handle modal open/close animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  // Save data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!batchData || !formData.batchName || !formData.dateOfArrival) {
      return;
    }

    setIsSaving(true);

    try {
      await updateBatch(batchData.id, {
        batchName: formData.batchName,
        dateOfArrival: formData.dateOfArrival,
        numberOfChicks: formData.numberOfChicks
          ? parseInt(formData.numberOfChicks, 10)
          : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        supplier: formData.supplier || undefined,
        paymentProof: formData.paymentProof,
        oldPaymentProofPath: batchData.paymentProofPath || null,
      });

      alert("ब्याच सफलतापूर्वक अद्यावधिक गरियो!");
      onSave();
      handleClose();
    } catch (error) {
      console.error("Error updating batch:", error);
      alert("ब्याच अद्यावधिक गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsSaving(false);
    }
  };

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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            ब्याच सम्पादन गर्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ब्याचको नाम <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.batchName}
                onChange={(e) =>
                  setFormData({ ...formData, batchName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: ब्याच-००१"
                required
                disabled={isSaving}
              />
            </div>

            {/* Date of Arrival */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आगमन मिति <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfArrival}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfArrival: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                required
                disabled={isSaving}
              />
            </div>

            {/* Number of Chicks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                कुखुराको संख्या
              </label>
              <input
                type="number"
                min="1"
                value={formData.numberOfChicks}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfChicks: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: ५००"
                disabled={isSaving}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मूल्य (रु)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: ५०,०००"
                disabled={isSaving}
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आपूर्तिकर्ता
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                placeholder="उदाहरण: नेपाल ह्याचरी प्रा. लि."
                disabled={isSaving}
              />
            </div>

            {/* Payment Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                भुक्तानी प्रमाण (PDF/Image)
              </label>
              {batchData.paymentProofName && !formData.paymentProof && (
                <div className="mb-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                  वर्तमान फाइल: <strong>{batchData.paymentProofName}</strong>
                </div>
              )}
              {formData.paymentProof && (
                <div className="mb-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  नयाँ फाइल चयन गरिएको:{" "}
                  <strong>{formData.paymentProof.name}</strong>
                </div>
              )}
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
                disabled={isSaving}
              />
              {formData.paymentProof && (
                <p className="mt-1 text-xs text-gray-500">
                  नयाँ फाइल चयन गर्दा पुरानो फाइल स्वतः हट्नेछ
                </p>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>नोट:</strong> खोप र औषधिको विवरण सम्पादन गर्न सकिदैन।
              तिनीहरूलाई छुट्टै थप्नुहोस् वा हटाउनुहोस्।
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "सेभ गर्दै..." : "सेभ गर्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
