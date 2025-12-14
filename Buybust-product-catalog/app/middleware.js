import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = ["/orders", "/checkout"];

  if (protectedRoutes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/checkout/:path*"],
};
