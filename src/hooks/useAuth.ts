// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      // Get current session from Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && requireAuth) {
        // No session and auth is required - redirect to login
        router.push("/login");
        return;
      }

      if (session) {
        // Check localStorage for user data
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Fetch user data if not in localStorage
          const { data: userData } = await supabase
            .from("users")
            .select("id, name, email, role")
            .eq("id", session.user.id)
            .single();

          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("user");
        setUser(null);
        if (requireAuth) {
          router.push("/login");
        }
      } else if (event === "SIGNED_IN" && session) {
        const { data: userData } = await supabase
          .from("users")
          .select("id, name, email, role")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, requireAuth, supabase]);

  return { user, isLoading };
}
