"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import AddExpenseModal from "./_components/AddExpenseModal";
import EditExpenseModal from "./_components/EditExpenseModal";
import ViewExpenseModal from "./_components/ViewExpenseModal";
import ExpenseTable from "./_components/ExpenseTable";
import Image from "next/image";
import {
  getAllExpenses,
  deleteExpense,
  updateExpense,
  type Expense,
} from "@/lib/api/expenses";

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

export default function ExpensesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Error loading expenses:", err);
      setError("खर्च लोड गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleEditExpense = async (
    id: number,
    data: {
      category?: string;
      batch?: string;
      title?: string;
      amount?: number;
      date?: string;
      paymentMethod?: string;
      isPaid?: boolean;
      paymentProof?: File | null;
      oldPaymentProofPath?: string | null;
    }
  ) => {
    try {
      await updateExpense(id, data);

      setExpenses((prevExpenses) =>
        prevExpenses.map((exp) => {
          if (exp.id === id) {
            return {
              ...exp,
              ...(data.category !== undefined && { category: data.category }),
              ...(data.batch !== undefined && { batch: data.batch }),
              ...(data.title !== undefined && { title: data.title }),
              ...(data.amount !== undefined && { amount: data.amount }),
              ...(data.date !== undefined && { date: data.date }),
              ...(data.paymentMethod !== undefined && {
                method: data.paymentMethod,
              }),
              ...(data.isPaid !== undefined && { isPaid: data.isPaid }),
            };
          }
          return exp;
        })
      );

      setIsEditModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("खर्च अपडेट गर्न सकिएन। पुन: प्रयास गर्नुहोस्।");
      throw err;
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("के तपाईं यो खर्च मेटाउन चाहनुहुन्छ?")) {
      return;
    }

    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("खर्च मेटाउन सकिएन। पुन: प्रयास गर्नुहोस्।");
    }
  };

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `रु ${(amount / 100000).toFixed(2)} लाख`;
    }
    return `रु ${amount.toLocaleString("ne-NP")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ab189] mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            लोड हुँदैछ...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
          <button
            onClick={loadExpenses}
            className="px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f]"
          >
            पुन: प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            खर्च व्यवस्थापन
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            आफ्नो खर्च ट्र्याक र व्यवस्थापन गर्नुहोस्
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1ab189] text-white text-sm sm:text-base rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          नयाँ खर्च थप्नुहोस्
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Expense */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
              आजको खर्च
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/expenses.png" alt="Expense Icon" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
            {formatCurrency(todayExpense)}
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
            <span>
              {todayExpense > 0 ? "हिजोभन्दा बढी" : "हालसम्म खर्च छैन"}
            </span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
              यस महिना
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/trending-down.png" alt="Chart Down Icon" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
            {formatCurrency(monthExpense)}
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
            <span>
              {monthExpense > 0 ? "अघिल्लो महिनाभन्दा बढी" : "खर्च छैन"}
            </span>
          </div>
        </div>

        {/* Paid Expense */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
              भुक्तानी भएको
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/total-sales.png" alt="Paid Icon" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
            {formatCurrency(paidExpense)}
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{expenses.filter((e) => e.isPaid).length} खर्च</span>
          </div>
        </div>

        {/* Unpaid Expense */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
              बाँकी
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/expenses.png" alt="Unpaid Icon" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
            {formatCurrency(unpaidExpense)}
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
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
