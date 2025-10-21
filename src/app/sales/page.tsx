"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import AddSalesModal from "./_components/AddSalesModal";
import EditSalesModal from "./_components/EditSalesModal";
import ViewSalesModal from "./_components/ViewSalesModal";
import SalesTable from "./_components/SalesTable";

interface StatIconProps {
  src: string;
  alt: string;
}

function StatIcon({ src, alt }: StatIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      height={20}
      width={20}
      className="w-6 h-6 object-contain"
    />
  );
}

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

export default function SalesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const [salesData, setSalesData] = useState<Sale[]>([
    {
      id: 1,
      type: "kukhura",
      batchName: "ब्याच-००१",
      productName: "ब्रॉइलर कुखुरा",
      chickenCount: "100",
      totalKgs: "50",
      pricePerKg: "300",
      totalAmount: "15000",
      soldTo: "राम बहादुर",
      amountReceived: true,
      salesDate: "2024-01-15",
    },
    {
      id: 2,
      type: "others",
      productName: "ताजा अण्डा",
      totalPcs: "500",
      totalKgs: "30",
      totalAmount: "7500",
      soldTo: "सीता देवी",
      amountReceived: false,
      salesDate: "2024-01-16",
    },
  ]);

  const handleAddSale = (newSale: Sale) => {
    setSalesData([newSale, ...salesData]);
  };

  const handleEditSale = (updatedSale: Sale) => {
    setSalesData(
      salesData.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale))
    );
    setEditingSale(null);
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            बिक्री व्यवस्थापन
          </h1>
          <p className="text-gray-600 mt-1">
            आफ्नो बिक्री कारोबार ट्र्याक र व्यवस्थापन गर्नुहोस्
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          बिक्री थप्नुहोस्
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              आजको बिक्री
            </span>
            <div className="w-10 h-10 bg-[#e8f8f7] text-[#1ab189] rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/money-bag.png" alt="Money Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">रु 45,200</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>हिजोको तुलनामा ८%</span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              यस महिना
            </span>
            <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/trending.png" alt="Chart Up Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            रु १२.५ लाख
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>पछिल्लो महिनाको तुलनामा १५%</span>
          </div>
        </div>

        {/* Total Overall Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              कुल बिक्री
            </span>
            <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/total-sales.png" alt="Analytics Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            रु २.४५ लाख
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>यस वर्षमा +२२%</span>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <SalesTable
        salesData={salesData}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Modals */}
      <AddSalesModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSale}
      />

      <EditSalesModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSale(null);
        }}
        onSave={handleEditSale}
        data={editingSale}
      />

      <ViewSalesModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSale(null);
        }}
        data={selectedSale}
      />
    </div>
  );
}
