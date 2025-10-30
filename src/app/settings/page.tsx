// src/app/settings/page.tsx
"use client";

import { Plus, Trash2, Edit3, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Staff";
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Staff" as "Admin" | "Staff",
    password: "",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "Staff" as "Admin" | "Staff",
    password: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.push("/login");
    };
    checkAuth();
  }, [router, supabase]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setUsers(data as User[]);
    }
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("त्रुटि: " + (data.error || "प्रयोगकर्ता थप्न सकिएन"));
        return;
      }

      await fetchUsers();
      setNewUser({ name: "", email: "", role: "Staff", password: "" });
      setIsAdding(false);
      alert("प्रयोगकर्ता सफलतापूर्वक थपियो!");
    } catch (err) {
      console.error(err);
      alert("अज्ञात त्रुटि");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (users.length <= 1) {
      alert("अन्तिम प्रयोगकर्ता मेटाउन सकिँदैन!");
      return;
    }

    if (!confirm("के तपाईं निश्चित हुनुहुन्छ?")) return;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("मेटाउन सकिएन");
    } else {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({ ...user, password: "" });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare update data - only include fields that have values
    const updatePayload: any = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    };

    // Only include password if it's been entered
    if (editForm.password && editForm.password.trim() !== "") {
      updatePayload.password = editForm.password;
    }

    try {
      const res = await fetch(`/api/users/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("त्रुटि: " + (data.error || "प्रयोगकर्ता अपडेट गर्न सकिएन"));
        return;
      }

      await fetchUsers();
      setEditingUser(null);
      setEditForm({ id: "", name: "", email: "", role: "Staff", password: "" });
      alert("प्रयोगकर्ता सफलतापूर्वक अपडेट गरियो!");
    } catch (err) {
      console.error("Update error:", err);
      alert("अज्ञात त्रुटि");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          सेटिङ्स
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          प्रयोगकर्ता व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      {/* Add User */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            नयाँ प्रयोगकर्ता थप्नुहोस्
          </h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1ab189] text-white text-sm sm:text-base rounded-lg hover:bg-[#158f6f] transition-colors"
          >
            {isAdding ? "रद्द गर्नुहोस्" : "प्रयोगकर्ता थप्नुहोस्"}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
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
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भूमिका
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
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
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-[#1ab189] text-white text-sm sm:text-base rounded-lg hover:bg-[#158f6f] flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                प्रयोगकर्ता सिर्जना गर्नुहोस्
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold">
                प्रयोगकर्ता सम्पादन गर्नुहोस्
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  नाम
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  इमेल
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  भूमिका
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
                >
                  <option value="Admin">व्यवस्थापक</option>
                  <option value="Staff">स्टाफ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पासवर्ड (फेर्न चाहनुहुन्छ भने)
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
                >
                  अपडेट गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            हालका प्रयोगकर्ता
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-sm sm:text-base text-gray-500">
            लोड हुँदैछ...
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      नाम
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      इमेल
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      भूमिका
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
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
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role === "Admin" ? "व्यवस्थापक" : "स्टाफ"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 text-gray-500 hover:text-[#1ab189] rounded hover:bg-gray-100 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 text-gray-500 hover:text-red-500 rounded hover:bg-gray-100 transition-colors"
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                        user.role === "Admin"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "Admin" ? "व्यवस्थापक" : "स्टाफ"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      सम्पादन
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      मेटाउनुहोस्
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
