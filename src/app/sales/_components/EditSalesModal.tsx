"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getBatchNames } from "@/lib/api/batch"; // adjust this import if needed
import { Sale } from "@/lib/api/sales";
interface KukhuraData {
  [key: string]: string | number | boolean | null | undefined;
  batchName?: string;
  date?: string;
  quantity?: number;
  isHealthy?: boolean;
}

interface EditSalesModalProps {
  isOpen: boolean;
  data: Sale | null;
  onClose: () => void;
  onSave: (updatedSale: Sale) => void;
}

const EditSalesModal: React.FC<EditSalesModalProps> = ({
  isOpen,
  data,
  onClose,
}) => {
  const [show, setShow] = useState(false);
  const [batchNames, setBatchNames] = useState<string[]>([]);
  const [kukhuraData, setKukhuraData] = useState<KukhuraData>({});

  // ✅ useCallback ensures stable reference for ESLint dependency rule
  const fetchBatchNames = useCallback(async () => {
    try {
      const names = await getBatchNames();
      if (data?.batchName && !names.includes(data.batchName)) {
        setBatchNames([data.batchName, ...names]);
      } else {
        setBatchNames(names);
      }
    } catch (err) {
      console.error("Error fetching batch names:", err);
    }
  }, [data?.batchName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setKukhuraData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setKukhuraData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      fetchBatchNames();
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen, fetchBatchNames]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Sales</h2>

        <form className="space-y-4">
          {/* Example input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Batch Name
            </label>
            <select
              name="batchName"
              value={kukhuraData.batchName || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select batch</option>
              {batchNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Example checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isHealthy"
              checked={!!kukhuraData.isHealthy}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-700">Healthy</label>
          </div>

          {/* Example date input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={kukhuraData.date || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalesModal;
