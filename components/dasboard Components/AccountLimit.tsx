"use client";

import React, { useMemo } from "react";

type Transaction = {
  amount: number | string;
};

type Props = {
  transactions?: Transaction[];
};

export default function AccountLimit({ transactions = [] }: Props) {
  const stats = useMemo(() => {
    if (!transactions.length) return null;

    const amounts = transactions
      .map((t) => Number(t.amount))
      .filter((n) => !isNaN(n));

    if (!amounts.length) return null;

    return {
      highest: Math.max(...amounts),
      lowest: Math.min(...amounts),
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LIMIT CARD */}
      <div className="bg-primary text-white rounded-3xl p-6 space-y-3">
        <p className="text-sm opacity-80">Account limit</p>
        <p className="text-2xl font-semibold">Unlimited</p>
      </div>

      {/* STATS */}
      <div className="md:col-span-2 bg-white rounded-2xl p-6 hidden md:block">
        <h3 className="font-semibold mb-4 text-primary">
          Transaction Stats
        </h3>

        <div className="space-y-3">
          <Row
            label="Highest Transaction"
            value={stats?.highest ?? 0}
          />
          <Row
            label="Lowest Transaction"
            value={stats?.lowest ?? 0}
          />
        </div>
      </div>
    </div>
  );
}

type RowProps = {
  label: string;
  value: number | string;
};

function Row({ label, value }: RowProps) {
  return (
    <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
      <span>{label}</span>
      <span className="font-semibold">
        ₦{Number(value).toLocaleString()}
      </span>
    </div>
  );
}
