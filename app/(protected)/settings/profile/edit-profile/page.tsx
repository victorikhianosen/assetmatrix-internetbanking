"use client";

import { useRouter } from "next/navigation";
import { UseUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { UpdateProfile } from "@/app/actions/settings/profile/update-profile";
import { UploadFile } from "@/app/actions/settings/profile/update-file";

import Input from "@/components/ui/input";
import { toast } from "react-toastify";
import { User as UserType } from "@/types/user.types";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProfilePage() {
  const { user } = UseUser();
  const [form, setForm] = useState<UserType | null>(null);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleChange = (key: keyof UserType, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const payload = {
      gender: form.sex,
      address: form.address,
      nin: form.nin,
      dob: form.dob,
      phone_number: form.phone,
      email: form.email,
      bvn: form.bvn,
    };

    setSaving(true);

    try {
      const res = await UpdateProfile(payload);

      if (res.responseCode === "000") {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        toast.error(res.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // Prevent render crash
  if (!form) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <EditHeader user={form} />
      <form onSubmit={handleSubmit}>
        <EditDetails form={form} onChange={handleChange} saving={saving} />
      </form>
    </div>
  );
}

function EditHeader({ user }: { user: UserType }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPassportPreview(previewUrl);

    setUploading(true);

    try {
      const res = await UploadFile(file, "passport");

      if (res.responseCode === "000") {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        toast.error(res.message);
        setPassportPreview(null);
      }
    } catch {
      toast.error("Upload failed");
      setPassportPreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (passportPreview) {
        URL.revokeObjectURL(passportPreview);
      }
    };
  }, [passportPreview]);

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 mb-4 text-sm font-medium text-primary hover:-translate-x-1 transition">
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-[#1f272f] text-white p-10 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold overflow-hidden">
              {/* PRIORITY: Preview → Existing Image → Initials */}
              {passportPreview ? (
                <Image
                  src={passportPreview}
                  alt="Profile Picture"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : user?.profilepic ? (
                <Image
                  src={user.profilepic}
                  alt="Profile"
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

            <input
              type="file"
              accept="image/*"
              id="passportUpload"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => document.getElementById("passportUpload")?.click()}
              className="absolute -bottom-1 -right-1 bg-white text-primary p-2 rounded-full shadow hover:scale-95 transition flex items-center justify-center">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">Edit Profile</h1>
            <p className="opacity-80 text-sm mt-1">Update your personal information</p>
          </div>
        </div>
      </div>
    </>
  );
}

function EditDetails({
  form,
  onChange,
  saving,
}: {
  form: UserType;
  onChange: (k: keyof UserType, v: string) => void;
  saving: boolean;
}) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 mt-6">
      <h3 className="font-semibold text-primary mb-6 text-lg">Personal Information</h3>

      <div className="grid md:grid-cols-2 gap-5">
        <Input label="First Name" value={form.first_name} disabled />
        <Input label="Last Name" value={form.last_name} disabled />
        <Input label="Email" value={form.email} type="email" disabled />
        <Input label="Phone" value={form.phone} disabled />
        <Input label="Account Number" value={form.accountno} disabled />
        <Input label="BVN" value={form.bvn} disabled />

        <Input label="Gender" value={form.sex} disabled={!!form.sex} />

        <Input
          label="NIN"
          value={form.nin || ""}
          onChange={(v) => {
            const numbersOnly = v.replace(/\D/g, "");
            onChange("nin", numbersOnly);
          }}
          maxLength={11}
          inputMode="numeric"
          disabled={!!form.nin}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-8 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
        {saving && <Loader2 className="animate-spin" size={18} />}
        Save Changes
      </button>
    </div>
  );
}
