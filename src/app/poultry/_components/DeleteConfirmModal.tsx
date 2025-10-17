"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: DeleteConfirmModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShow(false) || setTimeout(onClose, 300)}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">पुष्टिकरण</h2>
          <button onClick={() => setShow(false) || setTimeout(onClose, 300)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShow(false) || setTimeout(onClose, 300)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            onClick={() => {
              onConfirm();
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            हटाउनुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}
