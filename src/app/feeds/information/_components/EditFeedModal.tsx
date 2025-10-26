"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedRecord } from "./FeedInventoryTable";
import { updateFeedRecord } from "@/lib/api/feed";

interface EditFeedModalProps {
  feed: FeedRecord;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditFeedModal({
  feed,
  isOpen,
  onClose,
  onSuccess,
}: EditFeedModalProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    feedName: feed.feedName,
    feedType: feed.feedType,
    quantity: feed.quantity,
    dateOfOrder: feed.dateOfOrder,
    price: feed.price,
    supplier: feed.supplier,
    modeOfPayment: feed.modeOfPayment,
    paymentProof: null as File | null,
    existingProof: feed.paymentProofName,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        feedName: feed.feedName,
        feedType: feed.feedType,
        quantity: feed.quantity,
        dateOfOrder: feed.dateOfOrder,
        price: feed.price,
        supplier: feed.supplier,
        modeOfPayment: feed.modeOfPayment,
        paymentProof: null,
        existingProof: feed.paymentProofName,
      });
      setError(null);
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen, feed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateFeedRecord(feed.id, {
        feedName: formData.feedName,
        feedType: formData.feedType,
        quantity: formData.quantity,
        dateOfOrder: formData.dateOfOrder,
        price: formData.price,
        supplier: formData.supplier,
        modeOfPayment: formData.modeOfPayment,
        paymentProof: formData.paymentProof,
        oldPaymentProofPath: feed.paymentProofPath || null,
      });

      setLoading(false);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error updating feed record:", err);
      setError("दाना सम्पादन गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        paymentProof: e.target.files[0],
      });
    }
  };

  const handleClose = () => {
    if (loading) return;
    setShow(false);
    setError(null);
    setTimeout(() => onClose(), 300);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            दानाको सम्पादन गर्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                दानाको नाम
              </label>
              <input
                type="text"
                name="feedName"
                value={formData.feedName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                दाना प्रकार
              </label>
              <select
                name="feedType"
                value={formData.feedType}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              >
                <option value="B0">B0 - स्टार्टर</option>
                <option value="B1">B1 - ग्रोअर</option>
                <option value="B2">B2 - लेयर</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मात्रा
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                अर्डर मिति
              </label>
              <input
                type="date"
                name="dateOfOrder"
                value={formData.dateOfOrder}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मूल्य
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                वितरक
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                भुक्तानी प्रकार
              </label>
              <select
                name="modeOfPayment"
                value={formData.modeOfPayment}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
              >
                <option value="Bank Transfer">बैंक ट्रान्सफर</option>
                <option value="Cash">नगद</option>
                <option value="Cheque">चेक</option>
                <option value="Online Payment">अनलाइन भुक्तानी</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                भुक्तानी प्रमाण (PDF/Image)
              </label>
              <input
                type="file"
                name="paymentProof"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb] disabled:bg-gray-100"
              />
              {formData.paymentProof ? (
                <p className="mt-2 text-sm text-gray-600">
                  नयाँ फाइल: {formData.paymentProof.name}
                </p>
              ) : (
                formData.existingProof && (
                  <p className="mt-2 text-sm text-gray-600">
                    हालको: {formData.existingProof}
                  </p>
                )
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {loading ? "सेभ गर्दै..." : "परिवर्तन सेभ गर्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
