"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";
import { ChangePin } from "@/types/settings.type";

const baseUrl = process.env.BASE_URL;

export async function changePin(payload: ChangePin) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      status: "error",
      responseCode: "401",
      message: "Unauthenticated",
    };
  }

  try {
    const res = await fetch(
      `${baseUrl}/api/customers/change-pin`,
      {
        method: "POST",
        headers: privateHeaders(token),
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const data = await res.json();

    return {
      status: data.status,
      responseCode: data.responseCode,
      message: data.message,
    };
  } catch {

    return {
      status: "error",
      responseCode: "500",
      message: "Something went wrong",
    };
  }
}