"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function AddFeedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    feedName: "",
    feedType: "B0",
    quantity: "",
    dateOfOrder: "",
    price: "",
    supplier: "",
    modeOfPayment: "Bank Transfer",
    paymentProof: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShow(false);
    setTimeout(() => {
      setIsOpen(false);
      setFormData({
        feedName: "",
        feedType: "B0",
        quantity: "",
        dateOfOrder: "",
        price: "",
        supplier: "",
        modeOfPayment: "Bank Transfer",
        paymentProof: null,
      });
    }, 300);
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

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setShow(true), 10);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
      >
        <Plus className="w-4 h-4" />
        दाना थप्नुहोस्
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
      >
        <Plus className="w-4 h-4" />
        दाना थप्नुहोस्
      </button>

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
              नयाँ दाना थप्नुहोस्
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                  placeholder="दानाको नाम प्रविष्ट गर्नुहोस्"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                  placeholder="उदाहरण: १० बोरा (५०० किलो)"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                  placeholder="उदाहरण: Rs 45,000"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                  placeholder="वितरकको नाम प्रविष्ट गर्नुहोस्"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e8f8f7] file:text-[#1ab189] hover:file:bg-[#d0f0eb]"
                />
                {formData.paymentProof && (
                  <p className="mt-2 text-sm text-gray-600">
                    चयन गरिएको: {formData.paymentProof.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
              >
                दाना थप्नुहोस्
              </button>
            </div>
          </form>
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
    </>
  );
}
