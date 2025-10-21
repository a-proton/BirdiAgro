"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Sale {
  id?: number;
  type?: "kukhura" | "others";
  batchName?: string;
  productName?: string;
  chickenCount?: string;
  totalKgs: string;
  pricePerKg?: string;
  totalAmount?: string;
  totalPcs?: string;
  soldTo: string;
  amountReceived: boolean;
  salesDate?: string; // 👈 make optional
}

interface ViewSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Sale | null;
}

export default function ViewSalesModal({
  isOpen,
  onClose,
  data,
}: ViewSalesModalProps) {
  const [show, setShow] = useState(false);

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
    }, 300);
  };

  if ((!isOpen && !show) || !data) return null;

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
          <h2 className="text-xl font-semibold text-gray-900">बिक्री विवरण</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {data.type === "kukhura" ? (
            <>
              <div className="bg-[#e8f8f7] px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-[#1ab189]">
                  कुखुरा बिक्री
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">ब्याच नाम</label>
                  <p className="text-base font-medium text-gray-900">
                    {data.batchName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">बिक्री मिति</label>
                  <p className="text-base font-medium text-gray-900">
                    {data.salesDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">कुखुरा संख्या</label>
                  <p className="text-base font-medium text-gray-900">
                    {data.chickenCount} वटा
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">कुल किलोग्राम</label>
                  <p className="text-base font-medium text-gray-900">
                    {data.totalKgs} कि.ग्रा
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">
                    प्रति किग्रा मूल्य
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    रु {data.pricePerKg}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">कुल रकम</label>
                  <p className="text-base font-medium text-gray-900">
                    रु {data.totalAmount}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">ग्राहकको नाम</label>
                <p className="text-base font-medium text-gray-900">
                  {data.soldTo}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">भुक्तानी स्थिति</label>
                <p
                  className={`text-base font-medium ${
                    data.amountReceived ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {data.amountReceived ? "✓ प्राप्त भएको" : "⏳ बाँकी"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  अन्य उत्पादन बिक्री
                </span>
              </div>

              <div>
                <label className="text-sm text-gray-600">उत्पादनको नाम</label>
                <p className="text-base font-medium text-gray-900">
                  {data.productName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">कुल संख्या</label>
                  <p className="text-base font-medium text-gray-900">
                    {data.totalPcs} वटा
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">कुल किलोग्राम</label>
                  <p className="text-base font-medium text-gray-900">
                    {data.totalKgs} कि.ग्रा
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">कुल रकम</label>
                <p className="text-base font-medium text-gray-900">
                  रु {data.totalAmount}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">ग्राहकको नाम</label>
                <p className="text-base font-medium text-gray-900">
                  {data.soldTo}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">भुक्तानी स्थिति</label>
                <p
                  className={`text-base font-medium ${
                    data.amountReceived ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {data.amountReceived ? "✓ प्राप्त भएको" : "⏳ बाँकी"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
