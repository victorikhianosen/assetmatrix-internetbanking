"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resentOtp, verifyPhoneOtp } from "@/features/auth/services/auth.service";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const storedPhone = typeof window !== "undefined" ? sessionStorage.getItem("otp_phone") : null;

  // 🔧 CONFIG: change resend duration here (seconds)
  const RESEND_TIMEOUT = 10;

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⏱ Countdown states
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);

  // 🔒 Lock page if no phone
  useEffect(() => {
    if (!storedPhone) {
      router.replace("/phone-setup");
      return;
    }
    setPhone(storedPhone);
  }, [router, storedPhone]);

  // ⏱ Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🕒 Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const code = otp.join("");

    setLoading(true);
    setError("");

    try {
      const payload = { phone, otp: code };
      const res = await verifyPhoneOtp(payload);

      if (res.status === "success" && res.responseCode === "000") {
        toast.success(res.message);
        router.replace("/bvn");
        return;
      }

      toast.error(res.message);
      setError(res.message);
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp(e: React.FormEvent) {
    e.preventDefault();

    if (!canResend) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        phone: storedPhone as string,
        device_id: "web",
      };

      const res = await resentOtp(payload);

      if (res.status === "success") {
        toast.success(res.message);

        setTimeLeft(RESEND_TIMEOUT);
        setCanResend(false);
        return;
      }

      toast.info(res.message);
      setError(res.message);
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
            <div className="flex justify-center mb-8">
              <Image
                alt="Logo"
                src="/assets/images/logo.png"
                width={200}
                height={100}
                className="h-12"
              />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl text-black font-semibold">Verify your phone number</h2>
              <p className="text-sm text-gray-500">
                Enter the 6-digit code sent to {phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className="w-12 h-14 text-center text-xl border rounded-xl text-black"
                  />
                ))}
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 cursor-pointer rounded-lg bg-primary text-white">
                Verify
              </button>
            </form>

            {/* 🔁 Resend OTP */}
            <div className="text-center my-4 text-sm">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary cursor-pointer font-semibold hover:underline">
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-500">
                  Resend OTP in{" "}
                  <span className="font-semibold text-secondary">{formatTime(timeLeft)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
