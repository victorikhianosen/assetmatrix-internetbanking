export async function fetchUserDetails() {
  const res = await fetch("/api/user", {
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // sends cookies automatically
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }

  return res.json();
}