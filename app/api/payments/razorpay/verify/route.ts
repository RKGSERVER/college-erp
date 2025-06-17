import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId, studentId } = body

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 })
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      console.error("Invalid Razorpay signature:", {
        expected: expectedSignature,
        received: razorpay_signature,
        orderId,
        paymentId: razorpay_payment_id,
      })

      return NextResponse.json(
        {
          error: "Invalid payment signature",
          verified: false,
        },
        { status: 400 },
      )
    }

    // Fetch payment details from Razorpay
    const Razorpay = require("razorpay")
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const payment = await razorpay.payments.fetch(razorpay_payment_id)

    // Log successful verification
    console.log("Payment verified successfully:", {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      studentId,
      timestamp: new Date().toISOString(),
    })

    // Update payment status in database
    // await updatePaymentInDatabase({
    //   razorpayPaymentId: razorpay_payment_id,
    //   razorpayOrderId: razorpay_order_id,
    //   orderId,
    //   studentId,
    //   status: 'completed',
    //   amount: payment.amount / 100,
    //   method: payment.method,
    //   paidAt: new Date(payment.created_at * 1000),
    //   signature: razorpay_signature
    // })

    // Send confirmation email/SMS (implement your notification logic)
    // await sendPaymentConfirmation({
    //   studentId,
    //   paymentId: razorpay_payment_id,
    //   amount: payment.amount / 100,
    //   orderId
    // })

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: payment.amount / 100,
      status: payment.status,
      method: payment.method,
      timestamp: new Date(payment.created_at * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error("Payment verification error:", error)

    return NextResponse.json(
      {
        error: "Payment verification failed",
        details: error.message,
        verified: false,
      },
      { status: 500 },
    )
  }
}
