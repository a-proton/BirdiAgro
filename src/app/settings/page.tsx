"use client";

import { Plus, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ram Thapa",
      email: "abinasgautam344@gmail.com",
      role: "Admin",
    },
    { id: 2, name: "Sita Sharma", email: "sita@example.com", role: "Staff" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Staff",
    password: "",
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const user = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "Staff", password: "" });
    setIsAdding(false);
  };

  const handleDeleteUser = (id: number) => {
    if (users.length <= 1) {
      alert("अन्तिम प्रयोगकर्ता मेटाउन सकिँदैन!");
      return;
    }
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          सेटिङ्स
        </h1>
        <p className="text-gray-600 mt-1">
          प्रयोगकर्ता र प्रणाली प्राथमिकताहरू व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      {/* Add User Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            नयाँ प्रयोगकर्ता थप्नुहोस्
          </h2>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
          >
            {isAdding ? "रद्द गर्नुहोस्" : "प्रयोगकर्ता थप्नुहोस्"}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पूर्ण नाम
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="जस्तै: राम थापा"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  इमेल
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="ram@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भूमिका
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                >
                  <option value="Admin">व्यवस्थापक</option>
                  <option value="Staff">स्टाफ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पासवर्ड
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                प्रयोगकर्ता सिर्जना गर्नुहोस्
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Existing Users Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            हालका प्रयोगकर्ता
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  नाम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  इमेल
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  भूमिका
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  कार्यहरू
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "Admin" ? "व्यवस्थापक" : "स्टाफ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-[#1ab189] rounded hover:bg-gray-100">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 rounded hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
