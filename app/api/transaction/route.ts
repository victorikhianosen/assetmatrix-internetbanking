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
    const res = await fetch(`${baseUrl}/api/transactions/all`, {
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

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: "error",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
