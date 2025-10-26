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
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ab189]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchStockSummary}
            className="mt-4 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f]"
          >
            फेरि प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          दाना सूची र खपत स्थिति
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          हालको स्टक र दैनिक खपतमा आधारित अनुमानित समाप्ति मिति
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
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
            {inventoryData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  कुनै दाना स्टक जानकारी फेला परेन।
                </td>
              </tr>
            ) : (
              inventoryData.map((item) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {inventoryData.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                कुल बोरा स्टक
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {inventoryData
                  .reduce((sum, item) => sum + item.quantitySacks, 0)
                  .toFixed(1)}{" "}
                बोरा
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                कुल दैनिक खपत
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {inventoryData
                  .reduce((sum, item) => sum + item.dailyConsumption, 0)
                  .toFixed(1)}{" "}
                किलो
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                कुल किलो स्टक
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {inventoryData
                  .reduce((sum, item) => sum + item.quantityKg, 0)
                  .toFixed(0)}{" "}
                किलो
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
