import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    console.log("Razorpay webhook received:", {
      event: event.event,
      paymentId: event.payload?.payment?.entity?.id,
      timestamp: new Date().toISOString(),
    })

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity)
        break

      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity)
        break

      case "order.paid":
        await handleOrderPaid(event.payload.order.entity)
        break

      default:
        console.log("Unhandled Razorpay webhook event:", event.event)
    }

    return NextResponse.json({ status: "success" })
  } catch (error: any) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log("Payment captured:", payment.id)

  // Update payment status in database
  // await updatePaymentStatus({
  //   razorpayPaymentId: payment.id,
  //   status: 'captured',
  //   capturedAt: new Date(payment.created_at * 1000)
  // })

  // Send success notifications
  // await sendPaymentSuccessNotification(payment)
}

async function handlePaymentFailed(payment: any) {
  console.log("Payment failed:", payment.id)

  // Update payment status in database
  // await updatePaymentStatus({
  //   razorpayPaymentId: payment.id,
  //   status: 'failed',
  //   failureReason: payment.error_description
  // })

  // Send failure notifications
  // await sendPaymentFailureNotification(payment)
}

async function handleOrderPaid(order: any) {
  console.log("Order paid:", order.id)

  // Update order status in database
  // await updateOrderStatus({
  //   razorpayOrderId: order.id,
  //   status: 'paid',
  //   paidAt: new Date()
  // })
}
