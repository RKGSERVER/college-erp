import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json()

    if (!username || !password || !role) {
      return NextResponse.json({ error: "Username, password, and role are required" }, { status: 400 })
    }

    // Universal credentials for all roles
    const UNIVERSAL_USERNAME = "Admin"
    const UNIVERSAL_PASSWORD = "1234"

    // Check credentials - same for all roles
    if (username !== UNIVERSAL_USERNAME || password !== UNIVERSAL_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Validate role
    const validRoles = ["admin", "principal", "faculty", "employee", "student"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 })
    }

    // Create JWT token
    const token = await generateToken({
      userId: Math.floor(Math.random() * 1000) + 1,
      username: UNIVERSAL_USERNAME,
      email: `${role}@college.edu`,
      role: role,
      permissions: ["read", "write"],
    })

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        username: UNIVERSAL_USERNAME,
        email: `${role}@college.edu`,
        role: role,
        firstName: "Admin",
        lastName: "User",
        departmentName: `${role.charAt(0).toUpperCase() + role.slice(1)} Department`,
        status: "active",
      },
      token,
      permissions: ["read", "write"],
    })

    // Set HTTP-only cookie for security
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
