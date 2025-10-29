// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        console.error("User lookup error:", userError);
        setError("डाटाबेस त्रुटि। कृपया पुन: प्रयास गर्नुहोस्।");
        setLoading(false);
        return;
      }

      if (!userData) {
        setError("इमेल वा पासवर्ड गलत छ।");
        setLoading(false);
        return;
      }

      // Then authenticate with Supabase Auth
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);

        if (authError.message.includes("Invalid login credentials")) {
          setError("इमेल वा पासवर्ड गलत छ।");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("इमेल पुष्टि गरिएको छैन।");
        } else {
          setError("लगइन गर्न असफल। कृपया पुन: प्रयास गर्नुहोस्।");
        }
        setLoading(false);
        return;
      }

      if (!session) {
        setError("सेशन सिर्जना गर्न असफल भयो।");
        setLoading(false);
        return;
      }

      // Verify the auth user ID matches the users table ID
      if (session.user.id !== userData.id) {
        console.error("ID mismatch:", {
          authId: session.user.id,
          dbId: userData.id,
        });
        setError("खाता बेमेल छ। कृपया व्यवस्थापकलाई सम्पर्क गर्नुहोस्।");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(userData));
      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("अप्रत्याशित त्रुटि। कृपया पुन: प्रयास गर्नुहोस्।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          लगइन गर्नुहोस्
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              इमेल
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
              placeholder="ram@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              पासवर्ड
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ab189] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors disabled:opacity-70"
          >
            {loading ? "लगइन हुँदैछ..." : "लगइन गर्नुहोस्"}
          </button>
        </form>
      </div>
    </div>
  );
}
