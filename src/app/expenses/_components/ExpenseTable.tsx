interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  isPaid: boolean;
  paymentProofName: string | null;
}

export default function ExpenseTable({
  expenses,
  onView,
  onEdit,
}: {
  expenses: Expense[];
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">हालैका खर्च</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                क्र.सं.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                वर्ग
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                खर्चको नाम
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                रकम
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                मिति
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                भुक्तानी माध्यम
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                स्थिति
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                प्रमाण
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                कार्य
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  कुनै खर्च छैन
                </td>
              </tr>
            ) : (
              expenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.category === "kukhura" ? "कुखुरा" : "अन्य"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    रु {expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {expense.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        भुक्तानी भएको
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        बाँकी
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.paymentProofName ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        छ
                      </span>
                    ) : (
                      <span className="text-gray-400">छैन</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(expense)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="हेर्नुहोस्"
                      >
                        हेर्नुहोस्
                      </button>
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="सम्पादन गर्नुहोस्"
                      >
                        सम्पादन गर्नुहोस्
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
