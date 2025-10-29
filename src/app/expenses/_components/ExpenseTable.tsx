interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  isPaid: boolean;
  paymentProofName: string | null;
  paymentProofPath: string | null;
  batch: string;
}

export default function ExpenseTable({
  expenses,
  onView,
  onEdit,
  onDelete,
}: {
  expenses: Expense[];
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          हालैका खर्च
        </h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
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
                ब्याच
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
                <td
                  colSpan={10}
                  className="px-6 py-8 text-center text-gray-500"
                >
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
                    {expense.batch}
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
                        className="px-2 py-1 text-xs hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="हेर्नुहोस्"
                      >
                        हेर्नुहोस्
                      </button>
                      <button
                        onClick={() => onEdit(expense)}
                        className="px-2 py-1 text-xs hover:bg-green-50 text-green-600 rounded transition-colors"
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
        {expenses.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            कुनै खर्च छैन
          </div>
        ) : (
          expenses.map((expense, idx) => (
            <div key={expense.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      #{idx + 1}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {expense.category === "kukhura" ? "कुखुरा" : "अन्य"}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {expense.title}
                  </h3>
                  {expense.batch && expense.batch !== "----" && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      ब्याच: {expense.batch}
                    </p>
                  )}
                </div>
                {expense.isPaid ? (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                    भुक्तानी भएको
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
                    बाँकी
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <span className="text-gray-600">रकम:</span>
                  <p className="font-semibold text-gray-900">
                    रु {expense.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">मिति:</span>
                  <p className="font-medium text-gray-900">{expense.date}</p>
                </div>
                <div>
                  <span className="text-gray-600">भुक्तानी माध्यम:</span>
                  <p className="font-medium text-gray-900">{expense.method}</p>
                </div>
                <div>
                  <span className="text-gray-600">प्रमाण:</span>
                  <p className="font-medium text-gray-900">
                    {expense.paymentProofName ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        छ
                      </span>
                    ) : (
                      <span className="text-gray-400">छैन</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(expense)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  हेर्नुहोस्
                </button>
                <button
                  onClick={() => onEdit(expense)}
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
