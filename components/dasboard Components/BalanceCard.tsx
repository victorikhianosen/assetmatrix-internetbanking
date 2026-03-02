"use client";

import { UseUser } from "@/context/UserContext";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UseGetUserDetails } from "@/hooks/useUserDetails";

type Props = {
  balance: string;
  loading?: boolean;
};

export default function BalanceCard({ balance, loading = false }: Props) {
  const { user, setUser } = UseUser();
  const { data } = UseGetUserDetails();
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  const toggleBalance = () => {
    setBalanceVisible((prev) => !prev);
  };

  const copyAccount = async () => {
    if (!user?.accountno) {
      toast.error("Account number not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(user.accountno);
      toast.success("Copied ✓");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="rounded-3xl bg-linear-to-br from-primary to-[#1f272f] text-white p-8 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1 space-y-6">
          <p className="text-sm opacity-80">Available Balance</p>

          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {loading
                ? "Loading..."
                : balanceVisible
                ? `${user?.currency ?? "₦"}${balance}`
                : "•••••••"}
            </h1>

            <button onClick={toggleBalance}>
              {balanceVisible ? (
                <EyeOff size={28} />
              ) : (
                <Eye size={28} />
              )}
            </button>
          </div>

          <Link
            href="/bank-transfer"
            className="inline-block bg-yellow-400 text-primary px-6 py-2 rounded-xl font-semibold"
          >
            Transfer
          </Link>
        </div>

        <div className="relative rounded-2xl lg:p-6 p-0 min-w-65 space-y-4">
          <button
            onClick={copyAccount}
            className="absolute lg:top-0 top-3 lg:right-4 right-0 text-xs bg-white/20 px-3 py-1.5 rounded-lg"
          >
            Copy
          </button>

          <div>
            <p className="text-xs opacity-70">Account Name</p>
            <p className="font-semibold capitalize">
              {user?.first_name ?? "—"} {user?.last_name ?? ""}
            </p>
          </div>

          <div>
            <p className="text-xs opacity-70">Account Number</p>
            <p className="font-semibold tracking-wider">
              {user?.accountno ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs opacity-70">Bank</p>
            <p className="font-semibold">Asset Matrix MFB</p>
          </div>
        </div>
      </div>
    </div>
  );
}