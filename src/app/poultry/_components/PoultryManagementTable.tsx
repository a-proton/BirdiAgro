"use client";
import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import AddBatchModal from "./AddBatchModal";
import AddDeathModal from "./AddDeathModal";
import AddVaccinationModal from "./AddVaccinationModal";
import AddMedicationModal from "./AddMedicationModal";

const batchData = [
  {
    id: 1,
    batchName: "Batch-001",
    dateOfArrival: "2024-09-15",
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

export default function PoultryManagementTable() {
  const [batches, setBatches] = useState(batchData);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAddDeathOpen, setIsAddDeathOpen] = useState(false);
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);

  // For the detail popup
  const [viewItem, setViewItem] = useState<{
    type: string;
    name: string;
    date: string;
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      setBatches(batches.filter((batch) => batch.id !== id));
    }
  };

  const openPopup = (item: { type: string; name: string; date: string }) => {
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

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setIsAddBatchOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Batch
        </button>
        <button
          onClick={() => setIsAddDeathOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Death
        </button>
        <button
          onClick={() => setIsAddVaccinationOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vaccination
        </button>
        <button
          onClick={() => setIsAddMedicationOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </div>

      {/* Batch Details Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Batch Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  SN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Batch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date of Arrival
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Vaccination Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Medication Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {batches.map((batch, index) => (
                <tr
                  key={batch.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.batchName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.dateOfArrival}
                  </td>
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
                            title="View vaccine details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
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
                            title="View medication details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <a
                      href="#"
                      className="text-[#1ab189] hover:text-[#158f6f] hover:underline"
                    >
                      {batch.paymentProof}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        View
                      </button>
                      <button className="p-2 text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(batch.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
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

      {/* Detail Popup with Backdrop */}
      {isPopupOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              isPopupVisible ? "opacity-50" : "opacity-0"
            }`}
            style={{ zIndex: 40 }}
            onClick={closePopup}
          ></div>

          {/* Popup */}
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
                {viewItem?.type === "vaccine"
                  ? "Vaccination Detail"
                  : "Medication Detail"}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Name:</span> {viewItem?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date:</span> {viewItem?.date}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
