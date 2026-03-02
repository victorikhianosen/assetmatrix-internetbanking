import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";

const baseUrl = process.env.BASE_URL;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: "error",
        responseCode: "401",
        message: "Unauthenticated",
      },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${baseUrl}/api/customers/get-balance`, {
      method: "GET",
      headers: privateHeaders(token),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: "error",
          responseCode: String(res.status),
          message: `Request failed with status ${res.status}`,
        },
        { status: res.status },
      );
    }

    const text = await res.text();

    if (!text) {
      return NextResponse.json(
        {
          success: "error",
          responseCode: "EMPTY_RESPONSE",
          message: "Empty response from server",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error("ROUTE ERROR:", err);

    return NextResponse.json(
      {
        success: "error",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
