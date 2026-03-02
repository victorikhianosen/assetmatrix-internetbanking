"use server";

import { cookies } from "next/headers";

import { publicHeaders } from "@/lib/httpHeaders";
import { LoginRequest, ForgetPassordRequest , ResetPasswordRequest} from "@/types/auth.types";
import {
  SendPhoneOtpRequest,
  ResendOtpRequest,
  VerifyPhoneOTPRequest,
  BVNRequest,
  RegisterRequest,
} from "@/types/register.types";

const baseUrl = process.env.BASE_URL;

export async function login(payload: LoginRequest) {
  const res = await fetch(`${baseUrl}/api/customers/login`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result?.status === "success") {
    const token = result.data.access_token;
    const expiresAt = new Date(result.data.expired_at);

    const cookieStore = await cookies();

    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    });
  }

  return result;
}

export async function sendPhoneOtp(payload: SendPhoneOtpRequest) {
  const res = await fetch(`${baseUrl}/api/customers/phone-otp`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function resentOtp(payload: ResendOtpRequest) {
  const res = await fetch(`${baseUrl}/api/customers/phone/resend-otp`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function verifyPhoneOtp(payload: VerifyPhoneOTPRequest) {
  const res = await fetch(`${baseUrl}/api/customers/phone-verify`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function verifyBVN(payload: BVNRequest) {
  const res = await fetch(`${baseUrl}/api/customers/bvn`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function registerAccount(payload: RegisterRequest) {
  const res = await fetch(`${baseUrl}/api/customers/register`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function forgotPassword(payload: ForgetPassordRequest) {
  const res = await fetch(`${baseUrl}/api/customers/forget-password`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function resetPassword(payload: ResetPasswordRequest) {
  const res = await fetch(`${baseUrl}/api/customers/reset-password`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}
