"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { changePassword } from "@/app/actions/settings/security/change-password.action";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const router = useRouter();
  // values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // show/hide
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // errors
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  /* ----------------------------------
     VALIDATION
  ---------------------------------- */
  function validate() {
    const newErrors: typeof errors = {};

    if (!currentPassword.trim()) {
      newErrors.current = "Current password is required";
    } else if (currentPassword.length < 8) {
      newErrors.current = "Must be at least 8 characters";
    }

    if (!newPassword.trim()) {
      newErrors.new = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.new = "Must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirm = "Confirm password is required";
    } else if (confirmPassword.length < 8) {
      newErrors.confirm = "Must be at least 8 characters";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    try {
      setLoading(true);

      const res = await changePassword(payload);

      if (res?.responseCode === "000") {
        toast.success(res.message || "Password updated successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Failed to change password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-8">
        <button
          onClick={() => router.back()}
          className="flex cursor-pointer items-center gap-2 mb-4 text-sm font-medium text-primary hover:-translate-x-1 transition">
          <ArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Password</h1>
          <p className="text-gray-700">Update your account password</p>
        </div>
        <Loader show={loading} />

        <div className="max-w-md mx-auto space-y-7 bg-white rounded-2xl py-5 lg:px-10 px-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold ">Change Password</h2>
            <p className="text-sm text-gray-700">Enter your current password and set a new one</p>
          </div>

          {/* Current */}
          <PasswordInput
            label="Current Password"
            show={showCurrent}
            toggle={() => setShowCurrent(!showCurrent)}
            value={currentPassword}
            onChange={setCurrentPassword}
            error={errors.current}
          />

          {/* New */}
          <PasswordInput
            label="New Password"
            show={showNew}
            toggle={() => setShowNew(!showNew)}
            value={newPassword}
            onChange={setNewPassword}
            error={errors.new}
          />

          {/* Confirm */}
          <PasswordInput
            label="Confirm Password"
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirm}
          />

          <button
            onClick={handleChangePassword}
            className="w-full cursor-pointer bg-primary text-white py-3 rounded-xl font-semibold hover:scale-[0.98] transition">
            Update Password
          </button>
        </div>
      </div>
    </>
  );
}

/* helper component */
function PasswordInput({
  label,
  show,
  toggle,
  value,
  onChange,
  error,
}: {
  label: string;
  show: boolean;
  toggle: () => void;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-2 block">{label}</label>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none text-sm transition
            ${error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-primary/20"}
          `}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* ✅ error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
