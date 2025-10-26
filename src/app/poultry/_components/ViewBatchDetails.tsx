"use client";
import { useState, useEffect } from "react";
import { X, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { getPoultryPublicUrl } from "@/lib/api/storage";

interface ViewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchData: {
    batchName: string;
    dateOfArrival: string;
    numberOfChicks?: number;
    price?: number;
    supplier?: string;
    vaccinations: { date: string; name: string }[];
    medications: { date: string; name: string }[];
    paymentProofName: string;
    paymentProofPath: string;
  } | null;
}

export default function ViewDetailModal({
  isOpen,
  onClose,
  batchData,
}: ViewDetailModalProps) {
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
    setTimeout(() => onClose(), 300);
  };

  const getFileType = (fileName: string | null) => {
    if (!fileName) return null;
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ext === "pdf" ? "pdf" : "image";
  };

  const handleViewFile = () => {
    if (batchData?.paymentProofPath) {
      const url = getPoultryPublicUrl(batchData.paymentProofPath);
      window.open(url, "_blank");
    }
  };

  if (!isOpen && !show) return null;
  if (!batchData) return null;

  const fileType = getFileType(batchData.paymentProofName);

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-xl font-semibold text-gray-900">ब्याच विवरण</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                ब्याच नाम:
              </span>
              <p className="text-base text-gray-900 font-semibold mt-1">
                {batchData.batchName}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                आगमन मिति:
              </span>
              <p className="text-base text-gray-900 font-semibold mt-1">
                {batchData.dateOfArrival}
              </p>
            </div>
            {batchData.numberOfChicks && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  कुखुराको संख्या:
                </span>
                <p className="text-base text-gray-900 font-semibold mt-1">
                  {batchData.numberOfChicks.toLocaleString("en-IN")}
                </p>
              </div>
            )}
            {batchData.price && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-600">
                  मूल्य:
                </span>
                <p className="text-lg text-green-700 font-bold mt-1">
                  रु {batchData.price.toLocaleString("en-IN")}
                </p>
              </div>
            )}
            {batchData.supplier && (
              <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                <span className="text-sm font-medium text-gray-600">
                  आपूर्तिकर्ता:
                </span>
                <p className="text-base text-gray-900 font-semibold mt-1">
                  {batchData.supplier}
                </p>
              </div>
            )}
          </div>

          {/* Vaccinations Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              खोप विवरण
            </h4>
            <div className="space-y-2">
              {batchData.vaccinations.length === 0 ? (
                <p className="text-sm text-gray-500 italic">खोप थपिएको छैन</p>
              ) : (
                batchData.vaccinations.map((vacc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-900">{vacc.name}</span>
                    <span className="text-sm text-gray-600">{vacc.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Medications Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              औषधि विवरण
            </h4>
            <div className="space-y-2">
              {batchData.medications.length === 0 ? (
                <p className="text-sm text-gray-500 italic">औषधि थपिएको छैन</p>
              ) : (
                batchData.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-900">{med.name}</span>
                    <span className="text-sm text-gray-600">{med.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Proof Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              भुक्तानी प्रमाण
            </h4>
            {batchData.paymentProofName && batchData.paymentProofPath ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg flex-1">
                  {fileType === "pdf" ? (
                    <FileText className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="text-sm text-gray-700 truncate">
                    {batchData.paymentProofName}
                  </span>
                </div>
                <button
                  onClick={handleViewFile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  हेर्नुहोस्
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                भुक्तानी प्रमाण उपलब्ध छैन
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
