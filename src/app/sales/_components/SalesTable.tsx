"use client";

import { Sale } from "@/lib/api/sales";

interface SalesTableProps {
  salesData: Sale[];
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (id: number) => void;
}

export default function SalesTable({
  salesData,
  onView,
  onEdit,
  onDelete,
}: SalesTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          हालैको बिक्री
        </h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                क्रम संख्या
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                प्रकार
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ब्याच/उत्पादन नाम
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ग्राहक
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                कुल किलोग्राम
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                कुल रकम
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                भुक्तानी स्थिति
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                मिति
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                कार्यहरू
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salesData.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  कुनै बिक्री डाटा उपलब्ध छैन
                </td>
              </tr>
            ) : (
              salesData.map((sale, index) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sale.type === "kukhura" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e8f8f7] text-[#1ab189]">
                        कुखुरा
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        अन्य
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.type === "kukhura"
                      ? sale.batchName
                      : sale.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.soldTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.totalKgs} कि.ग्रा
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    रु{" "}
                    {parseFloat(sale.totalAmount || "0").toLocaleString(
                      "ne-NP"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sale.amountReceived ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        प्राप्त
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        बाँकी
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(sale.salesDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(sale)}
                        className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="हेर्नुहोस्"
                      >
                        हेर्नुहोस्
                      </button>
                      <button
                        onClick={() => onEdit(sale)}
                        className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="सम्पादन गर्नुहोस्"
                      >
                        सम्पादन
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {salesData.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            कुनै बिक्री डाटा उपलब्ध छैन
          </div>
        ) : (
          salesData.map((sale, index) => (
            <div key={sale.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    {sale.type === "kukhura" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#e8f8f7] text-[#1ab189]">
                        कुखुरा
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        अन्य
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {sale.type === "kukhura"
                      ? sale.batchName
                      : sale.productName}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">
                    ग्राहक: {sale.soldTo}
                  </p>
                </div>
                {sale.amountReceived ? (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                    प्राप्त
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 whitespace-nowrap">
                    बाँकी
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <span className="text-gray-600">कुल किलोग्राम:</span>
                  <p className="font-medium text-gray-900">
                    {sale.totalKgs} कि.ग्रा
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">कुल रकम:</span>
                  <p className="font-medium text-gray-900">
                    रु{" "}
                    {parseFloat(sale.totalAmount || "0").toLocaleString(
                      "ne-NP"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                <span>मिति: {formatDate(sale.salesDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(sale)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  हेर्नुहोस्
                </button>
                <button
                  onClick={() => onEdit(sale)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  सम्पादन
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
