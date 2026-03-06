import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const authPages = [
    "/",
    "/login",
    "/forget-password",
    "/bvn",
    "/reset-password",
    "/register",
    "/phone-setup",
    "/phone-verification",
  ];

  const protectedPages = [
    "/dashboard",
    "/transfer/bank-transfer",
    "/transfer/wallet-transfer",
    "/bills/airtime",
    "/bills/data",
    "/settings/profile",
    "/settings",
    "/settings/security",
    "/transactions",
    "/transactions/:path*",
  ];

  //  User has token → block auth pages
  if (token && authPages.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // User has no token → block protected pages
  if (
    !token &&
    protectedPages.some((route) => pathname === route || pathname.startsWith(route + "/"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forget-password",
    "/dashboard/:path*",
    "/transfer/:path*",
    "/bills/:path*",
    "/settings/:path*",
  ],
};
