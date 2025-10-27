"use client";

import { Eye, Edit2, Trash2 } from "lucide-react";
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
      // Use a simple format that works on both server and client
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
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">हालैको बिक्री</h2>
      </div>
      <div className="overflow-x-auto">
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
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="हेर्नुहोस्"
                      >
                        हेर्नुहोस्
                      </button>
                      <button
                        onClick={() => onEdit(sale)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
    </div>
  );
}
