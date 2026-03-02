"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

type Item = {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  description: string;
};

export default function SettingsGroup({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="space-y-4">
      {/* Section Heading */}
      <h2 className="text-lg font-semibold text-primary">{title}</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white rounded-2xl p-4 hover:shadow-md transition border border-gray-100 group flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition group-hover:scale-110"
                style={{ backgroundColor: `${item.color}20` }}>
                <Icon size={22} color={item.color} />
              </div>

              <div className="flex flex-col">
                <p className="font-medium text-primary text-lg group-hover:text-black transition">
                  {item.label}
                </p>
                <p className="text-gray-500 group-hover:text-black transition">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
