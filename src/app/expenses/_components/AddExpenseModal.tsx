"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { getBatchNames } from "../../../lib/api/batch";
import { createExpense } from "@/lib/api/expenses";

type Tab = "kukhura" | "others";

interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  isPaid: boolean;
  paymentProofName: string | null;
  paymentProofPath: string | null;
  batch: string;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}) {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("kukhura");
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [kukhuraData, setKukhuraData] = useState({
    batch: "",
    expenseTitle: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    isPaid: false,
    paymentProof: null as File | null,
  });

  const [othersData, setOthersData] = useState({
    expenseTitle: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    isPaid: false,
    paymentProof: null as File | null,
  });

  // Load batches when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      loadBatches();
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const loadBatches = async () => {
    setIsLoadingBatches(true);
    try {
      const batches = await getBatchNames();
      setAvailableBatches(batches);
    } catch (error) {
      console.error("Error loading batches:", error);
      alert("ब्याच लोड गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setActiveTab("kukhura");
      setKukhuraData({
        batch: "",
        expenseTitle: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        isPaid: false,
        paymentProof: null,
      });
      setOthersData({
        expenseTitle: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        isPaid: false,
        paymentProof: null,
      });
    }, 300);
  };

  const handleKukhuraChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setKukhuraData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setKukhuraData((prev) => ({ ...prev, paymentProof: files?.[0] || null }));
    } else {
      setKukhuraData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOthersChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setOthersData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setOthersData((prev) => ({ ...prev, paymentProof: files?.[0] || null }));
    } else {
      setOthersData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const expenseData = activeTab === "kukhura" ? kukhuraData : othersData;

      const newExpense = await createExpense({
        category: activeTab,
        batch: activeTab === "kukhura" ? kukhuraData.batch : undefined,
        title: expenseData.expenseTitle,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        paymentMethod:
          expenseData.paymentMethod === "cash"
            ? "नगद"
            : expenseData.paymentMethod === "bank"
            ? "बैंक ट्रान्सफर"
            : "मोबाइल वालेट",
        isPaid: expenseData.isPaid,
        paymentProof: expenseData.paymentProof,
      });

      onSave(newExpense);
      handleClose();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("खर्च सुरक्षित गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsSaving(false);
    }
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
            नयाँ खर्च थप्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "kukhura"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("kukhura")}
            >
              कुखुरा
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "others"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("others")}
            >
              अन्य
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === "kukhura" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ब्याच चयन गर्नुहोस्
                </label>
                <select
                  name="batch"
                  value={kukhuraData.batch}
                  onChange={handleKukhuraChange}
                  required
                  disabled={isLoadingBatches}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
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
                  <p className="text-sm text-red-600 mt-1">
                    कुनै ब्याच उपलब्ध छैन। पहिले ब्याच थप्नुहोस्।
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  खर्चको शीर्षक
                </label>
                <input
                  type="text"
                  name="expenseTitle"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: खानेपानी, औषधि"
                  value={kukhuraData.expenseTitle}
                  onChange={handleKukhuraChange}
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
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={kukhuraData.amount}
                  onChange={handleKukhuraChange}
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
                  value={kukhuraData.date}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भुक्तानी विधि
                </label>
                <select
                  name="paymentMethod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={kukhuraData.paymentMethod}
                  onChange={handleKukhuraChange}
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
                  id="kukhuraIsPaid"
                  checked={kukhuraData.isPaid}
                  onChange={handleKukhuraChange}
                  className="h-4 w-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
                />
                <label
                  htmlFor="kukhuraIsPaid"
                  className="ml-2 text-sm text-gray-700"
                >
                  पैसा तिरियो?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  भुक्तानी प्रमाण (PDF/Image)
                </label>
                {kukhuraData.paymentProof && (
                  <div className="mb-2 text-sm text-green-600">
                    चयन गरिएको: {kukhuraData.paymentProof.name}
                  </div>
                )}
                <input
                  type="file"
                  name="paymentProof"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb]"
                  onChange={handleKukhuraChange}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  खर्चको शीर्षक
                </label>
                <input
                  type="text"
                  name="expenseTitle"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: उपकरण, यातायात"
                  value={othersData.expenseTitle}
                  onChange={handleOthersChange}
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
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={othersData.amount}
                  onChange={handleOthersChange}
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
                  value={othersData.date}
                  onChange={handleOthersChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भुक्तानी विधि
                </label>
                <select
                  name="paymentMethod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={othersData.paymentMethod}
                  onChange={handleOthersChange}
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
                  id="othersIsPaid"
                  checked={othersData.isPaid}
                  onChange={handleOthersChange}
                  className="h-4 w-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
                />
                <label
                  htmlFor="othersIsPaid"
                  className="ml-2 text-sm text-gray-700"
                >
                  रकम भुक्तानी भएको
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  भुक्तानी प्रमाण (PDF/Image)
                </label>
                {othersData.paymentProof && (
                  <div className="mb-2 text-sm text-green-600">
                    चयन गरिएको: {othersData.paymentProof.name}
                  </div>
                )}
                <input
                  type="file"
                  name="paymentProof"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb]"
                  onChange={handleOthersChange}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoadingBatches}
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "सुरक्षित गर्दै..." : "खर्च सुरक्षित गर्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
