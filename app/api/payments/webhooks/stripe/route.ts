import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    console.log("Stripe webhook received:", {
      event: event.type,
      id: event.id,
      timestamp: new Date().toISOString(),
    })

    // Handle different webhook events
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object as Stripe.Charge)
        break

      case "charge.failed":
        await handleChargeFailed(event.data.object as Stripe.Charge)
        break

      default:
        console.log("Unhandled Stripe webhook event:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent succeeded:", paymentIntent.id)

  // Update payment status in database
  // await updateStripePaymentStatus({
  //   stripePaymentIntentId: paymentIntent.id,
  //   status: 'succeeded',
  //   amount: paymentIntent.amount / 100,
  //   succeededAt: new Date(paymentIntent.created * 1000)
  // })

  // Send success notifications
  // await sendStripePaymentSuccessNotification(paymentIntent)
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent failed:", paymentIntent.id)

  // Update payment status in database
  // await updateStripePaymentStatus({
  //   stripePaymentIntentId: paymentIntent.id,
  //   status: 'failed',
  //   failureReason: paymentIntent.last_payment_error?.message
  // })

  // Send failure notifications
  // await sendStripePaymentFailureNotification(paymentIntent)
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log("Charge succeeded:", charge.id)

  // Additional charge processing if needed
}

async function handleChargeFailed(charge: Stripe.Charge) {
  console.log("Charge failed:", charge.id)

  // Additional charge failure handling if needed
}
