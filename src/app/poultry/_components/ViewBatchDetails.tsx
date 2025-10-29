"use client";
import { useState, useEffect } from "react";
import { X, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { getPoultryPublicUrl, getMedicationImageUrl } from "@/lib/api/storage";

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
    medications: {
      date: string;
      name: string;
      imageName?: string;
      imagePath?: string;
    }[];
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

  const handleViewMedicationImage = (imagePath: string) => {
    const url = getMedicationImageUrl(imagePath);
    window.open(url, "_blank");
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
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            ब्याच विवरण
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                ब्याच नाम:
              </span>
              <p className="text-sm sm:text-base text-gray-900 font-semibold mt-1">
                {batchData.batchName}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                आगमन मिति:
              </span>
              <p className="text-sm sm:text-base text-gray-900 font-semibold mt-1">
                {batchData.dateOfArrival}
              </p>
            </div>
            {batchData.numberOfChicks && (
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  कुखुराको संख्या:
                </span>
                <p className="text-sm sm:text-base text-gray-900 font-semibold mt-1">
                  {batchData.numberOfChicks.toLocaleString("en-IN")}
                </p>
              </div>
            )}
            {batchData.price && (
              <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  मूल्य:
                </span>
                <p className="text-base sm:text-lg text-green-700 font-bold mt-1">
                  रु {batchData.price.toLocaleString("en-IN")}
                </p>
              </div>
            )}
            {batchData.supplier && (
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  आपूर्तिकर्ता:
                </span>
                <p className="text-sm sm:text-base text-gray-900 font-semibold mt-1">
                  {batchData.supplier}
                </p>
              </div>
            )}
          </div>

          {/* Vaccinations Section */}
          <div className="border-t pt-3 sm:pt-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              खोप विवरण
            </h4>
            <div className="space-y-2">
              {batchData.vaccinations.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  खोप थपिएको छैन
                </p>
              ) : (
                batchData.vaccinations.map((vacc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-2 sm:p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="text-xs sm:text-sm text-gray-900">
                      {vacc.name}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {vacc.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Medications Section */}
          <div className="border-t pt-3 sm:pt-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              औषधि विवरण
            </h4>
            <div className="space-y-2">
              {batchData.medications.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  औषधि थपिएको छैन
                </p>
              ) : (
                batchData.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-purple-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="text-xs sm:text-sm text-gray-900 font-medium block sm:inline">
                        {med.name}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 block sm:inline sm:ml-3">
                        {med.date}
                      </span>
                    </div>
                    {med.imagePath && (
                      <button
                        onClick={() =>
                          handleViewMedicationImage(med.imagePath!)
                        }
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium"
                        title={med.imageName || "औषधिको फोटो हेर्नुहोस्"}
                      >
                        <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        फोटो
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Proof Section */}
          <div className="border-t pt-3 sm:pt-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              भुक्तानी प्रमाण
            </h4>
            {batchData.paymentProofName && batchData.paymentProofPath ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 rounded-lg flex-1">
                  {fileType === "pdf" ? (
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    {batchData.paymentProofName}
                  </span>
                </div>
                <button
                  onClick={handleViewFile}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors text-xs sm:text-sm font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  हेर्नुहोस्
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">
                भुक्तानी प्रमाण उपलब्ध छैन
              </p>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
