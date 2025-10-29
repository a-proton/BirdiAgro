"use client";

import { useState, useEffect } from "react";
import { getFeedStockSummary } from "@/lib/api/consumption";

interface FeedInventoryRow {
  id: number;
  feedType: string;
  quantityKg: number;
  quantityBuckets: number;
  quantitySacks: number;
  dailyConsumption: number;
  estimatedFinishDate: string | null;
  daysRemaining: number | null;
}

export default function FeedConsumptionTable() {
  const [inventoryData, setInventoryData] = useState<FeedInventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockSummary = async () => {
    try {
      setLoading(true);
      const summary = await getFeedStockSummary();
      setInventoryData(summary);
      setError(null);
    } catch (err) {
      console.error("Error fetching stock summary:", err);
      setError("दाना स्टक जानकारी लोड गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockSummary();

    // Auto-refresh every 30 seconds to show real-time updates
    const interval = setInterval(fetchStockSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (daysRemaining: number | null) => {
    if (daysRemaining === null) return "text-gray-600 bg-gray-50";
    if (daysRemaining <= 10) return "text-red-600 bg-red-50";
    if (daysRemaining <= 20) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusLabel = (daysRemaining: number | null) => {
    if (daysRemaining === null) return "N/A";
    if (daysRemaining <= 10) return "तुरुन्त आदेश गर्नुहोस्";
    if (daysRemaining <= 20) return "चेतावनी";
    return "राम्रो";
  };

  const getFeedTypeLabel = (feedType: string) => {
    const labels: Record<string, string> = {
      B0: "B0 - स्टार्टर",
      B1: "B1 - ग्रोअर",
      B2: "B2 - लेयर",
    };
    return labels[feedType] || feedType;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ab189]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="text-center">
          <p className="text-sm sm:text-base text-red-600">{error}</p>
          <button
            onClick={fetchStockSummary}
            className="mt-4 px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
          >
            फेरि प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          दाना सूची र खपत स्थिति
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          हालको स्टक र दैनिक खपतमा आधारित अनुमानित समाप्ति मिति
        </p>
      </div>

      {inventoryData.length === 0 ? (
        <div className="px-4 sm:px-6 py-8 text-center text-sm sm:text-base text-gray-500">
          कुनै दाना स्टक जानकारी फेला परेन।
        </div>
      ) : (
        <>
          {/* Desktop Table View - Horizontally Scrollable */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    दाना प्रकार
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    हालको स्टक
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    दैनिक खपत
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    स्थिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    बाँकी दिनहरू
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    अनुमानित समाप्ति मिति
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventoryData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getFeedTypeLabel(item.feedType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold">
                          {item.quantitySacks.toFixed(1)} बोरा
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.quantityBuckets.toFixed(1)} बाल्टिन •{" "}
                          {item.quantityKg.toFixed(0)} किलो
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold">
                          {item.dailyConsumption.toFixed(1)} किलो/दिन
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(item.dailyConsumption / 12.5).toFixed(1)} बाल्टिन •{" "}
                          {(item.dailyConsumption / 50).toFixed(2)} बोरा
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          item.daysRemaining
                        )}`}
                      >
                        {getStatusLabel(item.daysRemaining)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.daysRemaining !== null ? (
                        <div className="flex items-center">
                          <span
                            className={`font-semibold ${
                              item.daysRemaining <= 10
                                ? "text-red-600"
                                : item.daysRemaining <= 20
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.daysRemaining} दिन
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.estimatedFinishDate ? (
                        <div>
                          <div className="font-medium">
                            {new Date(
                              item.estimatedFinishDate
                            ).toLocaleDateString("ne-NP", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(
                              item.estimatedFinishDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {inventoryData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {getFeedTypeLabel(item.feedType)}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                      item.daysRemaining
                    )}`}
                  >
                    {getStatusLabel(item.daysRemaining)}
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  {/* Current Stock */}
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500 text-xs mb-1">हालको स्टक</p>
                    <p className="font-semibold text-gray-900">
                      {item.quantitySacks.toFixed(1)} बोरा
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.quantityBuckets.toFixed(1)} बाल्टिन •{" "}
                      {item.quantityKg.toFixed(0)} किलो
                    </p>
                  </div>

                  {/* Daily Consumption */}
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500 text-xs mb-1">दैनिक खपत</p>
                    <p className="font-semibold text-gray-900">
                      {item.dailyConsumption.toFixed(1)} किलो/दिन
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(item.dailyConsumption / 12.5).toFixed(1)} बाल्टिन •{" "}
                      {(item.dailyConsumption / 50).toFixed(2)} बोरा
                    </p>
                  </div>

                  {/* Days Remaining & Finish Date */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 rounded p-2">
                      <p className="text-gray-500 text-xs mb-1">बाँकी दिनहरू</p>
                      {item.daysRemaining !== null ? (
                        <p
                          className={`font-semibold ${
                            item.daysRemaining <= 10
                              ? "text-red-600"
                              : item.daysRemaining <= 20
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.daysRemaining} दिन
                        </p>
                      ) : (
                        <p className="text-gray-400">N/A</p>
                      )}
                    </div>

                    <div className="flex-1 bg-gray-50 rounded p-2">
                      <p className="text-gray-500 text-xs mb-1">समाप्ति मिति</p>
                      {item.estimatedFinishDate ? (
                        <>
                          <p className="font-semibold text-gray-900 text-xs">
                            {new Date(
                              item.estimatedFinishDate
                            ).toLocaleDateString("ne-NP", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(
                              item.estimatedFinishDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-400">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
