"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, FileText, Image as ImageIcon } from "lucide-react";
import AddBatchModal from "./AddBatchModal";
import AddDeathModal from "./AddDeathModal";
import AddVaccinationModal from "./AddVaccinationModal";
import AddMedicationModal from "./AddMedicationModal";
import ViewDetailModal from "./ViewBatchDetails";
import EditBatchModal from "./EditBatchModal";
import { getAllBatches, BatchWithDetails } from "@/lib/api/batch";
import { getPoultryPublicUrl, getMedicationImageUrl } from "@/lib/api/storage";
import Image from "next/image";

interface PopupItem {
  type: "vaccine" | "medication";
  name: string;
  date: string;
  imageName?: string;
  imagePath?: string;
}

export default function PoultryManagementTable() {
  const [batches, setBatches] = useState<BatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAddDeathOpen, setIsAddDeathOpen] = useState(false);
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);

  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  const [selectedBatchForView, setSelectedBatchForView] =
    useState<BatchWithDetails | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBatchForEdit, setSelectedBatchForEdit] =
    useState<BatchWithDetails | null>(null);

  // Popup for viewing specific vaccine/medication
  const [viewItem, setViewItem] = useState<PopupItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Load batches on mount
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBatches();
      setBatches(data);
    } catch (error) {
      console.error("Error loading batches:", error);
      alert("ब्याच लोड गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBatch = (batch: BatchWithDetails) => {
    setSelectedBatchForView(batch);
    setIsViewDetailOpen(true);
  };

  const handleEditBatch = (batch: BatchWithDetails) => {
    setSelectedBatchForEdit(batch);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    await loadBatches();
  };

  const openPopup = (item: PopupItem) => {
    setViewItem(item);
    setIsPopupOpen(true);
    setTimeout(() => setIsPopupVisible(true), 10);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setTimeout(() => {
      setIsPopupOpen(false);
      setViewItem(null);
    }, 300);
  };

  const getFileType = (fileName: string | null) => {
    if (!fileName) return null;
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ext === "pdf" ? "pdf" : "image";
  };

  const handleViewProof = (paymentProofPath: string) => {
    const url = getPoultryPublicUrl(paymentProofPath);
    window.open(url, "_blank");
  };

  const handleViewMedicationImage = (imagePath: string) => {
    const url = getMedicationImageUrl(imagePath);
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Action Buttons - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => setIsAddBatchOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#1ab189] text-white text-xs sm:text-sm rounded-lg hover:bg-[#158f6f] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">ब्याच थप्नुहोस्</span>
          <span className="sm:hidden">ब्याच</span>
        </button>
        <button
          onClick={() => setIsAddDeathOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">मृत्युदर थप्नुहोस्</span>
          <span className="sm:hidden">मृत्युदर</span>
        </button>
        <button
          onClick={() => setIsAddVaccinationOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">खोप थप्नुहोस्</span>
          <span className="sm:hidden">खोप</span>
        </button>
        <button
          onClick={() => setIsAddMedicationOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white text-xs sm:text-sm rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">औषधि थप्नुहोस्</span>
          <span className="sm:hidden">औषधि</span>
        </button>
      </div>

      {/* Batch Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            ब्याच विवरण
          </h2>
        </div>

        {isLoading ? (
          <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-sm sm:text-base text-gray-500">
            लोड हुँदैछ...
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      SN
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      ब्याच नाम
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      आगमन मिति
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      मूल्य (रु)
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      खोप मिति
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      औषधि मिति
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      भुक्तानी प्रमाण
                    </th>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      क्रियाकलाप
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {batches.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        कुनै ब्याच छैन
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch, index) => (
                      <tr
                        key={batch.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm font-medium text-gray-900">
                          {batch.batchName}
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                          {batch.dateOfArrival}
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                          {batch.price ? (
                            <span className="font-medium">
                              रु {batch.price.toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span className="text-gray-400">---</span>
                          )}
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                          <div className="space-y-1">
                            {batch.vaccinations.length === 0 ? (
                              <span className="text-gray-400">---</span>
                            ) : (
                              batch.vaccinations.map((vacc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-gray-400">→</span>
                                  <span>{vacc.date}</span>
                                  <button
                                    onClick={() =>
                                      openPopup({
                                        type: "vaccine",
                                        name: vacc.name,
                                        date: vacc.date,
                                      })
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                    title="खोप विवरण हेर्नुहोस्"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                          <div className="space-y-1">
                            {batch.medications.length === 0 ? (
                              <span className="text-gray-400">---</span>
                            ) : (
                              batch.medications.map((med, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-gray-400">→</span>
                                  <span>{med.date}</span>
                                  <button
                                    onClick={() =>
                                      openPopup({
                                        type: "medication",
                                        name: med.name,
                                        date: med.date,
                                        imageName: med.imageName,
                                        imagePath: med.imagePath,
                                      })
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                    title="औषधि विवरण हेर्नुहोस्"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-600">
                          {batch.paymentProofName && batch.paymentProofPath ? (
                            <button
                              onClick={() =>
                                handleViewProof(batch.paymentProofPath)
                              }
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg transition-colors"
                              title={batch.paymentProofName}
                            >
                              {getFileType(batch.paymentProofName) === "pdf" ? (
                                <FileText className="w-4 h-4" />
                              ) : (
                                <ImageIcon className="w-4 h-4" />
                              )}
                              <span className="text-xs">हेर्नुहोस्</span>
                            </button>
                          ) : (
                            <span className="text-gray-400">---</span>
                          )}
                        </td>
                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewBatch(batch)}
                              className="p-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              हेर्नुहोस्
                            </button>
                            <button
                              onClick={() => handleEditBatch(batch)}
                              className="p-2 text-xs text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg"
                            >
                              सम्पादन
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {batches.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  कुनै ब्याच छैन
                </div>
              ) : (
                batches.map((batch, index) => (
                  <div key={batch.id} className="p-4 hover:bg-gray-50">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            #{index + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {batch.batchName}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-600">
                          {batch.dateOfArrival}
                        </p>
                      </div>
                      {batch.price && (
                        <span className="ml-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded whitespace-nowrap">
                          रु {batch.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-2 mb-3">
                      {/* Vaccinations */}
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          खोप मिति:
                        </p>
                        {batch.vaccinations.length === 0 ? (
                          <span className="text-xs text-gray-400">---</span>
                        ) : (
                          <div className="space-y-1">
                            {batch.vaccinations.map((vacc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span className="text-gray-400">→</span>
                                <span className="text-gray-700">
                                  {vacc.date}
                                </span>
                                <button
                                  onClick={() =>
                                    openPopup({
                                      type: "vaccine",
                                      name: vacc.name,
                                      date: vacc.date,
                                    })
                                  }
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Medications */}
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          औषधि मिति:
                        </p>
                        {batch.medications.length === 0 ? (
                          <span className="text-xs text-gray-400">---</span>
                        ) : (
                          <div className="space-y-1">
                            {batch.medications.map((med, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span className="text-gray-400">→</span>
                                <span className="text-gray-700">
                                  {med.date}
                                </span>
                                <button
                                  onClick={() =>
                                    openPopup({
                                      type: "medication",
                                      name: med.name,
                                      date: med.date,
                                      imageName: med.imageName,
                                      imagePath: med.imagePath,
                                    })
                                  }
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Payment Proof */}
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          भुक्तानी प्रमाण:
                        </p>
                        {batch.paymentProofName && batch.paymentProofPath ? (
                          <button
                            onClick={() =>
                              handleViewProof(batch.paymentProofPath)
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#1ab189] bg-[#e8f8f7] hover:bg-[#d0f0eb] rounded-lg transition-colors"
                          >
                            {getFileType(batch.paymentProofName) === "pdf" ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                            हेर्नुहोस्
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">---</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewBatch(batch)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        हेर्नुहोस्
                      </button>
                      <button
                        onClick={() => handleEditBatch(batch)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs text-[#1ab189] bg-[#e8f8f7] hover:bg-[#d0f0eb] rounded-lg transition-colors"
                      >
                        सम्पादन
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AddBatchModal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
        onBatchAdded={loadBatches}
      />
      <AddDeathModal
        isOpen={isAddDeathOpen}
        onClose={() => setIsAddDeathOpen(false)}
        onDeathAdded={loadBatches}
      />
      <AddVaccinationModal
        isOpen={isAddVaccinationOpen}
        onClose={() => setIsAddVaccinationOpen(false)}
        onVaccinationAdded={loadBatches}
      />
      <AddMedicationModal
        isOpen={isAddMedicationOpen}
        onClose={() => setIsAddMedicationOpen(false)}
        onMedicationAdded={loadBatches}
      />
      <ViewDetailModal
        isOpen={isViewDetailOpen}
        onClose={() => setIsViewDetailOpen(false)}
        batchData={selectedBatchForView}
      />
      <EditBatchModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        batchData={selectedBatchForEdit}
        onSave={handleSaveEdit}
      />

      {/* Popup for Vaccine/Medication Details */}
      {isPopupOpen && (
        <>
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              isPopupVisible ? "opacity-50" : "opacity-0"
            }`}
            style={{ zIndex: 40 }}
            onClick={closePopup}
          ></div>

          <div
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              isPopupVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md w-full transform transition-transform duration-300 ${
                isPopupVisible ? "scale-100" : "scale-95"
              }`}
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                {viewItem?.type === "vaccine" ? "खोप विवरण" : "औषधि विवरण"}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">नाम:</span> {viewItem?.name}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-medium">मिति:</span> {viewItem?.date}
              </p>

              {viewItem?.type === "medication" && viewItem.imagePath && (
                <div className="mb-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    औषधिको फोटो:
                  </p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={getMedicationImageUrl(viewItem.imagePath)}
                      alt={viewItem.imageName || "Medication"}
                      width={400}
                      height={300}
                      className="w-full h-auto max-h-60 sm:max-h-80 object-contain bg-gray-50"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  {viewItem.imageName && (
                    <p className="text-xs text-gray-500 mt-1">
                      {viewItem.imageName}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                {viewItem?.type === "medication" && viewItem.imagePath && (
                  <button
                    onClick={() =>
                      handleViewMedicationImage(viewItem.imagePath!)
                    }
                    className="px-4 py-2 text-sm bg-[#1ab189] text-white rounded hover:bg-[#158f6f] transition-colors"
                  >
                    पूर्ण आकारमा हेर्नुहोस्
                  </button>
                )}
                <button
                  onClick={closePopup}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  बन्द गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
