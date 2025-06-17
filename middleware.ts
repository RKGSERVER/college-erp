import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/unauthorized" ||
    pathname === "/not-found" ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value

  // If no token, redirect to login
  if (!token || !token.startsWith("demo_token_")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Extract role from token for demo purposes
  const userRole = token.replace("demo_token_", "")

  // Define protected routes and required permissions
  const protectedRoutes = {
    "/admin": ["admin"],
    "/principal": ["principal"],
    "/faculty": ["faculty"],
    "/employee": ["employee"],
    "/student": ["student"],
  }

  // Check if route is protected
  const protectedRoute = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route))

  if (protectedRoute) {
    const allowedRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes]

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Add user info to headers for components to use
  const response = NextResponse.next()
  response.headers.set("x-user-role", userRole)
  response.headers.set("x-user-id", "1")

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
}
