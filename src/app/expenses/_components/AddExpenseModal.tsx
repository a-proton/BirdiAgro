"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

type Tab = "kukhura" | "others";

export default function AddExpenseModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("kukhura");

  const [kukhuraData, setKukhuraData] = useState({
    expenseTitle: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
  });

  const [othersData, setOthersData] = useState({
    expenseTitle: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
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
      setActiveTab("kukhura");
      setKukhuraData({
        expenseTitle: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
      });
      setOthersData({
        expenseTitle: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
      });
    }, 300);
  };

  const handleKukhuraChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setKukhuraData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOthersChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOthersData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "kukhura") {
      console.log("Kukhura Expense:", kukhuraData);
    } else {
      console.log("Other Expense:", othersData);
    }
    handleClose();
  };

  if (!isOpen && !show) return null;

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
            नयाँ खर्च थप्नुहोस्
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
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "kukhura"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("kukhura")}
            >
              कुखुरा
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "others"
                  ? "text-[#1ab189] border-b-2 border-[#1ab189]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("others")}
            >
              अन्य
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === "kukhura" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  खर्चको शीर्षक
                </label>
                <input
                  type="text"
                  name="expenseTitle"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: खानेपानी, औषधि"
                  value={kukhuraData.expenseTitle}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  रकम (रु)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={kukhuraData.amount}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  मिति
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={kukhuraData.date}
                  onChange={handleKukhuraChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भुक्तानी विधि
                </label>
                <select
                  name="paymentMethod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={kukhuraData.paymentMethod}
                  onChange={handleKukhuraChange}
                >
                  <option value="cash">नगद</option>
                  <option value="bank">बैंक ट्रान्सफर</option>
                  <option value="mobile">मोबाइल वालेट</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  खर्चको शीर्षक
                </label>
                <input
                  type="text"
                  name="expenseTitle"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: उपकरण, यातायात"
                  value={othersData.expenseTitle}
                  onChange={handleOthersChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  रकम (रु)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={othersData.amount}
                  onChange={handleOthersChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  मिति
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={othersData.date}
                  onChange={handleOthersChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भुक्तानी विधि
                </label>
                <select
                  name="paymentMethod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  value={othersData.paymentMethod}
                  onChange={handleOthersChange}
                >
                  <option value="cash">नगद</option>
                  <option value="bank">बैंक ट्रान्सफर</option>
                  <option value="mobile">मोबाइल वालेट</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f]"
            >
              खर्च सुरक्षित गर्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
