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

export default function ViewExpenseModal({
  isOpen,
  onClose,
  expense,
}: {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}) {
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
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if ((!isOpen && !show) || !expense) return null;

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
          <h2 className="text-xl font-semibold text-gray-900">खर्च विवरण</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                वर्ग
              </label>
              <p className="text-base text-gray-900">
                {expense.category === "kukhura" ? "कुखुरा" : "अन्य"}
              </p>
            </div>

            {expense.category === "kukhura" && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ब्याच
                </label>
                <p className="text-base text-gray-900">{expense.batch}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                खर्चको शीर्षक
              </label>
              <p className="text-base text-gray-900">{expense.title}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                रकम
              </label>
              <p className="text-base text-gray-900 font-semibold">
                रु {expense.amount.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                मिति
              </label>
              <p className="text-base text-gray-900">{expense.date}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                भुक्तानी विधि
              </label>
              <p className="text-base text-gray-900">{expense.method}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                भुक्तानी स्थिति
              </label>
              <div className="flex items-center gap-2">
                {expense.isPaid ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    भुक्तानी भएको
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    बाँकी
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                भुक्तानी प्रमाण
              </label>
              {expense.paymentProofName ? (
                <a
                  href="#"
                  className="text-base text-[#1ab189] hover:text-[#158f6f] hover:underline"
                >
                  {expense.paymentProofName}
                </a>
              ) : (
                <p className="text-base text-gray-400">उपलब्ध छैन</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
