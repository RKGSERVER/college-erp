import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const body = await request.json()
    const { amount, currency, orderId, studentId, description } = body

    if (!amount || !currency || !orderId || !studentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const options = {
      amount,
      currency,
      receipt: orderId,
      notes: {
        student_id: studentId,
        order_id: orderId,
        description: description || "Fee Payment",
      },
    }

    const order = await razorpay.orders.create(options)

    console.log("Razorpay order created:", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      studentId,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    })
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)

    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error.message,
      },
      { status: 500 },
    )
  }
}