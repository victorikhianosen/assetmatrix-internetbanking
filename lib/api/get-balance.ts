export async function fetchBalance() {
  const res = await fetch("/api/balance", {
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // sends cookies automatically
  });

  if (!res.ok) {
    throw new Error("Failed to fetch balance");
  }
  

  return res.json();
}