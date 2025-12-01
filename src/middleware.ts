import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public paths that don't require authentication
        const publicPaths = [
          "/",
          "/login",
          "/register",
          "/forgot-password",
          "/questions",
          "/courses",
          "/mock-exams",
          "/about",
          "/contact",
          "/terms",
          "/privacy",
        ];

        const pathname = req.nextUrl.pathname;

        // Allow public paths
        if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
          return true;
        }

        // Allow API routes that don't require auth
        if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/questions")) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
