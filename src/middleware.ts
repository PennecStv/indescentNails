import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/admin", "/api/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);

  if (!isProtected || isPublicAdminPath) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
