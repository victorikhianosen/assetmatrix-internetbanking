export async function fetchTransactionReceipt(referenceNo: string) {
  const res = await fetch(`/api/transaction/receipt?reference_no=${referenceNo}`, {
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