"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import AddExpenseModal from "./_components/AddExpenseModal";
import Image from "next/image";

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

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data — replace with real data fetching
  const [recentExpenses, setRecentExpenses] = useState([
    {
      id: 1,
      category: "kukhura",
      title: "खाद किन्नु",
      amount: 12500,
      date: "2025-10-15",
      method: "नगद",
    },
    {
      id: 2,
      category: "others",
      title: "डाक्टर भ्रमण",
      amount: 3200,
      date: "2025-10-16",
      method: "बैंक ट्रान्सफर",
    },
  ]);

  // Helper to get stats dynamically
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const todayExpense = recentExpenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthExpense = recentExpenses
    .filter((e) => new Date(e.date).getMonth() === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = recentExpenses
    .filter((e) => new Date(e.date).getFullYear() === currentYear)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            खर्च व्यवस्थापन
          </h1>
          <p className="text-gray-600 mt-1">
            आफ्नो खर्च ट्र्याक र व्यवस्थापन गर्नुहोस्
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नयाँ खर्च थप्नुहोस्
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Expense */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              आजको खर्च
            </span>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/expenses.png" alt="Expense Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            Rs {todayExpense.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-red-600">
            <TrendingUp className="w-4 h-4 rotate-180" />
            <span>
              {todayExpense > 0 ? "हिजोभन्दा बढी" : "हालसम्म खर्च छैन"}
            </span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              यस महिना
            </span>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/trending-down.png" alt="Chart Down Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            Rs {monthExpense.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-red-600">
            <TrendingUp className="w-4 h-4 rotate-180" />
            <span>
              {monthExpense > 0 ? "अघिल्लो महिनाभन्दा बढी" : "खर्च छैन"}
            </span>
          </div>
        </div>

        {/* Total Overall Expense */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              कुल खर्च
            </span>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/total-sales.png" alt="Total Expense Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            Rs {totalExpense.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>+ वर्षको खर्च {totalExpense.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">हालैका खर्च</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  क्र.सं.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  वर्ग
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  खर्चको नाम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  रकम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  मिति
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  भुक्तानी माध्यम
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentExpenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.category === "kukhura" ? "कुखुरा" : "अन्य"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
