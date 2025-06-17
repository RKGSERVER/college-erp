import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_intent_id, orderId, studentId } = body

    // Validate required fields
    if (!payment_intent_id || !orderId || !studentId) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    if (!paymentIntent) {
      return NextResponse.json({ error: "Payment intent not found" }, { status: 404 })
    }

    // Verify payment status
    if (paymentIntent.status !== "succeeded") {
      console.error("Payment not successful:", {
        paymentIntentId: payment_intent_id,
        status: paymentIntent.status,
        orderId,
        studentId,
      })

      return NextResponse.json(
        {
          error: "Payment not successful",
          status: paymentIntent.status,
          verified: false,
        },
        { status: 400 },
      )
    }

    // Log successful verification
    console.log("Stripe payment verified successfully:", {
      paymentIntentId: payment_intent_id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      studentId,
      orderId,
      timestamp: new Date().toISOString(),
    })

    // Update payment status in database
    // await updateStripePaymentInDatabase({
    //   stripePaymentIntentId: payment_intent_id,
    //   orderId,
    //   studentId,
    //   status: 'completed',
    //   amount: paymentIntent.amount / 100,
    //   currency: paymentIntent.currency,
    //   paidAt: new Date(paymentIntent.created * 1000)
    // })

    // Send confirmation notifications
    // await sendPaymentConfirmation({
    //   studentId,
    //   paymentIntentId: payment_intent_id,
    //   amount: paymentIntent.amount / 100,
    //   orderId
    // })

    return NextResponse.json({
      verified: true,
      paymentIntentId: payment_intent_id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      timestamp: new Date(paymentIntent.created * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error("Stripe payment verification error:", error)

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
