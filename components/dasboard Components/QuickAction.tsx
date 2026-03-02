"use client";

import React from "react";
import Link from "next/link";
import { Landmark, Phone, Wallet, Wifi } from "lucide-react";

export default function QuickAction() {
  const actions = [
    {
      label: "To Pakasso",
      color: "#B59F10",
      bgColor: "#FEF3C7", 
      href: "/transfer/wallet-transfer",
      icon: Wallet,
    },
    {
      label: "To Bank",
      color: "#14532D",
      bgColor: "#DCFCE7",
      href: "/transfer/bank-transfer",
      icon: Landmark,
    },
    {
      label: "Buy Airtime",
      color: "#1E40AF",
      bgColor: "#DBEAFE",
      href: "/bills/airtime",
      icon: Phone,
    },
    {
      label: "Buy Data",
      color: "#9B021C",
      bgColor: "#FEE2E2",
      href: "/bills/data",
      icon: Wifi,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-2xl p-5 text-center hover:shadow-md transition cursor-pointer"
          >
            <div
              style={{ backgroundColor: item.bgColor }}
              className="mx-auto w-15 h-15 mb-3 rounded-full flex items-center justify-center"
            >
              <IconComponent size={30} color={item.color} />
            </div>
            <p className="font-medium text-primary">{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
}