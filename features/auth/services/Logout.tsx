"use client";

import { useRouter } from "next/navigation";
import { serverLogout } from "../../../app/actions/auth/login/logout.action";
import { UseUser } from "../../../context/UserContext";
import { LogOut } from "lucide-react";

export default function Logout() {
  const router = useRouter();
  const { clearUser } = UseUser();

  async function handleLogout() {
    serverLogout();
    localStorage.clear();
    router.replace("/login");
    clearUser();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="cursor-pointer flex items-center rounded-2xl w-full text-left px-4 py-3 text-red-600 hover:bg-[#F7F7F7]">
      <LogOut className="mr-2 h-5 w-5"/>Log out
    </button>
  );
}
