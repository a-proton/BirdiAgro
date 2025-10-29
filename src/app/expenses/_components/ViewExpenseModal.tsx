"use client";

import { X, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getPublicUrl } from "@/lib/api/storage";

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

  const getFileType = (fileName: string | null) => {
    if (!fileName) return null;
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ext === "pdf" ? "pdf" : "image";
  };

  const handleViewFile = () => {
    if (expense?.paymentProofPath) {
      const url = getPublicUrl(expense.paymentProofPath);
      window.open(url, "_blank");
    }
  };

  if ((!isOpen && !show) || !expense) return null;

  const fileType = getFileType(expense.paymentProofName);

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
            खर्च विवरण
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                वर्ग
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {expense.category === "kukhura" ? "कुखुरा" : "अन्य"}
              </p>
            </div>

            {expense.category === "kukhura" && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  ब्याच
                </label>
                <p className="text-sm sm:text-base text-gray-900 break-words">
                  {expense.batch}
                </p>
              </div>
            )}

            <div
              className={expense.category !== "kukhura" ? "sm:col-span-2" : ""}
            >
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                खर्चको शीर्षक
              </label>
              <p className="text-sm sm:text-base text-gray-900 break-words">
                {expense.title}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                रकम
              </label>
              <p className="text-sm sm:text-base text-gray-900 font-semibold">
                रु {expense.amount.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                मिति
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {expense.date}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                भुक्तानी विधि
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {expense.method}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                भुक्तानी स्थिति
              </label>
              <div className="flex items-center gap-2">
                {expense.isPaid ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                    भुक्तानी भएको
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                    बाँकी
                  </span>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                भुक्तानी प्रमाण
              </label>
              {expense.paymentProofName && expense.paymentProofPath ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 rounded-lg flex-1 w-full sm:w-auto min-w-0">
                    {fileType === "pdf" ? (
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm text-gray-700 truncate">
                      {expense.paymentProofName}
                    </span>
                  </div>
                  <button
                    onClick={handleViewFile}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1ab189] text-white text-xs sm:text-sm rounded-lg hover:bg-[#158f6f] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    हेर्नुहोस्
                  </button>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-400">उपलब्ध छैन</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 sm:p-6 pt-0 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
