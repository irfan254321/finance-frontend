import { NextResponse } from "next/server"

export function middleware(req: { cookies: { get: (arg0: string) => { (): any; new(): any; value: any } }; nextUrl: { pathname: string }; url: string | URL | undefined }) {
  const token = req.cookies.get("token")?.value
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")

  // jika user belum login dan mau akses dashboard
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // kalau udah login tapi buka /login, redirect ke dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
