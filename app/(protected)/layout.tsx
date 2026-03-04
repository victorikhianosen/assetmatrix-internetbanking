"use client";

import AppHeader from "@/components/header/AppHeader";
import { UseUser } from "@/context/UserContext";
import { UseGetUserDetails } from "@/hooks/useUserDetails";
import Providers from "@/providers/contextProvider";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ProtectedContent>{children}</ProtectedContent>
    </Providers>
  );
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { setUser } = UseUser();
  const { data } = UseGetUserDetails();

  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}