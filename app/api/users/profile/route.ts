import { type NextRequest, NextResponse } from "next/server"
import { userQueries, auditQueries } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const user = await userQueries.getUserWithProfile(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get role-specific details
    let roleDetails = null

    switch (user.role) {
      case "student":
        roleDetails = await userQueries.getStudentDetails(user.id)
        break
      case "faculty":
        roleDetails = await userQueries.getFacultyDetails(user.id)
        break
      case "employee":
        roleDetails = await userQueries.getEmployeeDetails(user.id)
        break
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        roleDetails,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const profileData = await request.json()

    // Get current user data for audit trail
    const currentUser = await userQueries.getUserWithProfile(decoded.userId)

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update profile
    await userQueries.updateUserProfile(decoded.userId, profileData)

    // Create audit logs for changed fields
    for (const [field, newValue] of Object.entries(profileData)) {
      const oldValue = currentUser[field]

      if (oldValue !== newValue) {
        await auditQueries.createAuditLog({
          user_id: decoded.userId,
          target_user_id: decoded.userId,
          action: "profile_update",
          category: "profile",
          table_name: "user_profiles",
          field_name: field,
          old_value: String(oldValue || ""),
          new_value: String(newValue || ""),
          ip_address: request.headers.get("x-forwarded-for") || "unknown",
          user_agent: request.headers.get("user-agent") || "unknown",
          metadata: {
            self_update: true,
            timestamp: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
