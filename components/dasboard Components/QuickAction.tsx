"use client";

import React from "react";
import Link from "next/link";
import { Cable, Landmark, Phone, Wallet, Wifi } from "lucide-react";

export default function QuickAction() {
  const actions = [
    {
      label: "To Assetmatrix",
      color: "#EE8520",
      bgColor: "#EE852025", 
      href: "/transfer/wallet-transfer",
      icon: Wallet,
    },
    {
      label: "To Bank",
       color: "#EE8520",
      bgColor: "#EE852025",
      href: "/transfer/bank-transfer",
      icon: Landmark,
    },
    {
      label: "Airtime",
       color: "#EE8520",
      bgColor: "#EE852025",
      href: "/bills/airtime",
      icon: Phone,
    },
    {
      label: "Data",
       color: "#EE8520",
      bgColor: "#EE852025",
      href: "/bills/data",
      icon: Wifi,
    },
    {
      label: "Cable",
       color: "#EE8520",
      bgColor: "#EE852025",
      href: "/bills/cable",
      icon: Cable,
    },
    // {
    //   label: "Electricity",
    //    color: "#EE8520",
    //   bgColor: "#EE852025",
    //   href: "/bills/electricity",
    //   icon: Lightbulb,
    // },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-2xl lg:p-5 p-4 text-center hover:shadow-md hover:-translate-x-1 transition cursor-pointer"
          >
            <div
              style={{ backgroundColor: item.bgColor }}
              className="mx-auto lg:w-15 w-13 lg:h-15 h-13 mb-3 rounded-full flex items-center justify-center"
            >
              <IconComponent className="lg:h-8 lg:w-8 w-7 h-7" color={item.color} />
            </div>
            <p className="text-secondary">{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
}