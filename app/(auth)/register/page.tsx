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

    setForm((prev) => ({
      ...prev,
      [name]: value,
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
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match";

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

  return (
    <>
      <Loader show={loading} />

      <div className="min-h-screen flex bg-[#F7F7F7]">
        <SideBar />

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={100}
                height={100}
                className="h-12 object-contain"
              />
            </div>

            {/* TITLE */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary">Create your account</h2>
              <p className="text-sm text-gray-500">Open a secure digital bank account in minutes</p>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">First Name</label>
                <input
                  name="first_name"
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                  readOnly
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.first_name ? "border-red-600" : ""}`}
                />
                {errors.first_name && (
                  <span className="text-red-600 text-md mt-1">{errors.first_name}</span>
                )}{" "}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Last Name</label>
                <input
                  name="last_name"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  readOnly
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.last_name ? "border-red-600" : ""}`}
                />

                {errors.username && (
                  <span className="text-red-600 text-md mt-1">{errors.last_name}</span>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Phone Number</label>
                <input
                  name="phone"
                  placeholder="Phone number"
                  inputMode="numeric"
                  maxLength={11}
                  value={form.phone}
                  readOnly
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.phone ? "border-red-600" : ""}`}
                />
                {errors.phone && <span className="text-red-600 text-md mt-1">{errors.phone}</span>}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.email ? "border-red-600" : ""}`}
                />
                {errors.email && <span className="text-red-600 text-md mt-1">{errors.email}</span>}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Bank Verification Number (BVN)
                </label>
                <input
                  name="bvn"
                  placeholder="Bank Verification Number (BVN)"
                  value={form.bvn}
                  readOnly
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.bvn ? "border-red-600" : ""}`}
                />

                {errors.bvn && <span className="text-red-600 text-md mt-1">{errors.bvn}</span>}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  readOnly
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.dob ? "border-red-600" : ""}`}
                />

                {errors.dob && <span className="text-red-600 text-md mt-1">{errors.dob}</span>}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.gender ? "border-red-600" : ""}`}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <span className="text-red-600 text-md mt-1">{errors.gender}</span>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Username</label>
                <input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${errors.username ? "border-red-600" : ""}`}
                />
                {errors.username && (
                  <span className="text-red-600 text-md mt-1">{errors.username}</span>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 relative">
                <label className="block text-sm font-medium text-primary mb-1">Password</label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 characters)"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 pr-10 ${
                    errors.password ? "border-red-600" : ""
                  }`}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                {errors.password && (
                  <span className="text-red-600 text-md mt-1">{errors.password}</span>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm Password (min 8 characters)"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 ${
                    errors.confirm_password ? "border-red-600" : ""
                  }`}
                />

                {errors.confirm_password && (
                  <span className="text-red-600 text-md mt-1">{errors.confirm_password}</span>
                )}
              </div>

              <div className="col-span-2 md:col-span-1 relative">
                <label className="block text-sm font-medium text-primary mb-1">PIN</label>
                <input
                  name="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="PIN (4 digits)"
                  value={form.pin}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={4}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 pr-10 ${
                    errors.pin ? "border-red-600" : ""
                  }`}
                />
                <span
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500">
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                {errors.pin && <span className="text-red-600 text-md mt-1">{errors.pin}</span>}
              </div>

              <div className="col-span-2 md:col-span-1 relative">
                <label className="block text-sm font-medium text-primary mb-1">Confirm PIN</label>
                <input
                  name="confirm_pin"
                  type={showConfirmPin ? "text" : "password"}
                  placeholder="Confirm PIN (4 digits)"
                  value={form.confirm_pin}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={4}
                  className={`w-full text-black rounded-lg border px-4 py-3 bg-gray-100 pr-10 ${
                    errors.confirm_pin ? "border-red-600" : ""
                  }`}
                />
                <span
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500">
                  {showConfirmPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                {errors.confirm_pin && (
                  <span className="text-red-600 text-md mt-1">{errors.confirm_pin}</span>
                )}
              </div>

              <button
                type="submit"
                className="col-span-2 cursor-pointer
                  w-full py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition">
                Create Account
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
