"use client";

import { X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getBatchNames } from "../../../lib/api/batch";
import type { Expense } from "@/lib/api/expenses";

export default function EditExpenseModal({
  isOpen,
  onClose,
  onSave,
  expense,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: number,
    data: {
      category?: string;
      batch?: string;
      title?: string;
      amount?: number;
      date?: string;
      paymentMethod?: string;
      isPaid?: boolean;
      paymentProof?: File | null;
      oldPaymentProofPath?: string | null;
    }
  ) => Promise<void>;
  expense: Expense | null;
}) {
  const [show, setShow] = useState(false);
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        batch: expense.batch && expense.batch !== "----" ? expense.batch : "",
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

      if (expense.category === "kukhura") {
        loadBatches();
      }

      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen, expense]);

  const loadBatches = async () => {
    setIsLoadingBatches(true);
    try {
      const batches = await getBatchNames();
      setAvailableBatches(batches);
    } catch (error) {
      console.error("Error loading batches:", error);
      setError("ब्याच लोड गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;

    setShow(false);
    setTimeout(() => {
      onClose();
      setError(null);
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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "paymentMethod" && value === "cash"
          ? { paymentProof: null }
          : {}),
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    if (expense.category === "kukhura" && !formData.batch) {
      setError("कृपया ब्याच चयन गर्नुहोस्।");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData: {
        category: string;
        title: string;
        amount: number;
        date: string;
        paymentMethod: string;
        isPaid: boolean;
        paymentProof: File | null;
        oldPaymentProofPath: string | null;
        batch?: string;
      } = {
        category: expense.category,
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date,
        paymentMethod:
          formData.paymentMethod === "cash"
            ? "नगद"
            : formData.paymentMethod === "bank"
            ? "बैंक ट्रान्सफर"
            : "मोबाइल वालेट",
        isPaid: formData.isPaid,
        paymentProof:
          formData.paymentMethod !== "cash" ? formData.paymentProof : null,
        oldPaymentProofPath: expense.paymentProofPath,
      };

      if (expense.category === "kukhura") {
        updateData.batch = formData.batch;
      }

      await onSave(expense.id, updateData);
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
      setShow(false);
    } catch (error) {
      console.error("Error updating expense:", error);
      setError("खर्च अपडेट गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const showPaymentProof = formData.paymentMethod !== "cash";

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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            खर्च सम्पादन गर्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-red-800">
                  त्रुटि
                </p>
                <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">
                  {error}
                </p>
              </div>
            </div>
          )}

          {expense?.category === "kukhura" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ब्याच चयन गर्नुहोस् <span className="text-red-500">*</span>
              </label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                disabled={isLoadingBatches || isSaving}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {isLoadingBatches ? "लोड हुँदैछ..." : "ब्याच चयन गर्नुहोस्"}
                </option>
                {availableBatches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
              {!isLoadingBatches && availableBatches.length === 0 && (
                <p className="text-xs text-red-600 mt-1">
                  कुनै ब्याच उपलब्ध छैन। पहिले ब्याच थप्नुहोस्।
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              खर्चको शीर्षक <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              disabled={isSaving}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] disabled:bg-gray-100"
              placeholder="जस्तै: खानेपानी, औषधि"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              रकम (रु) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              required
              min="0"
              step="0.01"
              disabled={isSaving}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] disabled:bg-gray-100"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              मिति <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              required
              disabled={isSaving}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] disabled:bg-gray-100"
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
              disabled={isSaving}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] disabled:bg-gray-100"
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
              disabled={isSaving}
              className="h-4 w-4 text-[#1ab189] rounded focus:ring-[#1ab189] disabled:opacity-50"
            />
            <label htmlFor="editIsPaid" className="ml-2 text-sm text-gray-700">
              पैसा तिरियो?
            </label>
          </div>

          {showPaymentProof && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                भुक्तानी प्रमाण (PDF/Image)
              </label>
              {expense?.paymentProofName && !formData.paymentProof && (
                <div className="mb-2 text-xs sm:text-sm text-gray-600 bg-blue-50 p-2 rounded break-words">
                  हालको फाइल: <strong>{expense.paymentProofName}</strong>
                </div>
              )}
              {formData.paymentProof && (
                <div className="mb-2 text-xs sm:text-sm text-green-600 bg-green-50 p-2 rounded break-words">
                  नयाँ फाइल चयन गरिएको:{" "}
                  <strong>{formData.paymentProof.name}</strong>
                </div>
              )}
              <input
                type="file"
                name="paymentProof"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isSaving}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb] disabled:opacity-50"
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                नयाँ फाइल चयन गर्दा पुरानो फाइल स्वतः हट्नेछ
              </p>
            </div>
          )}

          {!showPaymentProof && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-yellow-800">
                नगद भुक्तानीको लागि प्रमाण आवश्यक छैन
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoadingBatches}
              className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "सुरक्षित गर्दै..." : "परिवर्तन सुरक्षित गर्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
