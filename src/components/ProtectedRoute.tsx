// src/components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ab189] mx-auto"></div>
          <p className="mt-4 text-gray-600">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
