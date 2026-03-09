"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/header/AppHeader";
import { UseUser } from "@/context/UserContext";
import { UseGetUserDetails } from "@/hooks/useUserDetails";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedContent>{children}</ProtectedContent>;
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { setUser } = UseUser();
  const { data } = UseGetUserDetails();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);

    if (!storedToken) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  if (token === null) return null;

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}