"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";

const baseUrl = process.env.BASE_URL;

export async function getDataBundles(network: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return {
      responseCode: "401",
      message: "Unauthenticated",
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/vas/data/get-bundle`, {
      method: "POST",
      headers: privateHeaders(token),
      body: JSON.stringify({ network_provider: network }),
      cache: "no-store",
    });

    return await res.json();
  } catch {
    return {
      responseCode: "500",
      message: "Network error",
    };
  }
}
