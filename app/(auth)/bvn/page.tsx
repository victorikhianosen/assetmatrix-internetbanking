"use client";

import React, { useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import { verifyBVN } from "@/features/auth/services/auth.service";

export type CustomError = {
  status: string;
  message: string;
  responseCode: string;
};

export default function BvnPage() {
  const [bvn, setBvn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bvn) {
      setError("BVN is required");
      return;
    }

    if (bvn.length != 11) {
      setError("BVN must be 11 digits!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = { bvn };
      const res = await verifyBVN(payload);

      if (res.status === "success" && res.responseCode === "000") {
        sessionStorage.setItem("bvn_data", JSON.stringify(res.data));
        toast.success(res.message ?? "BVN verification successful");
        router.push("/register");
        return;
      }

      if (res.responseCode === "422") {
        const bvnError = res?.errors?.bvn?.[0];

        const message = bvnError || res.message;
        setError(message);
        toast.error(message);
        return;
      }

      setError(res.message);
      toast.error(res.message);
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
              <h2 className="text-xl font-semibold text-primary">BVN Verification</h2>
              <p className="text-sm text-gray-500">
                Enter your Bank Verification Number to continue
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              {/* BVN INPUT */}
              <div>
                <label className="block text-lg font-medium text-primary mb-1">
                  Bank Verification Number (BVN)
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={bvn}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setBvn(value);
                    setError("");
                  }}
                  placeholder="Enter your 11-digit BVN"
                  className={`w-full text-black rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#fee028] focus:outline-none ${
                    error ? "border-red-500" : ""
                  }`}
                />

                <p className="text-xs text-gray-500 mt-1">
                  Your BVN is safe and used only for identity verification
                </p>

                {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition disabled:opacity-50">
                {loading ? "Verifying..." : "Continue"}
              </button>
            </form>

            {/* LINKS */}
            <div className="flex justify-between items-center mt-4">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Back to login
              </Link>

              {/* <Link
                                href="/help"
                                className="text-sm text-primary hover:underline"
                            >
                                Why we need BVN?
                            </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
