import { TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Overview of your poultry farm operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Birds */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Total Birds
            </span>
            <div className="w-10 h-10 bg-[#e8f8f7] text-[#1ab189] rounded-lg flex items-center justify-center text-xl">
              🐔
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">2,450</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>12% from last month</span>
          </div>
        </div>

        {/* Feed Stock */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Feed Stock
            </span>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl">
              🌾
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">850 kg</div>
          <div className="flex items-center gap-1 text-sm text-red-600">
            <TrendingDown className="w-4 h-4" />
            <span>5% from last week</span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Todays Sales
            </span>
            <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center text-xl">
              💰
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">Rs 45,200</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>8% from yesterday</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Active Orders
            </span>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              📦
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>3 new orders</span>
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activities
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  10:30 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Feed stock updated
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Ram Sharma
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  09:15 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  New sale recorded
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Sita Devi
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  08:45 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Bird count updated
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Hari Bahadur
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    In Progress
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
