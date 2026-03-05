export async function fetchCable(cable: string) {
  const res = await fetch(`/api/bill/cable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ cable }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return res.json();
}