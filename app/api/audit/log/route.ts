import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const auditLog = await request.json()

    // Validate audit log structure
    const requiredFields = [
      "timestamp",
      "userId",
      "userName",
      "userRole",
      "targetUserId",
      "targetUserName",
      "action",
      "category",
      "field",
      "oldValue",
      "newValue",
    ]

    for (const field of requiredFields) {
      if (!auditLog[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Add server-side validation and enrichment
    const enrichedLog = {
      ...auditLog,
      serverTimestamp: new Date().toISOString(),
      ipAddress: getClientIP(request),
      validated: true,
    }

    // Store in database (replace with actual database call)
    console.log("Storing audit log:", enrichedLog)

    // In a real implementation, you would:
    // 1. Store in a secure audit database
    // 2. Encrypt sensitive data
    // 3. Set up log rotation
    // 4. Configure backup strategies
    // 5. Implement real-time alerting for critical changes

    return NextResponse.json({
      success: true,
      logId: auditLog.id,
    })
  } catch (error) {
    console.error("Error storing audit log:", error)
    return NextResponse.json({ error: "Failed to store audit log" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userRole = searchParams.get("userRole")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const action = searchParams.get("action")
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build query based on parameters
    const filters = {
      userId,
      userRole,
      startDate,
      endDate,
      action,
      category,
      limit,
      offset,
    }

    // Fetch from database (replace with actual database query)
    console.log("Fetching audit logs with filters:", filters)

    // Mock response - replace with actual database results
    const mockLogs = [] // Your audit logs from database

    return NextResponse.json({
      logs: mockLogs,
      total: mockLogs.length,
      hasMore: mockLogs.length === limit,
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "Unknown"
}
