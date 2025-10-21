"use client";
import { AlertTriangle, Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const salesData = [
    { year: "2018", count: 30 },
    { year: "2019", count: 40 },
    { year: "2020", count: 42 },
    { year: "2021", count: 50 },
    { year: "2022", count: 48 },
    { year: "2023", count: 55 },
    { year: "2024", count: 62 },
    { year: "2025", count: 70 },
  ];

  // Batch death data
  const batchDeaths = [
    { batch: "Batch A-2024", total: 500, deaths: 15, rate: "3.0%" },
    { batch: "Batch B-2024", total: 450, deaths: 28, rate: "6.2%" },
    { batch: "Batch C-2025", total: 600, deaths: 12, rate: "2.0%" },
    { batch: "Batch D-2025", total: 520, deaths: 35, rate: "6.7%" },
  ];

  // Recent updates
  const recentUpdates = [
    {
      time: "2 hours ago",
      user: "Ram Sharma",
      action: "Updated feed inventory",
      type: "feed",
    },
    {
      time: "4 hours ago",
      user: "Sita Devi",
      action: "Recorded 8 bird deaths",
      type: "death",
    },
    {
      time: "5 hours ago",
      user: "Hari Bahadur",
      action: "Added new expense entry",
      type: "expense",
    },
    {
      time: "Yesterday",
      user: "Krishna Rai",
      action: "Completed vaccination",
      type: "health",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your poultry farm operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Kukhura Currently */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Kukhura
              </span>
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center text-xl">
                🐔
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">2,070</div>
            <div className="text-xs text-gray-500">Currently in farm</div>
          </div>

          {/* Total Expense (Lifetime) */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Expense
              </span>
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl">
                💸
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              Rs 12.5L
            </div>
            <div className="text-xs text-gray-500">Lifetime expenses</div>
          </div>

          {/* Total Sales (Lifetime) */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Sales
              </span>
              <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center text-xl">
                💰
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              Rs 18.2L
            </div>
            <div className="text-xs text-gray-500">Lifetime revenue</div>
          </div>

          {/* Total Dana Used (Lifetime) */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Dana Used
              </span>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl">
                🌾
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              45,800 kg
            </div>
            <div className="text-xs text-gray-500">Lifetime consumption</div>
          </div>
        </div>

        {/* Sales Graph and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Graph */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Kukhura Sales Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: "#14b8a6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Important Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      High Death Rate Alert
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Batch D-2025 reached 6.7% death rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Low Feed Stock
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Only 850 kg remaining, reorder needed
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Vaccination Due
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Batch C-2025 vaccination in 3 days
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      High Expenses
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      This month expenses 15% above average
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Deaths and Recent Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batch Death Statistics */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Batch Death Statistics
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {batchDeaths.map((batch, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">
                        {batch.batch}
                      </h3>
                      <span
                        className={`text-sm font-semibold ${
                          parseFloat(batch.rate) > 5
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {batch.rate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Total: {batch.total}</span>
                      <span className="text-red-600 font-medium">
                        Deaths: {batch.deaths}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          parseFloat(batch.rate) > 5
                            ? "bg-red-600"
                            : "bg-green-600"
                        }`}
                        style={{ width: batch.rate }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent User Updates */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Updates
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUpdates.map((update, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        update.type === "feed"
                          ? "bg-amber-100 text-amber-600"
                          : update.type === "death"
                          ? "bg-red-100 text-red-600"
                          : update.type === "expense"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {update.type === "feed"
                        ? "🌾"
                        : update.type === "death"
                        ? "⚠️"
                        : update.type === "expense"
                        ? "💸"
                        : "💉"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {update.user}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {update.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {update.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
