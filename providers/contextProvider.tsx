"use client";
import { UserProvider } from "../context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import  NetworkProvider  from "../context/NetworkContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <UserProvider>{children}</UserProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}
