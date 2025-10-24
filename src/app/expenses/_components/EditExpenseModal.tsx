"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  isPaid: boolean;
  paymentProofName: string | null;
  batch: string;
}

export default function EditExpenseModal({
  isOpen,
  onClose,
  onSave,
  expense,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  expense: Expense | null;
}) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    batch: "",
    title: "",
    amount: "",
    date: "",
    paymentMethod: "cash",
    isPaid: false,
    paymentProof: null as File | null,
  });

  useEffect(() => {
    if (isOpen && expense) {
      setFormData({
        batch: expense.batch || "",
        title: expense.title,
        amount: expense.amount.toString(),
        date: expense.date,
        paymentMethod:
          expense.method === "नगद"
            ? "cash"
            : expense.method === "बैंक ट्रान्सफर"
            ? "bank"
            : "mobile",
        isPaid: expense.isPaid,
        paymentProof: null,
      });
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen, expense]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setFormData({
        batch: "",
        title: "",
        amount: "",
        date: "",
        paymentMethod: "cash",
        isPaid: false,
        paymentProof: null,
      });
    }, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({ ...prev, paymentProof: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    onSave({
      ...expense,
      batch: expense.category === "kukhura" ? formData.batch : "----",
      title: formData.title,
      amount: parseFloat(formData.amount),
      date: formData.date,
      method:
        formData.paymentMethod === "cash"
          ? "नगद"
          : formData.paymentMethod === "bank"
          ? "बैंक ट्रान्सफर"
          : "मोबाइल वालेट",
      isPaid: formData.isPaid,
      paymentProofName: formData.paymentProof?.name || expense.paymentProofName,
    });
    handleClose();
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
        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            खर्च सम्पादन गर्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {expense?.category === "kukhura" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ब्याच चयन गर्नुहोस्
              </label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
              >
                <option value="">ब्याच चयन गर्नुहोस्</option>
                <option value="Batch-001">ब्याच-001 (साता १-४)</option>
                <option value="Batch-002">ब्याच-002 (साता ५-८)</option>
                <option value="Batch-003">ब्याच-003 (साता ९-१२)</option>
                <option value="Batch-004">ब्याच-004 (साता १३-१६)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              खर्चको शीर्षक
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              placeholder="जस्तै: खानेपानी, औषधि"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              रकम (रु)
            </label>
            <input
              type="number"
              name="amount"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              मिति
            </label>
            <input
              type="date"
              name="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              भुक्तानी विधि
            </label>
            <select
              name="paymentMethod"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="cash">नगद</option>
              <option value="bank">बैंक ट्रान्सफर</option>
              <option value="mobile">मोबाइल वालेट</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPaid"
              id="editIsPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="h-4 w-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
            />
            <label htmlFor="editIsPaid" className="ml-2 text-sm text-gray-700">
              पैसा तिरियो?
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              भुक्तानी प्रमाण (PDF/Image)
            </label>
            {expense?.paymentProofName && (
              <div className="mb-2 text-sm text-gray-600">
                हालको फाइल: {expense.paymentProofName}
              </div>
            )}
            <input
              type="file"
              name="paymentProof"
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb]"
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f]"
            >
              परिवर्तन सुरक्षित गर्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
