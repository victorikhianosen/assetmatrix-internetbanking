"use client";

import Image from "next/image";
import { useState } from "react";
import Logout from "@/features/auth/services/Logout";
import Link from "next/link";
import { UseUser } from "@/context/UserContext";

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = UseUser();
  const firstName = user?.first_name;

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={120}
            height={32}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="cursor-pointer flex items-center gap-2 bg-[#F7F7F7] text-primary px-4 py-2 rounded-xl text-sm">
              {/* Stable render for SSR + CSR */}
              <span className="flex items-center gap-2">
                {user?.profilepic ? (
                  <Image
                    src={user.profilepic}
                    alt="Passport Preview"
                    width={100}
                    height={100}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 p-1 font-semibold rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.last_name?.[0] || ""}
                    {user?.first_name?.[0] || ""}
                  </div>
                )}
                {firstName ?? "User"}
              </span>

              <svg
                className="w-4 h-4 opacity-70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 mt-3 w-52 rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]
              transition-all origin-top-right z-50
              ${
                menuOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}>
              <div className="py-2 text-sm text-primary w-full">
                <Link href="/settings/profile/view-profile">
                  <button
                    className="rounded-2xl cursor-pointer w-full text-left px-4 py-3 hover:bg-[#F7F7F7]"
                    onClick={() => setMenuOpen(false)}>
                    Profile
                  </button>
                </Link>

                <Link href="/settings">
                  <button
                    className="rounded-2xl cursor-pointer w-full text-left px-4 py-3 hover:bg-[#F7F7F7] "
                    onClick={() => setMenuOpen(false)}>
                    Settings
                  </button>
                </Link>

                <Link href="/notifications">
                  <button
                    className="rounded-2xl cursor-pointer w-full text-left px-4 py-3 hover:bg-[#F7F7F7] md:hidden"
                    onClick={() => setMenuOpen(false)}>
                    Notification
                  </button>
                </Link>

                <Logout />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
