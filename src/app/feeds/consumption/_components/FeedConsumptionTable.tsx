"use client";

interface FeedInventoryRow {
  id: number;
  feedType: string;
  quantityKg: number;
  quantityBuckets: number;
  dailyConsumption: number;
  estimatedFinishDate: string;
  daysRemaining: number;
}

const inventoryData: FeedInventoryRow[] = [
  {
    id: 1,
    feedType: "B0 - Starter",
    quantityKg: 1250,
    quantityBuckets: 100,
    dailyConsumption: 25,
    estimatedFinishDate: "2024-12-15",
    daysRemaining: 50,
  },
  {
    id: 2,
    feedType: "B1 - Grower",
    quantityKg: 1250,
    quantityBuckets: 100,
    dailyConsumption: 45,
    estimatedFinishDate: "2024-11-25",
    daysRemaining: 28,
  },
  {
    id: 3,
    feedType: "B2 - Layer",
    quantityKg: 1250,
    quantityBuckets: 100,
    dailyConsumption: 60,
    estimatedFinishDate: "2024-11-18",
    daysRemaining: 21,
  },
];

export default function FeedConsumptionTable() {
  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 10) return "text-red-600 bg-red-50";
    if (daysRemaining <= 20) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

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
            {inventoryData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.feedType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantityKg.toLocaleString()} (किलो)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.quantityBuckets} बाल्टिनहरू
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
                    {item.daysRemaining} दिनहरू
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(item.estimatedFinishDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
