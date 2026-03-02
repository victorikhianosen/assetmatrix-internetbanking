"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  ArrowLeft,
  CalendarDays,
  UserLock,
  ScanQrCode,
  SquareUserRound,
} from "lucide-react";
import { User as UserType } from "@/types/user.types";
import Image from "next/image";
import { UseUser } from "@/context/UserContext";

export default function ViewProfilePage() {
  const { user } = UseUser() as { user: UserType | null };


  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileDetails user={user} />
      </div>
    </div>
  );
}

function ProfileHeader({ user }: { user: UserType | null }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 mb-4 text-sm font-medium text-primary hover:-translate-x-1 transition">
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-[#1f272f] text-white p-10 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold">
              {user?.profilepic ? (
                <Image
                  src={user.profilepic}
                  alt="Profile Picture"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <>
                  {user?.last_name?.[0] || ""}
                  {user?.first_name?.[0] || "U"}
                </>
              )}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold capitalize tracking-tight">
              {user?.first_name} {user?.last_name}
            </h1>

            <p className="opacity-80 text-sm mt-1">{user?.email}</p>

            <Link
              href="/settings/profile/edit-profile"
              className="inline-block mt-4 bg-white text-primary px-5 py-2 rounded-xl text-sm font-semibold hover:scale-95 transition">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileDetails({ user }: { user: UserType | null }) {
  return (
    <div className="md:col-span-2 bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-primary mb-6 text-lg">Personal Information</h3>

      <div className="divide-y">
        <Row icon={<User size={18} />} label="Full Name">
          {user?.first_name} {user?.last_name}
        </Row>

        <Row icon={<CalendarDays size={18} />} label="Date of Birth">
          {user?.dob || "—"}
        </Row>

        <Row icon={<Mail size={18} />} label="Email">
          {user?.email || "—"}
        </Row>

        <Row icon={<Phone size={18} />} label="Phone">
          {user?.phone || "—"}
        </Row>

        <Row icon={<CreditCard size={18} />} label="Account Number">
          {user?.accountno || "—"}
        </Row>

        <Row icon={<Shield size={18} />} label="BVN">
          {user?.bvn || "—"}
        </Row>

        {user?.nin && (
          <Row icon={<UserLock size={18} />} label="NIN">
            {user?.nin || "—"}
          </Row>
        )}

        <Row icon={<SquareUserRound size={18} />} label="Gender">
          {user?.sex || "—"}
        </Row>

        {user?.address && (
          <Row icon={<Shield size={18} />} label="Address">
            {user?.address || "—"}
          </Row>
        )}

        <Row icon={<ScanQrCode size={18} />} label="Referral Code">
          {user?.referral || "—"}
        </Row>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        {icon}
        {label}
      </div>
      <span className="font-medium text-primary text-sm">{children}</span>
    </div>
  );
}
