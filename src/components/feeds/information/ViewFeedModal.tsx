"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedRecord } from "./FeedInventoryTable";

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
  const [loading, setLoading] = useState(false); // Added loading state for consistency, though not strictly needed here

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

  if (!isOpen) return null;

  return (
    <main>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
            show ? "scale-100" : "scale-95"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Feed Details
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading} // Disable close button while loading
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Feed Name
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {feed.feedName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Feed Type
                </label>
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {feed.feedType}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Quantity
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {feed.quantity}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Date of Order
                </label>
                <p className="text-base text-gray-900">{feed.dateOfOrder}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Price
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {feed.price}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Supplier
                </label>
                <p className="text-base text-gray-900">{feed.supplier}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Mode of Payment
                </label>
                <p className="text-base text-gray-900">{feed.modeOfPayment}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Payment Proof
                </label>
                <a
                  href="#"
                  className="text-base text-[#1ab189] hover:text-[#158f6f] hover:underline"
                >
                  {feed.paymentProof}
                </a>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading} // Disable button while loading
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            show ? "opacity-50" : "opacity-0"
          }`}
          style={{ zIndex: -1 }}
          onClick={handleClose}
        ></div>
      </div>
    </main>
  );
}
