"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import SettingsSection from "../../../features/settings/components/SettingsSection";

export default function SettingsPage() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 mb-4 text-sm font-medium text-primary hover:-translate-x-1 transition">
        <ArrowLeft size={18} />
        Back
      </button>
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-700">Manage your account preferences and security</p>
      </div>
      <SettingsSection />
    </div>
  );
}
