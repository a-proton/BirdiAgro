"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { getBatchNames } from "@/lib/api/batch";
import { Sale } from "@/lib/api/sales";

interface EditSalesModalProps {
  isOpen: boolean;
  data: Sale | null;
  onClose: () => void;
  onSave: (updatedSale: Sale) => void;
}

const EditSalesModal: React.FC<EditSalesModalProps> = ({
  isOpen,
  data,
  onClose,
  onSave,
}) => {
  const [show, setShow] = useState(false);
  const [batchNames, setBatchNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Sale>({
    id: 0,
    type: "kukhura",
    batchName: "",
    salesDate: "",
    chickenCount: "",
    totalKgs: "",
    pricePerKg: "",
    totalAmount: "",
    productName: "",
    totalPcs: "",
    soldTo: "",
    amountReceived: false,
  });

  const fetchBatchNames = useCallback(async () => {
    try {
      const names = await getBatchNames();
      if (data?.batchName && !names.includes(data.batchName)) {
        setBatchNames([data.batchName, ...names]);
      } else {
        setBatchNames(names);
      }
    } catch (err) {
      console.error("Error fetching batch names:", err);
    }
  }, [data?.batchName]);

  useEffect(() => {
    if (isOpen && data) {
      const timer = setTimeout(() => setShow(true), 10);
      fetchBatchNames();
      setFormData(data);
      setError(null);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen, data, fetchBatchNames]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setError(null);
    }, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
    setError(null);
  };

  const calculateTotal = () => {
    if (formData.type === "kukhura") {
      const kgs = parseFloat(formData.totalKgs || "0");
      const price = parseFloat(formData.pricePerKg || "0");
      return (kgs * price).toFixed(2);
    }
    return formData.totalAmount || "0";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedData = { ...formData };
      if (formData.type === "kukhura") {
        updatedData.totalAmount = calculateTotal();
      }
      await onSave(updatedData);
      handleClose();
    } catch (err) {
      console.error("Error updating sale:", err);
      setError(err instanceof Error ? err.message : "बिक्री अपडेट गर्न सकिएन");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
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
            बिक्री सम्पादन गर्नुहोस्
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-red-800">
                  त्रुटि
                </p>
                <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">
                  {error}
                </p>
              </div>
            </div>
          )}

          {formData.type === "kukhura" ? (
            <div className="space-y-4">
              <div className="bg-[#e8f8f7] px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-[#1ab189]">
                  कुखुरा बिक्री
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ब्याच नाम
                </label>
                <select
                  name="batchName"
                  value={formData.batchName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                >
                  <option value="">ब्याच चयन गर्नुहोस्</option>
                  {batchNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    बिक्री मिति
                  </label>
                  <input
                    type="date"
                    name="salesDate"
                    value={formData.salesDate || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुखुरा संख्या
                  </label>
                  <input
                    type="number"
                    name="chickenCount"
                    value={formData.chickenCount || ""}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुल किलोग्राम
                  </label>
                  <input
                    type="number"
                    name="totalKgs"
                    step="0.01"
                    value={formData.totalKgs || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    प्रति किग्रा मूल्य (रु)
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    step="0.01"
                    value={formData.pricePerKg || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  कुल रकम:{" "}
                  <span className="font-bold">रु {calculateTotal()}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ग्राहकको नाम
                </label>
                <input
                  type="text"
                  name="soldTo"
                  value={formData.soldTo || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="ग्राहकको नाम"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="amountReceived"
                  id="editAmountReceived"
                  checked={formData.amountReceived || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1ab189] rounded"
                />
                <label
                  htmlFor="editAmountReceived"
                  className="ml-2 text-sm text-gray-700"
                >
                  रकम प्राप्त भएको
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  अन्य उत्पादन बिक्री
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  उत्पादनको नाम
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: ताजा अण्डा"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुल संख्या
                  </label>
                  <input
                    type="number"
                    name="totalPcs"
                    value={formData.totalPcs || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुल किलोग्राम
                  </label>
                  <input
                    type="number"
                    name="totalKgs"
                    step="0.01"
                    value={formData.totalKgs || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  कुल रकम (रु)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  step="0.01"
                  value={formData.totalAmount || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ग्राहकको नाम
                </label>
                <input
                  type="text"
                  name="soldTo"
                  value={formData.soldTo || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="ग्राहकको नाम"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="amountReceived"
                  id="editOthersAmountReceived"
                  checked={formData.amountReceived || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1ab189] rounded"
                />
                <label
                  htmlFor="editOthersAmountReceived"
                  className="ml-2 text-sm text-gray-700"
                >
                  रकम प्राप्त भएको
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] disabled:opacity-50 transition-colors"
            >
              {loading ? "अपडेट गर्दै..." : "परिवर्तन सुरक्षित गर्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalesModal;
