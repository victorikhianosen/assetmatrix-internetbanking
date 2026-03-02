"use client";

import SettingsGroup from "./settingsGroup";
import { User, Lock, KeyRound } from "lucide-react";

export default function SettingsSection() {
  return (
    <div className="space-y-10">

      {/* PROFILE */}
      <SettingsGroup
        title="Profile"
        items={[
          {
            label: "View Profile",
            description: "See your personal information",
            href: "/settings/profile/view-profile",
            icon: User,
            color: "#1D4ED8",
          },
          {
            label: "Edit Profile",
            description: "Update your personal information",
            href: "/settings/profile/edit-profile",
            icon: User,
            color: "#16A34A",
          },
        ]}
      />

      {/* SECURITY */}
      <SettingsGroup
        title="Security"
        items={[
          {
            label: "Change Password",
            description: "Update your password",
            href: "/settings/security/password",
            icon: Lock,
            color: "#F59E0B",
          },
          {
            label: "Change PIN",
            description: "Update your transaction PIN",
            href: "/settings/security/pin",
            icon: KeyRound,
            color: "#DC2626",
          },
        ]}
      />
    </div>
  );
}
