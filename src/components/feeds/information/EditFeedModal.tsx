"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedRecord } from "./FeedInventoryTable"; // Assuming this path is correct

interface EditFeedModalProps {
  feed: FeedRecord;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditFeedModal({
  feed,
  isOpen,
  onClose,
}: EditFeedModalProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for submission
  const [formData, setFormData] = useState({
    feedName: feed.feedName,
    feedType: feed.feedType,
    quantity: feed.quantity,
    dateOfOrder: feed.dateOfOrder,
    price: feed.price,
    supplier: feed.supplier,
    modeOfPayment: feed.modeOfPayment,
    paymentProof: null as File | null, // Represents a new file to be uploaded
    existingProof: feed.paymentProof, // Represents the currently stored proof name/URL
  });

  useEffect(() => {
    if (isOpen) {
      // Ensure formData is updated when the 'feed' prop changes
      setFormData({
        feedName: feed.feedName,
        feedType: feed.feedType,
        quantity: feed.quantity,
        dateOfOrder: feed.dateOfOrder,
        price: feed.price,
        supplier: feed.supplier,
        modeOfPayment: feed.modeOfPayment,
        paymentProof: null, // Reset file input when opening for a new/different feed
        existingProof: feed.paymentProof,
      });
      // Small delay to allow CSS transitions to work
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen, feed]); // Dependency on 'feed' ensures data refreshes when a new feed is selected for editing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    console.log("Updated feed:", { id: feed.id, ...formData });

    // Simulate an API call
    // In a real application, you'd send formData to your backend here
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false); // End loading
    handleClose(); // Close the modal after submission
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
    setShow(false);
    // Delay calling onClose to allow modal exit animation to complete
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    // The main container for the modal, including the backdrop effect
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // Direct background color for backdrop
      onClick={handleClose} // Clicking backdrop closes modal
    >
      {/* Modal Content */}
      <div
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on modal content from closing the modal
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Feed</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading} // Disable close button while loading
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feed Name
              </label>
              <input
                type="text"
                name="feedName"
                value={formData.feedName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable input while loading
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feed Type
              </label>
              <select
                name="feedType"
                value={formData.feedType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable select while loading
              >
                <option value="B0">B0 - Starter</option>
                <option value="B1">B1 - Grower</option>
                <option value="B2">B2 - Layer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable input while loading
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Order
              </label>
              <input
                type="date"
                name="dateOfOrder"
                value={formData.dateOfOrder}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable input while loading
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable input while loading
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable input while loading
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode of Payment
              </label>
              <select
                name="modeOfPayment"
                value={formData.modeOfPayment}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                disabled={loading} // Disable select while loading
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Proof (PDF/Image)
              </label>
              <input
                type="file"
                name="paymentProof"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb]"
                disabled={loading} // Disable input while loading
              />
              {formData.paymentProof ? (
                <p className="mt-2 text-sm text-gray-600">
                  New file: {formData.paymentProof.name}
                </p>
              ) : (
                formData.existingProof && ( // Only show if there's an existing proof and no new file selected
                  <p className="mt-2 text-sm text-gray-600">
                    Current: {formData.existingProof}
                  </p>
                )
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading} // Disable button while loading
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors flex items-center justify-center"
              disabled={loading} // Disable button while loading
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
