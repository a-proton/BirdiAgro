"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import AddExpenseModal from "./_components/AddExpenseModal";
import EditExpenseModal from "./_components/EditExpenseModal";
import ViewExpenseModal from "./_components/ViewExpenseModal";
import ExpenseTable from "./_components/ExpenseTable";
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

interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  isPaid: boolean;
  paymentProofName: string | null;
}

export default function ExpensesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Mock data with updated structure
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      category: "kukhura",
      title: "खाद किन्नु",
      amount: 12500,
      date: "2025-10-15",
      method: "नगद",
      isPaid: true,
      paymentProofName: "payment-receipt-001.pdf",
    },
    {
      id: 2,
      category: "others",
      title: "डाक्टर भ्रमण",
      amount: 3200,
      date: "2025-10-16",
      method: "बैंक ट्रान्सफर",
      isPaid: false,
      paymentProofName: null,
    },
    {
      id: 3,
      category: "kukhura",
      title: "औषधि खरिद",
      amount: 8500,
      date: "2025-10-17",
      method: "मोबाइल वालेट",
      isPaid: true,
      paymentProofName: "medicine-receipt.jpg",
    },
  ]);

  // Helper to get stats dynamically
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const todayExpense = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthExpense = expenses
    .filter((e) => new Date(e.date).getMonth() === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => new Date(e.date).getFullYear() === currentYear)
    .reduce((sum, e) => sum + e.amount, 0);

  const paidExpense = expenses
    .filter((e) => e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  const unpaidExpense = expenses
    .filter((e) => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleEditExpense = (updatedExpense: Expense) => {
    setExpenses(
      expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

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
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नयाँ खर्च थप्नुहोस्
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            रु {todayExpense.toLocaleString()}
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
            रु {monthExpense.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-red-600">
            <TrendingUp className="w-4 h-4 rotate-180" />
            <span>
              {monthExpense > 0 ? "अघिल्लो महिनाभन्दा बढी" : "खर्च छैन"}
            </span>
          </div>
        </div>

        {/* Paid Expense */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              भुक्तानी भएको
            </span>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/total-sales.png" alt="Paid Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            रु {paidExpense.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>{expenses.filter((e) => e.isPaid).length} खर्च</span>
          </div>
        </div>

        {/* Unpaid Expense */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              बाँकी
            </span>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/expenses.png" alt="Unpaid Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            रु {unpaidExpense.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-purple-600">
            <TrendingUp className="w-4 h-4" />
            <span>{expenses.filter((e) => !e.isPaid).length} खर्च</span>
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <ExpenseTable
        expenses={expenses}
        onView={handleViewExpense}
        onEdit={handleEditClick}
        onDelete={handleDeleteExpense}
      />

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddExpense}
      />

      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        onSave={handleEditExpense}
        expense={selectedExpense}
      />

      <ViewExpenseModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </div>
  );
}
