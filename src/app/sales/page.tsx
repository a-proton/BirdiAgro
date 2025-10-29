"use client";

import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import AddSalesModal from "./_components/AddSalesModal";
import EditSalesModal from "./_components/EditSalesModal";
import ViewSalesModal from "./_components/ViewSalesModal";
import SalesTable from "./_components/SalesTable";
import {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  getSalesStats,
  Sale,
  SaleStats,
} from "@/lib/api/sales";

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
      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
    />
  );
}

export default function SalesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SaleStats>({
    todaySales: 0,
    thisMonthSales: 0,
    totalSales: 0,
    todayGrowth: 0,
    monthGrowth: 0,
    yearGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [salesData, statsData] = await Promise.all([
          getAllSales(),
          getSalesStats(),
        ]);

        if (isMounted) {
          setSalesData(salesData);
          setStats(statsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (isMounted) {
          setError("डाटा लोड गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddSale = async (newSale: Sale) => {
    try {
      setError(null);
      await createSale(newSale);
      const [salesData, statsData] = await Promise.all([
        getAllSales(),
        getSalesStats(),
      ]);
      setSalesData(salesData);
      setStats(statsData);
    } catch (err) {
      console.error("Error adding sale:", err);
      setError("बिक्री थप्न असफल भयो");
      throw err;
    }
  };

  const handleEditSale = async (updatedSale: Sale) => {
    try {
      setError(null);
      if (updatedSale.id) {
        await updateSale(updatedSale.id, updatedSale);
        const [salesData, statsData] = await Promise.all([
          getAllSales(),
          getSalesStats(),
        ]);
        setSalesData(salesData);
        setStats(statsData);
      }
      setEditingSale(null);
    } catch (err) {
      console.error("Error updating sale:", err);
      setError("बिक्री अपडेट गर्न असफल भयो");
      throw err;
    }
  };

  const handleDeleteSale = async (id: number) => {
    if (confirm("के तपाईं यो बिक्री मेटाउन निश्चित हुनुहुन्छ?")) {
      try {
        setError(null);
        await deleteSale(id);
        const [salesData, statsData] = await Promise.all([
          getAllSales(),
          getSalesStats(),
        ]);
        setSalesData(salesData);
        setStats(statsData);
      } catch (err) {
        console.error("Error deleting sale:", err);
        setError("बिक्री मेटाउन असफल भयो");
      }
    }
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `रु ${(amount / 100000).toFixed(2)} लाख`;
    }
    return `रु ${amount.toLocaleString("ne-NP")}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            बिक्री व्यवस्थापन
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            आफ्नो बिक्री कारोबार ट्र्याक र व्यवस्थापन गर्नुहोस्
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1ab189] text-white text-sm sm:text-base rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          बिक्री थप्नुहोस्
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse"
            >
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Today's Sales */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                आजको बिक्री
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#e8f8f7] text-[#1ab189] rounded-lg flex items-center justify-center">
                <StatIcon src="/icons/money-bag.png" alt="Money Icon" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
              {formatCurrency(stats.todaySales)}
            </div>
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                stats.todayGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stats.todayGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>हिजोको तुलनामा {Math.abs(stats.todayGrowth)}%</span>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                यस महिना
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
                <StatIcon src="/icons/trending.png" alt="Chart Up Icon" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
              {formatCurrency(stats.thisMonthSales)}
            </div>
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                stats.monthGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stats.monthGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>
                पछिल्लो महिनाको तुलनामा {Math.abs(stats.monthGrowth)}%
              </span>
            </div>
          </div>

          {/* Total Overall Sales */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                कुल बिक्री (यस वर्ष)
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
                <StatIcon src="/icons/total-sales.png" alt="Analytics Icon" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
              {formatCurrency(stats.totalSales)}
            </div>
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                stats.yearGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stats.yearGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>गत वर्षको तुलनामा {Math.abs(stats.yearGrowth)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1ab189]"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            डाटा लोड भइरहेको छ...
          </p>
        </div>
      ) : (
        <SalesTable
          salesData={salesData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteSale}
        />
      )}

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
