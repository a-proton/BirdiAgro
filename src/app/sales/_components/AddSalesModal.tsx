"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

type Tab = "kukhura" | "others";

export default function AddSalesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("kukhura");

  // Kukhura tab state
  const [kukhuraData, setKukhuraData] = useState({
    batchName: "",
    salesDate: new Date().toISOString().split("T")[0],
    totalKgs: "",
    pricePerKg: "",
    amountReceived: false,
    soldTo: "",
  });

  // Others tab state
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
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      // Reset form on close
      setActiveTab("kukhura");
      setKukhuraData({
        batchName: "",
        salesDate: new Date().toISOString().split("T")[0],
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

  if (!isOpen && !show) return null;

  const handleKukhuraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setKukhuraData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOthersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setOthersData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-calculate total amount for Kukhura
  const kukhuraTotalAmount = (() => {
    const kgs = parseFloat(kukhuraData.totalKgs) || 0;
    const price = parseFloat(kukhuraData.pricePerKg) || 0;
    return (kgs * price).toFixed(2);
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "kukhura") {
      console.log("Kukhura Sale:", {
        ...kukhuraData,
        totalAmount: kukhuraTotalAmount,
      });
    } else {
      console.log("Other Sale:", othersData);
    }
    handleClose();
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
          <h2 className="text-xl font-semibold text-gray-900">Add New Sale</h2>
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
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "kukhura"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("kukhura")}
            >
              Kukhura
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "others"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("others")}
            >
              Others
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === "kukhura" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Batch
                </label>
                <input
                  type="text"
                  name="batchName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="e.g., Batch-001"
                  value={kukhuraData.batchName}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Date
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Kgs
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
                    Price per Kg (Rs)
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
                  Total Amount:{" "}
                  <span className="font-bold">Rs {kukhuraTotalAmount}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sold To
                </label>
                <input
                  type="text"
                  name="soldTo"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="Customer name"
                  value={kukhuraData.soldTo}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="amountReceived"
                  id="amountReceived"
                  checked={kukhuraData.amountReceived}
                  onChange={handleKukhuraChange}
                  className="h-4 w-4 text-[#1ab189] rounded"
                />
                <label
                  htmlFor="amountReceived"
                  className="ml-2 text-sm text-gray-700"
                >
                  Amount Received
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name of Product
                </label>
                <input
                  type="text"
                  name="productName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="e.g., Fresh Eggs"
                  value={othersData.productName}
                  onChange={handleOthersChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Pcs
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
                    Total Kgs
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
                  Total Amount (Rs)
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
                  Sold To
                </label>
                <input
                  type="text"
                  name="soldTo"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="Customer name"
                  value={othersData.soldTo}
                  onChange={handleOthersChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="amountReceived"
                  id="othersAmountReceived"
                  checked={othersData.amountReceived}
                  onChange={handleOthersChange}
                  className="h-4 w-4 text-[#1ab189] rounded"
                />
                <label
                  htmlFor="othersAmountReceived"
                  className="ml-2 text-sm text-gray-700"
                >
                  Amount Received
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f]"
            >
              Save Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
