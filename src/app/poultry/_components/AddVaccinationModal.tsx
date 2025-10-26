"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBatchNames, getBatchIdByName } from "@/lib/api/batch";
import { createVaccination } from "@/lib/api/medications";

interface AddVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVaccinationAdded?: () => void;
}

interface VaccinationFormData {
  batch: string;
  week: string;
  vaccinationDate: string;
  vaccinationName: string;
}

export default function AddVaccinationModal({
  isOpen,
  onClose,
  onVaccinationAdded,
}: AddVaccinationModalProps) {
  const [show, setShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);

  const [formData, setFormData] = useState<VaccinationFormData>({
    batch: "",
    week: "",
    vaccinationDate: new Date().toISOString().split("T")[0],
    vaccinationName: "",
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      loadBatches();
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const loadBatches = async () => {
    setIsLoadingBatches(true);
    try {
      const batches = await getBatchNames();
      setAvailableBatches(batches);
    } catch (error) {
      console.error("Error loading batches:", error);
      alert("ब्याच लोड गर्न सकिएन।");
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const batchId = await getBatchIdByName(formData.batch);

      if (!batchId) {
        alert("ब्याच फेला परेन।");
        return;
      }

      // Generate vaccination name based on week
      const vaccinationName = getVaccinationNameByWeek(formData.week);

      await createVaccination({
        batchId,
        vaccinationName,
        vaccinationDate: formData.vaccinationDate,
        week: formData.week,
      });

      alert("खोप सफलतापूर्वक थपियो!");
      if (onVaccinationAdded) onVaccinationAdded();
      handleClose();
    } catch (error) {
      console.error("Error creating vaccination:", error);
      alert("खोप थप्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsSaving(false);
    }
  };

  const getVaccinationNameByWeek = (week: string): string => {
    const vaccineMap: { [key: string]: string } = {
      "Week-1": "रानीखेत रोग - 1st Dose",
      "Week-2": "गुम्बोरो खोप - 1st Dose ",
      "Week-3": "रानीखेत रोग  - 2nd Dose",
      "Week-4": "गुम्बोरो खोप - 2nd Dose",
    };
    return vaccineMap[week] || "General Vaccine";
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setFormData({
        batch: "",
        week: "",
        vaccinationDate: new Date().toISOString().split("T")[0],
        vaccinationName: "",
      });
    }, 300);
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
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">खोप थप्नुहोस्</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ब्याच छान्नुहोस्
              </label>
              <select
                required
                disabled={isLoadingBatches}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent disabled:bg-gray-100"
                value={formData.batch}
                onChange={(e) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
              >
                <option value="">
                  {isLoadingBatches ? "लोड हुँदैछ..." : "ब्याच छान्नुहोस्"}
                </option>
                {availableBatches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
              {!isLoadingBatches && availableBatches.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  कुनै ब्याच उपलब्ध छैन। पहिले ब्याच थप्नुहोस्।
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                हप्ता छान्नुहोस्
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                value={formData.week}
                onChange={(e) =>
                  setFormData({ ...formData, week: e.target.value })
                }
              >
                <option value="">हप्ता छान्नुहोस्</option>
                <option value="Week-1">हप्ता १</option>
                <option value="Week-2">हप्ता २</option>
                <option value="Week-3">हप्ता ३</option>
                <option value="Week-4">हप्ता ४</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                खोप मिति
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
                value={formData.vaccinationDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vaccinationDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={
                isSaving || isLoadingBatches || availableBatches.length === 0
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "थप्दै..." : "खोप थप्नुहोस्"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
