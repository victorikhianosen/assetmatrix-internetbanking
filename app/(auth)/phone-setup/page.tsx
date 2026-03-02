"use client";

import React, { useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendPhoneOtp, resentOtp } from "@/features/auth/services/auth.service";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";

export default function PhoneSetup() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) {
      setError("Phone number is required");
      return;
    }
    if (phone.length != 11) {
      setError("Phone number must be exactly 11 digits");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = {
        phone,
        device_id: "web",
      };

      const res = await sendPhoneOtp(payload);

      if (res.status === "success" && res.responseCode === "000") {
        toast.success(res.message);
        sessionStorage.setItem("otp_phone", phone);
        setLoading(false);
        router.push("/phone-verification");
        return;
      }

      if (res.status === "error" && res.responseCode === "202") {
        toast.info(res.message);
        sessionStorage.setItem("otp_phone", phone);
        setLoading(false);
        setError(res.message);
        setOtpSent(true);
        return;
      }
      toast.error(res.message);
      setError(res.message);
      toast.error(res.message);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  async function handleResendOtp(e: React.FormEvent) {
    e.preventDefault();

    if (phone.length !== 11) {
      setError("Phone number must be exactly 11 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        phone,
        device_id: "web",
      };

      const res = await resentOtp(payload);
  
      if (res.status === "success") {
        sessionStorage.setItem("phone_otp", phone);
        toast.success(res.message);
        router.push("/phone-verification");
        setLoading(false);
        return;
      }

      toast.info(res.message);
      setError(res.message);
      return;
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";

      if (typeof err === "object" && err !== null && "message" in err) {
        message = String((err as { message?: string }).message);
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Loader show={loading} />

      <div className="min-h-screen flex bg-[#F7F7F7]">
        {/* LEFT PANEL */}
        <SideBar />

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
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
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary">
                Join our digital banking platform
              </h2>
              <p className="text-sm text-gray-500">
                Experience fast, secure, and seamless transactions
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              {/* USERNAME */}
              <div>
                <label className="block text-lg font-medium text-primary mb-1">Phone Number</label>
                {/* <input
                                type="text"
                                placeholder="Enter phone number"
                                className="w-full text-black rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#fee028] focus:outline-none"
                            /> */}
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => {
                    // allow numbers only
                    const value = e.target.value.replace(/\D/g, "");
                    setPhone(value);
                    setError("");
                  }}
                  placeholder="Enter phone number"
                  className={`w-full text-black rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#fee028] focus:outline-none ${error ? "border-red-500" : ""}`}
                />

                {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition cursor-pointer">
                Next
              </button>
            </form>

            {otpSent && (
              <div className="text-center my-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-primary hover:underline">
                  Didn’t get a code? <span className="font-semibold">Resend OTP</span>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-2">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Back to login
              </Link>

              <Link href="/forget-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* REGISTER / FORGOT PASSWORD */}
          </div>
        </div>
      </div>
    </>
  );
}
