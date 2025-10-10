export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Farm Information */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Farm Information
          </h2>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Name
              </label>
              <input
                type="text"
                defaultValue="BirdiAgro Farm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name
              </label>
              <input
                type="text"
                defaultValue="Ram Sharma"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                defaultValue="Kathmandu, Nepal"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                defaultValue="+977 9841234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="info@birdiagro.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Notification Preferences
          </h2>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
              />
              <span className="text-sm text-gray-700">
                Email notifications for low stock alerts
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
              />
              <span className="text-sm text-gray-700">
                SMS alerts for critical updates
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
              />
              <span className="text-sm text-gray-700">Daily sales report</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-[#1ab189] rounded focus:ring-[#1ab189]"
              />
              <span className="text-sm text-gray-700">
                Weekly inventory summary
              </span>
            </label>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors font-medium"
            >
              Update Preferences
            </button>
          </form>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            System Settings
          </h2>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all">
                <option>NPR (Nepali Rupee)</option>
                <option>USD (US Dollar)</option>
                <option>INR (Indian Rupee)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all">
                <option>YYYY-MM-DD</option>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:border-transparent outline-none transition-all">
                <option>English</option>
                <option>नेपाली (Nepali)</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors font-medium"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
