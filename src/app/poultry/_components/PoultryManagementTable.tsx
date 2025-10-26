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
import { getPoultryPublicUrl } from "@/lib/api/storage";

interface PopupItem {
  type: "vaccine" | "medication";
  name: string;
  date: string;
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

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setIsAddBatchOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
        >
          <Plus className="w-4 h-4" />
          ब्याच थप्नुहोस्
        </button>
        <button
          onClick={() => setIsAddDeathOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          मृत्युदर थप्नुहोस्
        </button>
        <button
          onClick={() => setIsAddVaccinationOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          खोप थप्नुहोस्
        </button>
        <button
          onClick={() => setIsAddMedicationOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          औषधि थप्नुहोस्
        </button>
      </div>

      {/* Batch Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ब्याच विवरण</h2>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              लोड हुँदैछ...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    SN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    ब्याच नाम
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    आगमन मिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    मूल्य (रु)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    खोप मिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    औषधि मिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    भुक्तानी प्रमाण
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {batch.batchName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {batch.dateOfArrival}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {batch.price ? (
                          <span className="font-medium">
                            रु {batch.price.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-gray-400">---</span>
                        )}
                      </td>

                      {/* Vaccination Dates */}
                      <td className="px-6 py-4 text-sm text-gray-900">
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

                      {/* Medication Dates */}
                      <td className="px-6 py-4 text-sm text-gray-900">
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

                      {/* Payment Proof */}
                      <td className="px-6 py-4 text-sm text-gray-600">
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

                      {/* Actions */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewBatch(batch)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            हेर्नुहोस्
                          </button>
                          <button
                            onClick={() => handleEditBatch(batch)}
                            className="p-2 text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg"
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
          )}
        </div>
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
              className={`bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-transform duration-300 ${
                isPopupVisible ? "scale-100" : "scale-95"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {viewItem?.type === "vaccine" ? "खोप विवरण" : "औषधि विवरण"}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">नाम:</span> {viewItem?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">मिति:</span> {viewItem?.date}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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
