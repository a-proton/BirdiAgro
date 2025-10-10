import { Plus, TrendingUp } from "lucide-react";

export default function PoultryPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Kukhura Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your poultry birds and flocks
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            <span>Healthy flock</span>
          </div>
        </div>

        {/* Layers */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Layers
            </span>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl">
              🥚
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1,200</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>95% production rate</span>
          </div>
        </div>

        {/* Broilers */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Broilers
            </span>
            <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center text-xl">
              🍗
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1,250</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>Ready in 2 weeks</span>
          </div>
        </div>
      </div>

      {/* Flock Details Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Flock Details</h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors">
            <Plus className="w-4 h-4" />
            Add New Flock
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Flock ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Age (weeks)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  FL-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Layer
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  600
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  24
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Healthy
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Shed A
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  FL-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Layer
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  600
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  22
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Healthy
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Shed B
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  FL-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Broiler
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  650
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  4
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Healthy
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Shed C
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  FL-004
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Broiler
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  600
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  5
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    Monitor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Shed D
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
