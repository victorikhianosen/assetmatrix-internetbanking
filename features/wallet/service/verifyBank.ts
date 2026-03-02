export async function verifyBankAccount(payload: {
  account_number: string;
  bank_code: string;
}) {
  const token = localStorage.getItem("access_token");

//   if (!token) {
//     throw new Error("User not logged in");
//   }

  const res = await fetch("/api/transfers/verify-bank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Verification failed");
  }

  return token;
}
