import { type NextRequest, NextResponse } from "next/server"
import { changeRequestSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const requestData = {
      type: formData.get("type") as string,
      currentValue: formData.get("currentValue") as string,
      requestedValue: formData.get("requestedValue") as string,
      reason: formData.get("reason") as string,
      verificationDocument: formData.get("verificationDocument") as File | null,
    }

    // Validate the request data
    const validation = changeRequestSchema.safeParse(requestData)
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.errors }, { status: 400 })
    }

    // For date of birth changes, verification document is required
    if (requestData.type === "date_of_birth" && !requestData.verificationDocument) {
      return NextResponse.json(
        { error: "Aadhar card verification is required for date of birth changes" },
        { status: 400 },
      )
    }

    // Create change request in database
    const changeRequest = {
      id: `REQ${Date.now()}`,
      studentId: "STU001", // Get from auth token
      type: requestData.type,
      currentValue: requestData.currentValue,
      requestedValue: requestData.requestedValue,
      reason: requestData.reason,
      status: "pending",
      submittedAt: new Date().toISOString(),
      verificationDocument: requestData.verificationDocument ? "uploaded" : null,
    }

    // Store verification document if provided
    if (requestData.verificationDocument) {
      // Handle file upload to storage
      console.log("Uploading verification document:", requestData.verificationDocument.name)
    }

    // Send notification to admin
    await sendAdminNotification(changeRequest)

    return NextResponse.json({
      success: true,
      message: "Change request submitted successfully",
      requestId: changeRequest.id,
    })
  } catch (error) {
    console.error("Change request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function sendAdminNotification(request: any) {
  // Send notification to admin about new change request
  console.log("Sending admin notification for request:", request.id)

  // This would integrate with the notification system
  // to alert admins about pending requests
}
