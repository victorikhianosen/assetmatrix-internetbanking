"use client";

import React, { useEffect, useRef, useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resetPassword, forgotPassword } from "@/features/auth/services/auth.service";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";

type Step = "otp" | "password";

export default function ResetPasswordPage() {
  const router = useRouter();

  const resetEmail = typeof window !== "undefined" ? sessionStorage.getItem("reset_email") : "";

  const RESEND_TIMEOUT = 60;

  const [step, setStep] = useState<Step>("otp");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);

  /* --------------------------------
     Auto focus password field
  -------------------------------- */
  useEffect(() => {
    if (step === "password") {
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 100);
    }
  }, [step]);

  /* --------------------------------
     Countdown Timer
  -------------------------------- */
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

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* --------------------------------
     OTP HANDLING
  -------------------------------- */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== "Backspace") return;

    const updated = [...otp];

    if (updated[index]) {
      updated[index] = "";
    } else if (index > 0) {
      updated[index - 1] = "";
      inputsRef.current[index - 1]?.focus();
    }

    setOtp(updated);
    e.preventDefault();
  };

  const otpCode = otp.join("");
  const otpValid = otpCode.length === 6;

  function handleOtpNext() {
    if (!otpValid) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    setStep("password");
  }

  /* --------------------------------
     PASSWORD VALIDATION
  -------------------------------- */
  const passwordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  /* --------------------------------
     Password Strength Indicator
  -------------------------------- */
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (score === 3 || score === 4)
      return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };

    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength();

  /* --------------------------------
     Submit Reset
  -------------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: resetEmail as string,
        otp_code: otpCode,
        password,
      };

      const res = await resetPassword(payload);

      if (res?.status === "success" && res.responseCode === "000") {
        toast.success(res.message || "Password reset successful");
        sessionStorage.removeItem("reset_email");
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      // If OTP invalid → go back to OTP step
      if (res?.errors?.otp_code) {
        toast.error(res.errors.otp_code[0]);
        setStep("otp");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      toast.error(res?.message || "Request failed");
    } catch {
      toast.error("Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------------
     Resend OTP
  -------------------------------- */
  async function handleResendOtp() {
    if (!canResend || !resetEmail) return;

    setLoading(true);

    try {
      const res = await forgotPassword({ email: resetEmail });

      if (res?.status === "success" && res.responseCode === "000") {
        toast.success(res.message);
        setTimeLeft(RESEND_TIMEOUT);
        setCanResend(false);
      } else {
        toast.error(res?.message || "Failed to resend OTP");
      }
    } catch {
      toast.error("Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------------
     Back to OTP
  -------------------------------- */
  function handleBackToOtp() {
    setStep("otp");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <Loader show={loading} />

      <div className="min-h-screen flex bg-muted">
        <SideBar />

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={200}
                height={100}
                className="h-12"
              />
            </div>

            <form
              onSubmit={step === "password" ? handleSubmit : (e) => e.preventDefault()}
              className="space-y-6">
              {/* OTP STEP */}
              {step === "otp" && (
                <>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          if (el) inputsRef.current[i] = el;
                        }}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="w-12 h-14 text-center text-xl border rounded-xl text-black"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleOtpNext}
                    disabled={!otpValid}
                    className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-50">
                    Next
                  </button>
                </>
              )}

              {/* PASSWORD STEP */}
              {step === "password" && (
                <>
                  <input
                    ref={passwordRef}
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />

                  {/* Strength Bar */}
                  {password && (
                    <div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width}`} />
                      </div>
                      <p className="text-sm mt-1">{strength.label}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBackToOtp}
                      className="w-1/2 py-3 rounded-lg border">
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/2 py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-50">
                      Reset Password
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* RESEND SECTION */}
            {step === "otp" && (
              <div className="text-center mt-8">
                {canResend ? (
                  <button onClick={handleResendOtp} className="text-primary font-semibold">
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-gray-500">
                    Resend OTP in <span className="font-semibold">{formatTime(timeLeft)}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
