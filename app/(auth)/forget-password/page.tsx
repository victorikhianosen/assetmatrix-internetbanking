"use client";

import React, { useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
// import your API
import { forgotPassword } from "@/features/auth/services/auth.service";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      const msg = "Email is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { email };

      const res = await forgotPassword(payload);
      if (res?.status === "success" && res.responseCode === "000") {
        sessionStorage.setItem("reset_email", email);
        toast.success(res?.message || "Password reset link sent to your email");
        router.replace("/reset-password");
        return;
      }

      // API error
      toast.error(res?.message || "Request failed");
      setError(res?.message);
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
        <SideBar />

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <Image
                alt="Logo"
                src="/assets/images/logo.png"
                width={200}
                height={100}
                className="h-12"
              />
            </div>

            {/* TITLE */}
            <div className="text-center mb-6">
              <h2 className="text-xl text-black font-semibold">Forgot Password</h2>
              <p className="text-sm text-gray-500">
                Enter your email to receive a password reset link
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-md font-medium text-gray-700">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-14 px-4 border rounded-xl text-black focus:outline-none focus:border-primary"
                />
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition">
                Submit
              </button>
            </form>

            <div className="flex justify-between items-center mt-4">
              {/* Create account – LEFT */}
              <Link href="/phone-setup" className="text-sm text-black hover:underline">
                Create account
              </Link>

              {/* Back to login – RIGHT */}
              <Link href="/login" className="text-sm text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
