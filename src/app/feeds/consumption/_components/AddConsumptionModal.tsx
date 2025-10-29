"use client";

import type React from "react";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createConsumptionRecord } from "@/lib/api/consumption";
import { getBatchNames } from "@/lib/api/batch";

interface AddConsumptionModalProps {
  onSuccess?: () => void;
}

export default function AddConsumptionModal({
  onSuccess,
}: AddConsumptionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    batch: "",
    feedType: "B0",
    feedName: "",
    quantityUsed: "",
    unit: "किलो",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      fetchBatches();
    }
  }, [isOpen]);

  const fetchBatches = async () => {
    try {
      const batchNames = await getBatchNames();
      setBatches(batchNames);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const quantity = parseFloat(formData.quantityUsed);
    if (isNaN(quantity) || quantity <= 0) {
      setError("कृपया मान्य मात्रा प्रविष्ट गर्नुहोस्।");
      setLoading(false);
      return;
    }

    try {
      await createConsumptionRecord({
        batch: formData.batch,
        feedType: formData.feedType,
        feedName: formData.feedName,
        quantityUsed: quantity,
        unit: formData.unit,
        consumptionDate: formData.date,
      });

      setShow(false);
      setTimeout(() => {
        setIsOpen(false);
        setFormData({
          batch: "",
          feedType: "B0",
          feedName: "",
          quantityUsed: "",
          unit: "किलो",
          date: new Date().toISOString().split("T")[0],
        });
        setLoading(false);
        if (onSuccess) onSuccess();
      }, 300);
    } catch (err) {
      console.error("Error recording consumption:", err);
      setError("खपत रेकर्ड गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।");
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

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setShow(true), 10);
  };

  const handleClose = () => {
    if (loading) return;
    setShow(false);
    setError(null);
    setTimeout(() => setIsOpen(false), 300);
  };

  // Calculate equivalent values
  const quantity = parseFloat(formData.quantityUsed) || 0;
  let equivalentKg = 0;
  let equivalentBuckets = 0;
  let equivalentSacks = 0;

  if (formData.unit === "किलो") {
    equivalentKg = quantity;
    equivalentBuckets = quantity / 12.5;
    equivalentSacks = quantity / 50;
  } else if (formData.unit === "बाल्टिन") {
    equivalentKg = quantity * 12.5;
    equivalentBuckets = quantity;
    equivalentSacks = quantity / 4;
  } else if (formData.unit === "बोरा") {
    equivalentKg = quantity * 50;
    equivalentBuckets = quantity * 4;
    equivalentSacks = quantity;
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1ab189] text-white text-sm sm:text-base rounded-lg hover:bg-[#158f6f] transition-colors"
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
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1ab189] text-white text-sm sm:text-base rounded-lg hover:bg-[#158f6f] transition-colors"
      >
        <Plus className="w-4 h-4" />
        दैनिक खपत थप्नुहोस्
      </button>

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
              दैनिक खपत थप्नुहोस्
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ब्याच चयन गर्नुहोस् *
                </label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">ब्याच चयन गर्नुहोस्</option>
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  दानाको प्रकार *
                </label>
                <select
                  name="feedType"
                  value={formData.feedType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="B0">B0 - स्टार्टर</option>
                  <option value="B1">B1 - ग्रोअर</option>
                  <option value="B2">B2 - लेयर</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  दानाको नाम *
                </label>
                <input
                  type="text"
                  name="feedName"
                  value={formData.feedName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
                  placeholder="उदाहरण: पोशाक"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  मिति *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  प्रयोग गरिएको मात्रा *
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    name="quantityUsed"
                    value={formData.quantityUsed}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="0"
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] disabled:bg-gray-100"
                    placeholder="उदाहरण: २५.५"
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full sm:w-32 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] disabled:bg-gray-100"
                  >
                    <option value="किलो">किलो</option>
                    <option value="बाल्टिन">बाल्टिन</option>
                    <option value="बोरा">बोरा</option>
                  </select>
                </div>
                {quantity > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-amber-900 font-medium mb-1">
                      समान मात्रा:
                    </p>
                    <div className="space-y-1 text-xs sm:text-sm text-amber-700">
                      <p>• {equivalentKg.toFixed(2)} किलो</p>
                      <p>• {equivalentBuckets.toFixed(2)} बाल्टिन</p>
                      <p>• {equivalentSacks.toFixed(3)} बोरा</p>
                    </div>
                    <p className="mt-2 text-xs text-amber-600">
                      यो मात्रा स्टकबाट घटाइनेछ
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors disabled:opacity-50 flex items-center justify-center"
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
                {loading ? "रेकर्ड गर्दै..." : "खपत रेकर्ड गर्नुहोस्"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
