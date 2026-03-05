import { UseUser } from "@/context/UserContext";
import { serverLogout } from "../../app/actions/auth/login/logout.action";

 const logout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
  const {clearUser} = UseUser();
  clearUser();
  serverLogout()
};

export async function fetchBalance() {
  const res = await fetch("/api/balance", {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  // Status-based logout (PRIMARY)
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error("Session expired");
  }

  //  Parse response ONCE
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch balance");
  }

  return data;
}
