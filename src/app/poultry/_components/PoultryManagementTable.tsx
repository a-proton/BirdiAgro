"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import AddBatchModal from "./AddBatchModal";
import AddDeathModal from "./AddDeathModal";
import AddVaccinationModal from "./AddVaccinationModal";
import AddMedicationModal from "./AddMedicationModal";
import ViewDetailModal from "./ViewBatchDetails";
import EditBatchModal from "./EditBatchModal";

// ---------- Types ----------

export interface Batch {
  id: number;
  batchName: string;
  dateOfArrival: string;
  numberOfChicks?: number;
  price?: number;
  supplier?: string;
  vaccinations: { date: string; name: string }[];
  medications: { date: string; name: string }[];
  paymentProof: string;
}

interface PopupItem {
  type: "vaccine" | "medication";
  name: string;
  date: string;
}

// ---------- Static Data ----------
const initialBatchData: Batch[] = [
  {
    id: 1,
    batchName: "Batch-001",
    dateOfArrival: "2024-09-15",
    numberOfChicks: 500,
    price: 50000,
    supplier: "नेपाल ह्याचरी प्रा. लि.",
    vaccinations: [
      { date: "2024-09-20", name: "Newcastle Vaccine" },
      { date: "2024-10-05", name: "IBD Vaccine" },
      { date: "2024-10-21", name: "Fowl Pox Vaccine" },
    ],
    medications: [
      { date: "2024-09-25", name: "Antibiotic A" },
      { date: "2024-10-10", name: "Vitamin Supplement" },
    ],
    paymentProof: "payment_001.pdf",
  },
  {
    id: 2,
    batchName: "Batch-002",
    dateOfArrival: "2024-09-20",
    numberOfChicks: 600,
    price: 60000,
    supplier: "पोखरा पोल्ट्री",
    vaccinations: [
      { date: "2024-09-25", name: "Newcastle Vaccine" },
      { date: "2024-10-10", name: "IBD Booster" },
    ],
    medications: [{ date: "2024-09-30", name: "Coccidiostat" }],
    paymentProof: "payment_002.pdf",
  },
  {
    id: 3,
    batchName: "Batch-003",
    dateOfArrival: "2024-10-01",
    numberOfChicks: 450,
    price: 45000,
    supplier: "काठमाडौं फार्म सप्लाई",
    vaccinations: [
      { date: "2024-10-06", name: "Newcastle" },
      { date: "2024-10-21", name: "Avian Influenza" },
    ],
    medications: [
      { date: "2024-10-11", name: "Electrolytes" },
      { date: "2024-10-15", name: "Antibiotic B" },
    ],
    paymentProof: "payment_003.pdf",
  },
];

// ---------- Component ----------
export default function PoultryManagementTable() {
  const [batches, setBatches] = useState<Batch[]>(initialBatchData);

  // Modal states
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAddDeathOpen, setIsAddDeathOpen] = useState(false);
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);

  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  const [selectedBatchForView, setSelectedBatchForView] =
    useState<Batch | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBatchForEdit, setSelectedBatchForEdit] =
    useState<Batch | null>(null);

  // Popup for viewing specific vaccine/medication
  const [viewItem, setViewItem] = useState<PopupItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // ---------- Handlers ----------
  const handleViewBatch = (batch: Batch) => {
    setSelectedBatchForView(batch);
    setIsViewDetailOpen(true);
  };

  const handleEditBatch = (batch: Batch) => {
    setSelectedBatchForEdit(batch);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updatedBatch: Batch) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
    );
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

  // ---------- Render ----------
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
              {batches.map((batch, index) => (
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

                  {/* Vaccination Dates */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {batch.vaccinations.map((vacc, idx) => (
                        <div key={idx} className="flex items-center gap-2">
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
                      ))}
                    </div>
                  </td>

                  {/* Medication Dates */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {batch.medications.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-2">
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
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <a
                      href="#"
                      className="text-[#1ab189] hover:text-[#158f6f] hover:underline"
                    >
                      {batch.paymentProof}
                    </a>
                  </td>

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
                        सम्पादन गर्नुहोस्
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddBatchModal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
      />
      <AddDeathModal
        isOpen={isAddDeathOpen}
        onClose={() => setIsAddDeathOpen(false)}
      />
      <AddVaccinationModal
        isOpen={isAddVaccinationOpen}
        onClose={() => setIsAddVaccinationOpen(false)}
      />
      <AddMedicationModal
        isOpen={isAddMedicationOpen}
        onClose={() => setIsAddMedicationOpen(false)}
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

      {/* Popup */}
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
