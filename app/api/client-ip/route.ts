import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const remoteAddr = request.headers.get("x-vercel-forwarded-for")

  let ip = "Unknown"

  if (forwarded) {
    ip = forwarded.split(",")[0].trim()
  } else if (realIP) {
    ip = realIP
  } else if (remoteAddr) {
    ip = remoteAddr
  }

  return NextResponse.json({ ip })
}
