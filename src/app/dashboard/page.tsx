"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Bell, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

// Import types
type DashboardStats = {
  totalChickens: number;
  totalExpense: number;
  totalSales: number;
  activeBatches: number;
  chickenGrowth: number;
  expenseGrowth: number;
  salesGrowth: number;
};

type SalesTrend = {
  year: string;
  count: number;
};

type MonthlyExpense = {
  month: string;
  expense: number;
};

type FeedDistribution = {
  name: string;
  value: number;
  color: string;
};

type BatchDeath = {
  batch: string;
  total: number;
  deaths: number;
  rate: string;
};

type RecentUpdate = {
  time: string;
  user: string;
  action: string;
  type: "feed" | "death" | "expense" | "health" | "batch" | "sale";
};

type TopBatch = {
  name: string;
  survival: string;
  weight: string;
  profit: string;
};

type FeedStockAlert = {
  type: string;
  current: number;
  minimum: number;
  status: "low" | "good" | "critical";
};

type Notification = {
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  priority: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChickens: 0,
    totalExpense: 0,
    totalSales: 0,
    activeBatches: 0,
    chickenGrowth: 0,
    expenseGrowth: 0,
    salesGrowth: 0,
  });

  const [salesData, setSalesData] = useState<SalesTrend[]>([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<
    MonthlyExpense[]
  >([]);
  const [feedTypeData, setFeedTypeData] = useState<FeedDistribution[]>([]);
  const [batchDeaths, setBatchDeaths] = useState<BatchDeath[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);
  const [topBatches, setTopBatches] = useState<TopBatch[]>([]);
  const [feedStock, setFeedStock] = useState<FeedStockAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeBatchSummary, setActiveBatchSummary] = useState({
    totalBatches: 0,
    totalChickens: 0,
    totalFeedConsumption: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // Import API functions dynamically
        const {
          getDashboardStats,
          getSalesTrend,
          getMonthlyExpenses,
          getFeedDistribution,
          getBatchDeaths,
          getRecentUpdates,
          getTopBatches,
          getFeedStockAlerts,
          getNotifications,
          getActiveBatchSummary,
        } = await import("@/lib/api/dashboard");

        const [
          statsData,
          salesTrendData,
          expensesData,
          feedData,
          deathsData,
          updatesData,
          batchesData,
          stockData,
          notificationsData,
          summaryData,
        ] = await Promise.all([
          getDashboardStats(),
          getSalesTrend(),
          getMonthlyExpenses(),
          getFeedDistribution(),
          getBatchDeaths(),
          getRecentUpdates(),
          getTopBatches(),
          getFeedStockAlerts(),
          getNotifications(),
          getActiveBatchSummary(),
        ]);

        setStats(statsData);
        setSalesData(salesTrendData);
        setMonthlyExpenseData(expensesData);
        setFeedTypeData(feedData);
        setBatchDeaths(deathsData);
        setRecentUpdates(updatesData);
        setTopBatches(batchesData);
        setFeedStock(stockData);
        setNotifications(notificationsData);
        setActiveBatchSummary(summaryData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            ड्यासबोर्ड
          </h1>
          <p className="text-gray-600 mt-1">
            तपाईंको पोल्ट्री फार्म सञ्चालनको सारांश
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Kukhura Currently */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                कुल कुखुरा
              </span>
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center text-2xl">
                🐔
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.totalChickens.toLocaleString("en-NP")}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {stats.chickenGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span
                className={`font-medium ${
                  stats.chickenGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.chickenGrowth >= 0 ? "+" : ""}
                {stats.chickenGrowth}%
              </span>
              <span className="text-gray-500">गत महिनाभन्दा</span>
            </div>
          </div>

          {/* Total Expense */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                कुल खर्च
              </span>
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-2xl">
                💸
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              रु {(stats.totalExpense / 100000).toFixed(1)} लाख
            </div>
            <div className="flex items-center gap-1 text-xs">
              {stats.expenseGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-red-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-green-600" />
              )}
              <span
                className={`font-medium ${
                  stats.expenseGrowth >= 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {stats.expenseGrowth >= 0 ? "+" : ""}
                {stats.expenseGrowth}%
              </span>
              <span className="text-gray-500">यो महिना</span>
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                कुल बिक्री
              </span>
              <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              रु {(stats.totalSales / 100000).toFixed(1)} लाख
            </div>
            <div className="flex items-center gap-1 text-xs">
              {stats.salesGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span
                className={`font-medium ${
                  stats.salesGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.salesGrowth >= 0 ? "+" : ""}
                {stats.salesGrowth}%
              </span>
              <span className="text-gray-500">गत महिनाभन्दा</span>
            </div>
          </div>

          {/* Total Active Batches */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                कुल सक्रिय ब्याच
              </span>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-2xl">
                🌾
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.activeBatches}
            </div>
            <div className="text-xs text-gray-500">हाल सञ्चालनमा</div>
          </div>
        </div>

        {/* Sales Graph and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Graph */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              कुखुरा बिक्री प्रवृत्ति
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
              <h2 className="text-lg font-semibold text-gray-900">सूचनाहरू</h2>
            </div>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  कुनै सूचना छैन
                </p>
              ) : (
                notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border-l-4 rounded ${
                      notif.type === "error"
                        ? "bg-red-50 border-red-500"
                        : notif.type === "warning"
                        ? "bg-amber-50 border-amber-500"
                        : notif.type === "info"
                        ? "bg-blue-50 border-blue-500"
                        : "bg-green-50 border-green-500"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          notif.type === "error"
                            ? "text-red-600"
                            : notif.type === "warning"
                            ? "text-amber-600"
                            : notif.type === "info"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            notif.type === "error"
                              ? "text-red-900"
                              : notif.type === "warning"
                              ? "text-amber-900"
                              : notif.type === "info"
                              ? "text-blue-900"
                              : "text-green-900"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            notif.type === "error"
                              ? "text-red-700"
                              : notif.type === "warning"
                              ? "text-amber-700"
                              : notif.type === "info"
                              ? "text-blue-700"
                              : "text-green-700"
                          }`}
                        >
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Monthly Expense and Feed Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Expense Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              मासिक खर्च प्रवृत्ति
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Feed Type Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              दाना प्रकार वितरण
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: PieLabelRenderProps) =>
                    `${name ?? ""} ${
                      percent !== undefined
                        ? (Number(percent) * 100).toFixed(0)
                        : "0"
                    }%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feedTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {feedTypeData.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <p className="text-xs font-medium text-gray-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.value} किलो</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Deaths and Recent Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batch Death Statistics */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                ब्याच मृत्यु तथ्याङ्क
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {batchDeaths.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    कुनै डाटा छैन
                  </p>
                ) : (
                  batchDeaths.map((batch, idx) => (
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
                        <span>कुल: {batch.total}</span>
                        <span className="text-red-600 font-medium">
                          मृत्यु: {batch.deaths}
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent User Updates */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                हालसालैका अपडेटहरू
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUpdates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    कुनै अपडेट छैन
                  </p>
                ) : (
                  recentUpdates.map((update, idx) => (
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Batches and Active Batches Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Batches */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                उत्कृष्ट प्रदर्शन गर्ने ब्याचहरू
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topBatches.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    कुनै डाटा छैन
                  </p>
                ) : (
                  topBatches.map((batch, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          {batch.name}
                        </h3>
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">बाँच्ने दर</p>
                          <p className="font-semibold text-green-600">
                            {batch.survival}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">औसत तौल</p>
                          <p className="font-semibold text-gray-900">
                            {batch.weight}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">नाफा</p>
                          <p className="font-semibold text-teal-600">
                            {batch.profit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Active Batches Summary */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                सक्रिय ब्याच सारांश
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-teal-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      कुल सक्रिय ब्याच
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      {activeBatchSummary.totalBatches}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">हाल सञ्चालनमा</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-teal-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">कुल संख्या</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {activeBatchSummary.totalChickens.toLocaleString("en-NP")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">हाल सञ्चालनमा</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-teal-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">कुल दाना खपत</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {activeBatchSummary.totalFeedConsumption.toLocaleString(
                        "en-NP"
                      )}{" "}
                      किलो
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">कुल खपत</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              दाना स्टक स्थिति
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feedStock.map((stock, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-lg p-4 ${
                    stock.status === "critical"
                      ? "border-red-300 bg-red-50"
                      : stock.status === "low"
                      ? "border-amber-300 bg-amber-50"
                      : "border-green-300 bg-green-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{stock.type}</h3>
                    <span
                      className={`text-2xl ${
                        stock.status === "critical"
                          ? "text-red-600"
                          : stock.status === "low"
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {stock.status === "critical"
                        ? "🚨"
                        : stock.status === "low"
                        ? "⚠️"
                        : "✅"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">हालको स्टक:</span>
                      <span className="font-semibold text-gray-900">
                        {stock.current} किलो
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">न्यूनतम आवश्यक:</span>
                      <span className="font-semibold text-gray-900">
                        {stock.minimum} किलो
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          stock.status === "critical"
                            ? "bg-red-600"
                            : stock.status === "low"
                            ? "bg-amber-600"
                            : "bg-green-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            (stock.current / stock.minimum) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
