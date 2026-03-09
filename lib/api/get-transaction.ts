import { smartFetch } from "@/lib/smartFetch";


export async function fetchTransactions() {
  const res = await smartFetch("/api/transaction", {
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // sends cookies automatically
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
}