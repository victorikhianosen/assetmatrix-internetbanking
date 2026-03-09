import { UseUser } from "@/context/UserContext";
import { serverLogout } from "../../app/actions/auth/login/logout.action";
import { toast } from "react-toastify";
import { smartFetch } from "@/lib/smartFetch";


const logout = () => {
  localStorage.removeItem("access_token");
  toast.success("Logout successfully");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
  const { clearUser } = UseUser();
  clearUser();
  serverLogout();
};

export async function fetchBalance() {
  const res = await smartFetch("/api/balance", {
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
