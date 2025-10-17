"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchData: { batchName: string; dateOfArrival: string };
  onSave: (updatedData: { batchName: string; dateOfArrival: string }) => void;
}

export default function EditBatchModal({
  isOpen,
  onClose,
  batchData,
  onSave,
}: EditBatchModalProps) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState(batchData);

  useEffect(() => {
    setFormData(batchData);
  }, [batchData]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShow(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShow(false) || setTimeout(onClose, 300)}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ब्याच सम्पादन गर्नुहोस्</h2>
          <button onClick={() => setShow(false) || setTimeout(onClose, 300)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ब्याच नाम</label>
            <input
              type="text"
              value={formData.batchName}
              onChange={(e) =>
                setFormData({ ...formData, batchName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">आगमन मिति</label>
            <input
              type="date"
              value={formData.dateOfArrival}
              onChange={(e) =>
                setFormData({ ...formData, dateOfArrival: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShow(false) || setTimeout(onClose, 300)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1ab189] text-white rounded hover:bg-[#158f6f]"
            >
              सेभ गर्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
