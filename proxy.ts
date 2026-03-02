import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  /* ------------------------------------
     ROUTE GROUPS
  ------------------------------------ */
  const authPages = [
    "/",                
    "/login",
    "/forget-password",
  ];

  const protectedPages = [
    "/dashboard",
    "/transfer/bank-transfer",
    "/transfer/wallet-transfer",
    "/bills/airtime",
    "/bills/data",
    "/settings/profile",
    "/settings",
    "/settings/security"
  ];

  /* ------------------------------------
     1. USER HAS TOKEN → BLOCK AUTH PAGES
  ------------------------------------ */
  if (
    token &&
    authPages.some(
      (route) =>
        pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* ------------------------------------
     2. USER HAS NO TOKEN → BLOCK PROTECTED
  ------------------------------------ */
  if (
    !token &&
    protectedPages.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

/* ------------------------------------
   MATCHER
------------------------------------ */
export const config = {
  matcher: [
    "/",                   
    "/login",
    "/forget-password",
    "/dashboard/:path*",
    "/transfer/:path*",
    "/airtime/:path*",
    "/data/:path*",
    "/bills/:path*",
    "/settings/:path*"
  ],
};