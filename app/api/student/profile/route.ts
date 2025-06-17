import { type NextRequest, NextResponse } from "next/server"
import { studentProfileSchema } from "@/lib/validation"

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the profile data
    const validation = studentProfileSchema.safeParse(data)
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.errors }, { status: 400 })
    }

    // Update allowed fields (name, phone)
    // These don't require admin approval
    const allowedUpdates = {
      firstName: validation.data.firstName,
      lastName: validation.data.lastName,
      phone: validation.data.phone,
    }

    // Simulate database update
    console.log("Updating student profile:", allowedUpdates)

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: allowedUpdates,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
