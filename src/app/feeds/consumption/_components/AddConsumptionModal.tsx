"use client";

import type React from "react";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function AddConsumptionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    batch: "",
    feedType: "B0",
    feedName: "",
    quantityUsed: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Consumption recorded:", formData);
    setShow(false);
    setTimeout(() => {
      setIsOpen(false);
      // Reset form
      setFormData({
        batch: "",
        feedType: "B0",
        feedName: "",
        quantityUsed: "",
        date: new Date().toISOString().split("T")[0],
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
        दैनिक खपत थप्नुहोस्
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
        दैनिक खपत थप्नुहोस्
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
              दैनिक खपत थप्नुहोस्
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  दानाको प्रकार
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
                  दानाको नाम
                </label>
                <input
                  type="text"
                  name="feedName"
                  value={formData.feedName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                  placeholder="उदाहरण: पोशाक"
                />
              </div>

              {/* Quantity + Unit */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    प्रयोग गरिएको मात्रा
                  </label>
                  <input
                    type="number"
                    name="quantityUsed"
                    value={formData.quantityUsed}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189]"
                    placeholder="उदाहरण: २५.५"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    इकाई
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189]"
                  >
                    <option value="किलो">किलो</option>
                    <option value="बाल्टिन">बाल्टिन</option>
                    <option value="बोरा">बोरा</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  मिति
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                />
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
                खपत रेकर्ड गर्नुहोस्
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
