"use client";

import { X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getBatchNames } from "@/lib/api/batch";
import { Sale } from "@/lib/api/sales";

interface EditSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  data: Sale | null;
}

export default function EditSalesModal({
  isOpen,
  onClose,
  onSave,
  data,
}: EditSalesModalProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchNames, setBatchNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [kukhuraData, setKukhuraData] = useState({
    batchName: "",
    salesDate: "",
    chickenCount: "",
    totalKgs: "",
    pricePerKg: "",
    amountReceived: false,
    soldTo: "",
  });

  const [othersData, setOthersData] = useState({
    productName: "",
    totalPcs: "",
    totalKgs: "",
    totalAmount: "",
    amountReceived: false,
    soldTo: "",
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      fetchBatchNames();
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const fetchBatchNames = async () => {
    try {
      const names = await getBatchNames();
      // Add current batch name if it's not in the list (for editing existing sales)
      if (data?.batchName && !names.includes(data.batchName)) {
        setBatchNames([data.batchName, ...names]);
      } else {
        setBatchNames(names);
      }
    } catch (err) {
      console.error("Error fetching batch names:", err);
    }
  };

  useEffect(() => {
    if (data && isOpen) {
      if (data.type === "kukhura") {
        setKukhuraData({
          batchName: data.batchName || "",
          salesDate: data.salesDate || "",
          chickenCount: data.chickenCount || "",
          totalKgs: data.totalKgs || "",
          pricePerKg: data.pricePerKg || "",
          amountReceived: data.amountReceived || false,
          soldTo: data.soldTo || "",
        });
      } else {
        setOthersData({
          productName: data.productName || "",
          totalPcs: data.totalPcs || "",
          totalKgs: data.totalKgs || "",
          totalAmount: data.totalAmount || "",
          amountReceived: data.amountReceived || false,
          soldTo: data.soldTo || "",
        });
      }
    }
  }, [data, isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setError(null);
      setKukhuraData({
        batchName: "",
        salesDate: "",
        chickenCount: "",
        totalKgs: "",
        pricePerKg: "",
        amountReceived: false,
        soldTo: "",
      });
      setOthersData({
        productName: "",
        totalPcs: "",
        totalKgs: "",
        totalAmount: "",
        amountReceived: false,
        soldTo: "",
      });
    }, 300);
  };

  if ((!isOpen && !show) || !data) return null;

  const handleKukhuraChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setKukhuraData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleOthersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setOthersData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const kukhuraTotalAmount = (() => {
    const kgs = parseFloat(kukhuraData.totalKgs) || 0;
    const price = parseFloat(kukhuraData.pricePerKg) || 0;
    return (kgs * price).toFixed(2);
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (data.type === "kukhura") {
        await onSave({
          ...kukhuraData,
          type: "kukhura",
          totalAmount: kukhuraTotalAmount,
          id: data.id,
        });
      } else {
        await onSave({
          ...othersData,
          type: "others",
          id: data.id,
        });
      }
      handleClose();
    } catch (err) {
      console.error("Error updating sale:", err);
      setError(err instanceof Error ? err.message : "बिक्री अपडेट गर्न सकिएन");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-xl font-semibold text-gray-900">
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

        <div className="border-b border-gray-200">
          <div className="flex">
            <div
              className={`px-6 py-3 font-medium text-sm ${
                data.type === "kukhura"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-400"
              }`}
            >
              {data.type === "kukhura" ? "कुखुरा" : "अन्य"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">त्रुटि</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {data.type === "kukhura" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ब्याच चयन गर्नुहोस्
                </label>
                <select
                  name="batchName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={kukhuraData.batchName}
                  onChange={handleKukhuraChange}
                >
                  <option value="">ब्याच चयन गर्नुहोस्</option>
                  {batchNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    बिक्री मिति
                  </label>
                  <input
                    type="date"
                    name="salesDate"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                    value={kukhuraData.salesDate}
                    onChange={handleKukhuraChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुखुरा संख्या
                  </label>
                  <input
                    type="number"
                    name="chickenCount"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                    value={kukhuraData.chickenCount}
                    onChange={handleKukhuraChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुल किलोग्राम
                  </label>
                  <input
                    type="number"
                    name="totalKgs"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                    value={kukhuraData.totalKgs}
                    onChange={handleKukhuraChange}
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                    value={kukhuraData.pricePerKg}
                    onChange={handleKukhuraChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  कुल रकम:{" "}
                  <span className="font-bold">रु {kukhuraTotalAmount}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ग्राहकको नाम
                </label>
                <input
                  type="text"
                  name="soldTo"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="ग्राहकको नाम"
                  value={kukhuraData.soldTo}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="amountReceived"
                  id="editAmountReceived"
                  checked={kukhuraData.amountReceived}
                  onChange={handleKukhuraChange}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  उत्पादनको नाम
                </label>
                <input
                  type="text"
                  name="productName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: ताजा अण्डा"
                  value={othersData.productName}
                  onChange={handleOthersChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    कुल संख्या
                  </label>
                  <input
                    type="number"
                    name="totalPcs"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                    value={othersData.totalPcs}
                    onChange={handleOthersChange}
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                    value={othersData.totalKgs}
                    onChange={handleOthersChange}
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={othersData.totalAmount}
                  onChange={handleOthersChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ग्राहकको नाम
                </label>
                <input
                  type="text"
                  name="soldTo"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="ग्राहकको नाम"
                  value={othersData.soldTo}
                  onChange={handleOthersChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="amountReceived"
                  id="editOthersAmountReceived"
                  checked={othersData.amountReceived}
                  onChange={handleOthersChange}
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
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors disabled:opacity-50"
            >
              {loading ? "अपडेट गर्दै..." : "अपडेट गर्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
