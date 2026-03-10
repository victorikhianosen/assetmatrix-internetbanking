"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import { useRouter } from "next/navigation";
import Loader from "@/components/shared/Loader";
import { toast } from "react-toastify";
import { registerAccount } from "@/features/auth/services/auth.service";
import { ulid } from "ulid";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

/* ===============================
   TYPES
================================ */

type RegisterForm = {
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  bvn: string;
  device_id: string;
  pin: string;
  confirm_pin: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

/* ===============================
   HELPERS
================================ */

const formatDobForInput = (dob: string) => {
  const date = new Date(dob);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const normalizeGender = (gender: string) => (gender ? gender.toLowerCase() : "");

/* ===============================
   COMPONENT
================================ */

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
    gender: "",
    username: "",
    password: "",
    confirm_password: "",
    email: "",
    bvn: "",
    device_id: "web",
    pin: "",
    confirm_pin: "",
  });

  /* ===============================
     SESSION AUTOFILL
  ================================ */

  useEffect(() => {
    const storedBvn = sessionStorage.getItem("bvn_data");
    const storedPhone = sessionStorage.getItem("otp_phone");

    if (!storedBvn || !storedPhone) {
      router.replace("/phone-setup");
      return;
    }

    try {
      const parsed = JSON.parse(storedBvn);

      setForm((prev) => ({
        ...prev,
        first_name: parsed.first_name || "",
        last_name: parsed.last_name || "",
        dob: formatDobForInput(parsed.dob || ""),
        gender: normalizeGender(parsed.gender || ""),
        bvn: parsed.bvn || "",
        phone: storedPhone,
      }));

      setReady(true);
    } catch {
      router.replace("/bvn");
    }
  }, [router]);

  if (!ready) return null;

  /* ===============================
     HANDLER
  ================================ */

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  let newValue = value;

  // PIN fields → allow only digits and max 4
  if (name === "pin" || name === "confirm_pin") {
    newValue = value.replace(/\D/g, "").slice(0, 4);
  }

  setForm((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: undefined,
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!form.email) newErrors.email = "Email is required";
   if (!form.password) {
  newErrors.password = "Password is required";
} else if (form.password.length < 8) {
  newErrors.password = "Password must be at least 8 characters";
}

if (!form.confirm_password) {
  newErrors.confirm_password = "Confirm password is required";
} else if (form.confirm_password.length < 8) {
  newErrors.confirm_password = "Confirm password must be at least 8 characters";
} else if (form.password !== form.confirm_password) {
  newErrors.confirm_password = "Passwords do not match";
}

    if (!/^\d{4}$/.test(form.pin)) newErrors.pin = "PIN must be exactly 4 digits";

    if (form.pin !== form.confirm_pin) newErrors.confirm_pin = "PIN does not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      dob: form.dob,
      gender: form.gender,
      username: form.username,
      password: form.password,
      email: form.email,
      bvn: form.bvn,
      device_id: form.device_id,
      pin: form.pin,
      device_token: ulid(),
    };

    try {
      setLoading(true);

      const res = await registerAccount(payload);

      if (res?.responseCode === "000") {
        toast.success(res?.message || "Account created successfully");
        sessionStorage.clear();
        router.replace("/login");
        return;
      }

      if (res?.errors && typeof res.errors === "object") {
        const errorValues = Object.values(res.errors) as string[][];

        errorValues.flat().forEach((msg) => {
          if (typeof msg === "string") {
            toast.error(msg);
          }
        });

        return;
      }

      toast.error(res?.message || "Registration failed");
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";

      if (typeof err === "object" && err !== null && "message" in err) {
        message = String((err as { message?: string }).message);
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI (UNCHANGED)
  ================================ */

  const inputStyle =
    "w-full text-black rounded-lg border border-secondary/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  return (
    <>
      <Loader show={loading} />

      <div className="min-h-screen flex bg-muted">
        <SideBar />

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-3xl">

            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <Image
                alt="Logo"
                src="/assets/images/logo.png"
                width={200}
                height={100}
                className="h-12 object-contain"
              />
            </div>

            {/* TITLE */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-primary">
                Create your account
              </h2>
              <p className="text-sm text-gray-500">
                Open a secure digital bank account in minutes
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* First Name */}
              <div>
                <label className="text-sm font-medium text-primary">
                  First Name
                </label>
                <input
                  name="first_name"
                  value={form.first_name}
                  readOnly
                  className={inputStyle}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Last Name
                </label>
                <input
                  name="last_name"
                  value={form.last_name}
                  readOnly
                  className={inputStyle}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  readOnly
                  className={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* BVN */}
              <div>
                <label className="text-sm font-medium text-primary">
                  BVN
                </label>
                <input
                  name="bvn"
                  value={form.bvn}
                  readOnly
                  className={inputStyle}
                />
              </div>

              {/* DOB */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  readOnly
                  className={inputStyle}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-sm font-medium text-primary">
                  Password
                </label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={inputStyle}
                />


                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500"
                >
                
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-primary">
                  Confirm Password
                </label>
                <input
                  name="confirm_password"
                  type="password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              {/* PIN */}
              <div className="relative">
                <label className="text-sm font-medium text-primary">
                  PIN
                </label>
                <input
                  name="pin"
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={form.pin}
                  onChange={handleChange}
                  className={inputStyle}
                />


                <span
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500"
                >
              
                  {showPin ? <EyeOff /> : <Eye />}
                </span>
              </div>

              {/* Confirm PIN */}
              <div className="relative">
                <label className="text-sm font-medium text-primary">
                  Confirm PIN
                </label>
                <input
                  name="confirm_pin"
                  type={showConfirmPin ? "text" : "password"}
                  maxLength={4}
                  value={form.confirm_pin}
                  onChange={handleChange}
                  className={inputStyle}
                />


                <span
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500"
                >
              
                  {showConfirmPin ? <EyeOff /> : <Eye />}
                </span>
              </div>

              {/* BUTTON */}
              {/* BUTTON */}
              <button
                type="submit"
                className="col-span-1 md:col-span-2 w-full py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition"
              >
                Create Account
              </button>

            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
