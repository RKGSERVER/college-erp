import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, orderId, studentId, description, paymentMethod } = body

    // Validate required fields
    if (!amount || !currency || !orderId || !studentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        student_id: studentId,
        order_id: orderId,
        description: description || "Fee Payment",
      },
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: undefined, // Add student email if available
    })

    // Log payment intent creation
    console.log("Stripe payment intent created:", {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      studentId,
      orderId,
      timestamp: new Date().toISOString(),
    })

    // Store payment intent in database
    // await savePaymentIntentToDatabase({
    //   stripePaymentIntentId: paymentIntent.id,
    //   orderId,
    //   studentId,
    //   amount: amount / 100,
    //   currency,
    //   status: 'created',
    //   createdAt: new Date()
    // })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    })
  } catch (error: any) {
    console.error("Stripe payment intent creation error:", error)

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
