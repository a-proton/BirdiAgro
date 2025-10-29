// ===== ViewFeedModal.tsx =====
"use client";

import { X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedRecord } from "./FeedInventoryTable";
import { getPaymentProofUrl } from "@/lib/api/storage";

interface ViewFeedModalProps {
  feed: FeedRecord;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewFeedModal({
  feed,
  isOpen,
  onClose,
}: ViewFeedModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleDownloadProof = () => {
    if (feed.paymentProofPath) {
      const url = getPaymentProofUrl(feed.paymentProofPath);
      window.open(url, "_blank");
    }
  };

  if (!isOpen) return null;

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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            दाना विवरण
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                दानाको नाम
              </label>
              <p className="text-sm sm:text-base text-gray-900 font-medium">
                {feed.feedName}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                दाना प्रकार
              </label>
              <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {feed.feedType}
              </span>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                मात्रा
              </label>
              <p className="text-sm sm:text-base text-gray-900 font-medium">
                {feed.quantity}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                अर्डर मिति
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {feed.dateOfOrder}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                मूल्य
              </label>
              <p className="text-sm sm:text-base text-gray-900 font-medium">
                {feed.price}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                वितरक
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {feed.supplier}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                भुक्तानी प्रकार
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {feed.modeOfPayment}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                भुक्तानी प्रमाण
              </label>
              {feed.paymentProofName ? (
                <button
                  onClick={handleDownloadProof}
                  className="inline-flex items-center gap-2 text-sm sm:text-base text-[#1ab189] hover:text-[#158f6f] hover:underline break-all"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{feed.paymentProofName}</span>
                </button>
              ) : (
                <p className="text-sm sm:text-base text-gray-500">उपलब्ध छैन</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              बन्द गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
