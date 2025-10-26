"use client";

import { useState, useEffect } from "react";
import { getFeedStockSummary } from "@/lib/api/consumption";

interface FeedInventoryRow {
  id: number;
  feedType: string;
  quantityKg: number;
  quantityBuckets: number;
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
  }, []);

  const getStatusColor = (daysRemaining: number | null) => {
    if (daysRemaining === null) return "text-gray-600 bg-gray-50";
    if (daysRemaining <= 10) return "text-red-600 bg-red-50";
    if (daysRemaining <= 20) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  const getFeedTypeLabel = (feedType: string) => {
    const labels: Record<string, string> = {
      B0: "B0 - Starter",
      B1: "B1 - Grower",
      B2: "B2 - Layer",
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
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                दाना प्रकार
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                मात्रा (किलो)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                बाल्टिनहरू
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                दैनिक खपत
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getFeedTypeLabel(item.feedType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantityKg.toLocaleString()} (किलो)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.quantityBuckets.toFixed(1)} बाल्टिनहरू
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.dailyConsumption} किलो प्रति दिन
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                        item.daysRemaining
                      )}`}
                    >
                      {item.daysRemaining !== null
                        ? `${item.daysRemaining} दिनहरू`
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.estimatedFinishDate
                      ? new Date(item.estimatedFinishDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
