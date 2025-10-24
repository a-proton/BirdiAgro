"use client";
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
  Legend,
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

  // Monthly expense data
  const monthlyExpenseData = [
    { month: "जनवरी", expense: 45000 },
    { month: "फेब्रुअरी", expense: 52000 },
    { month: "मार्च", expense: 48000 },
    { month: "अप्रिल", expense: 55000 },
    { month: "मे", expense: 61000 },
    { month: "जुन", expense: 58000 },
  ];

  // Feed consumption by type
  const feedTypeData = [
    { name: "स्टार्टर", value: 12000, color: "#14b8a6" },
    { name: "ग्रोअर", value: 18000, color: "#f59e0b" },
    { name: "फिनिसर", value: 15800, color: "#3b82f6" },
  ];

  // Batch death data
  const batchDeaths = [
    { batch: "ब्याच A-2024", total: 500, deaths: 15, rate: "3.0%" },
    { batch: "ब्याच B-2024", total: 450, deaths: 28, rate: "6.2%" },
    { batch: "ब्याच C-2025", total: 600, deaths: 12, rate: "2.0%" },
    { batch: "ब्याच D-2025", total: 520, deaths: 35, rate: "6.7%" },
  ];

  // Recent updates
  const recentUpdates = [
    {
      time: "२ घण्टा अघि",
      user: "Ram Sharma",
      action: "दाना सूची अपडेट गर्नुभयो",
      type: "feed",
    },
    {
      time: "४ घण्टा अघि",
      user: "Sita Devi",
      action: "८ कुखुराको मृत्यु रेकर्ड गर्नुभयो",
      type: "death",
    },
    {
      time: "५ घण्टा अघि",
      user: "Hari Bahadur",
      action: "नयाँ खर्च प्रविष्टि थप्नुभयो",
      type: "expense",
    },
    {
      time: "हिजो",
      user: "Krishna Rai",
      action: "खोप पूरा गर्नुभयो",
      type: "health",
    },
  ];

  // Top performing batches
  const topBatches = [
    {
      name: "ब्याच A-2024",
      survival: "97.0%",
      weight: "२.३ किलो",
      profit: "रु ४५,००० ",
    },
    {
      name: "ब्याच C-2025",
      survival: "98.0%",
      weight: "२.४ किलो",
      profit: "रु ४८,५००",
    },
    {
      name: "ब्याच E-2025",
      survival: "96.5%",
      weight: "२.२ किलो",
      profit: "रु ४२,८०० ",
    },
  ];

  // Upcoming vaccinations
  const upcomingVaccinations = [
    { batch: "ब्याच F-2025", vaccine: "Newcastle", daysLeft: 2 },
    { batch: "ब्याच G-2025", vaccine: "IBD Booster", daysLeft: 5 },
    { batch: "ब्याच H-2025", vaccine: "Fowl Pox", daysLeft: 8 },
  ];

  // Feed stock alerts
  const feedStock = [
    { type: "स्टार्टर दाना", current: 450, minimum: 500, status: "low" },
    { type: "ग्रोअर दाना", current: 1200, minimum: 800, status: "good" },
    { type: "फिनिसर दाना", current: 350, minimum: 600, status: "critical" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            डैशबोर्ड
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
            <div className="text-3xl font-bold text-gray-900 mb-2">2,070</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+५.२%</span>
              <span className="text-gray-500">गत महिनाभन्दा</span>
            </div>
          </div>

          {/* Total Expense (Lifetime) */}
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
              रु १२.५ लाख
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-red-600" />
              <span className="text-red-600 font-medium">+१५%</span>
              <span className="text-gray-500">यो महिना</span>
            </div>
          </div>

          {/* Total Sales (Lifetime) */}
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
              रु १८.२ लाख
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+८.३%</span>
              <span className="text-gray-500">गत महिनाभन्दा</span>
            </div>
          </div>

          {/* Total Dana Used (Lifetime) */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                कुल दाना प्रयोग
              </span>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-2xl">
                🌾
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ४५,८०० किलो
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">-३.५%</span>
              <span className="text-gray-500">दक्षता सुधार</span>
            </div>
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
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      उच्च मृत्युदर चेतावनी
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      ब्याच D-2025 को मृत्युदर ६.७% पुग्यो
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      कम दाना स्टक
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      केवल ८५० किलो बाँकी, पुनः अर्डर आवश्यक
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      खोप लाग्ने समय
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      ब्याच C-2025 को खोप ३ दिनमा
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      उच्च खर्च
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      यो महिनाको खर्च औसतभन्दा १५% बढी
                    </p>
                  </div>
                </div>
              </div>
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
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
                ))}
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

        {/* Top Performing Batches and Upcoming Vaccinations */}
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
                {topBatches.map((batch, idx) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Vaccinations */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                आगामी खोप तालिका
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingVaccinations.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.batch}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.vaccine}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.daysLeft <= 3
                            ? "bg-red-100 text-red-700"
                            : item.daysLeft <= 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.daysLeft} दिन बाँकी
                      </span>
                    </div>
                  </div>
                ))}
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
