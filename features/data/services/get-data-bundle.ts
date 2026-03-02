export async function fetchDataBundles(network: string) {
  const res = await fetch("/api/bill/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ network }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data bundles");
  }

  return res.json();
}