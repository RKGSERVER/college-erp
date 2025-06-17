"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Shield, CheckCircle, AlertTriangle, Lock, Smartphone, Wallet, Building2 } from "lucide-react"

import { PaymentLoader, MiniPaymentLoader } from "./loading/payment-loader"
import { SpinnerOverlay } from "./loading/circle-loader"

import { paymentSchema } from "@/lib/validation"
import { FormField } from "@/components/ui/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"

interface PaymentGatewayProps {
  amount: number
  currency: string
  orderId: string
  studentId: string
  studentName: string
  studentEmail: string
  studentPhone: string
  description: string
  onSuccess: (paymentData: PaymentResult) => void
  onFailure: (error: PaymentError) => void
  onClose: () => void
}

interface PaymentResult {
  paymentId: string
  orderId: string
  signature?: string
  amount: number
  currency: string
  status: "success" | "failed" | "pending"
  gateway: "razorpay" | "stripe"
  method: string
  timestamp: string
  transactionFee: number
}

interface PaymentError {
  code: string
  description: string
  source: string
  step: string
  reason: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingFee: number
  processingTime: string
  supported: boolean
}

interface StudentPayment {
  id: string
  amount: number
  paidAmount: number
  dueDate: string
}

interface PaymentStructure {
  id: string
  name: string
}

// Payment Dialog Component with Validation
function PaymentDialog({
  payment,
  structure,
  onPayment,
  isFinanceView = false,
}: {
  payment: StudentPayment
  structure: PaymentStructure
  onPayment: (paymentId: string, amount: number, method: string) => void
  isFinanceView?: boolean
}) {
  const { values, errors, isValid, handleSubmit, getFieldProps } = useFormValidation({
    schema: paymentSchema,
    initialValues: {
      amount: payment.amount - payment.paidAmount,
      paymentMethod: "online_banking",
      remarks: "",
    },
    validateOnChange: true,
    onSubmit: (data) => {
      onPayment(payment.id, data.amount, data.paymentMethod)
    },
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">{structure.name}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>Total Amount: ₹{payment.amount.toLocaleString()}</div>
          <div>Paid Amount: ₹{payment.paidAmount.toLocaleString()}</div>
          <div>Remaining: ₹{(payment.amount - payment.paidAmount).toLocaleString()}</div>
          <div>Due Date: {new Date(payment.dueDate).toLocaleDateString()}</div>
        </div>
      </div>

      <FormField
        label="Payment Amount"
        name="amount"
        type="number"
        min={1}
        max={payment.amount - payment.paidAmount}
        required
        {...getFieldProps("amount")}
      />

      <FormField
        label="Payment Method"
        name="paymentMethod"
        type="select"
        required
        options={[
          { value: "online_banking", label: "Online Banking" },
          { value: "credit_card", label: "Credit Card" },
          { value: "debit_card", label: "Debit Card" },
          { value: "cash", label: "Cash" },
          { value: "cheque", label: "Cheque" },
          { value: "demand_draft", label: "Demand Draft" },
        ]}
        {...getFieldProps("paymentMethod")}
      />

      {isFinanceView && (
        <FormField
          label="Remarks"
          name="remarks"
          type="textarea"
          placeholder="Add any remarks or notes"
          {...getFieldProps("remarks")}
        />
      )}

      <Button type="submit" disabled={!isValid} className="w-full">
        <CreditCard className="h-4 w-4 mr-2" />
        Process Payment
      </Button>
    </form>
  )
}

export function PaymentGateway({
  amount,
  currency,
  orderId,
  studentId,
  studentName,
  studentEmail,
  studentPhone,
  description,
  onSuccess,
  onFailure,
  onClose,
}: PaymentGatewayProps) {
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "stripe">("razorpay")
  const [selectedMethod, setSelectedMethod] = useState<string>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "process" | "verify" | "complete">("select")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Payment methods configuration
  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Visa, Mastercard, RuPay, American Express",
      processingFee: 2.5,
      processingTime: "Instant",
      supported: true,
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: <Building2 className="h-5 w-5" />,
      description: "All major banks supported",
      processingFee: 1.5,
      processingTime: "Instant",
      supported: true,
    },
    {
      id: "upi",
      name: "UPI",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Google Pay, PhonePe, Paytm, BHIM",
      processingFee: 0,
      processingTime: "Instant",
      supported: true,
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: <Wallet className="h-5 w-5" />,
      description: "Paytm, Mobikwik, Amazon Pay",
      processingFee: 1.0,
      processingTime: "Instant",
      supported: true,
    },
  ]

  // Calculate total amount including processing fee
  const calculateTotalAmount = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod)
    const processingFee = method ? (amount * method.processingFee) / 100 : 0
    return amount + processingFee
  }

  // Initialize Razorpay
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Initialize Stripe
  const initializeStripe = async () => {
    // In a real implementation, you would load Stripe.js
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    return true
  }

  // Process Razorpay payment
  const processRazorpayPayment = async () => {
    setIsProcessing(true)
    setPaymentStep("process")

    try {
      // Initialize Razorpay
      const isLoaded = await initializeRazorpay()
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK")
      }

      // Create order on backend
      const orderResponse = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotalAmount() * 100, // Convert to paise
          currency: currency.toUpperCase(),
          orderId,
          studentId,
          description,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "College ERP System",
        description: description,
        order_id: orderData.id,
        prefill: {
          name: studentName,
          email: studentEmail,
          contact: studentPhone,
        },
        theme: {
          color: "#3b82f6",
        },
        method: {
          card: selectedMethod === "card",
          netbanking: selectedMethod === "netbanking",
          upi: selectedMethod === "upi",
          wallet: selectedMethod === "wallet",
        },
        handler: async (response: any) => {
          setPaymentStep("verify")
          await verifyRazorpayPayment(response)
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            setPaymentStep("select")
            onFailure({
              code: "PAYMENT_CANCELLED",
              description: "Payment was cancelled by user",
              source: "razorpay",
              step: "payment",
              reason: "user_cancelled",
            })
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      setIsProcessing(false)
      setPaymentStep("select")
      setError(error.message)
      onFailure({
        code: "RAZORPAY_INIT_ERROR",
        description: error.message,
        source: "razorpay",
        step: "initialization",
        reason: "sdk_error",
      })
    }
  }

  // Verify Razorpay payment
  const verifyRazorpayPayment = async (response: any) => {
    try {
      const verificationResponse = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
          studentId,
        }),
      })

      const verificationData = await verificationResponse.json()

      if (verificationResponse.ok && verificationData.verified) {
        setPaymentStep("complete")
        const paymentResult: PaymentResult = {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          amount: calculateTotalAmount(),
          currency,
          status: "success",
          gateway: "razorpay",
          method: selectedMethod,
          timestamp: new Date().toISOString(),
          transactionFee: calculateTotalAmount() - amount,
        }
        setPaymentData(paymentResult)
        onSuccess(paymentResult)
      } else {
        throw new Error(verificationData.error || "Payment verification failed")
      }
    } catch (error: any) {
      setPaymentStep("select")
      setError(error.message)
      onFailure({
        code: "VERIFICATION_FAILED",
        description: error.message,
        source: "razorpay",
        step: "verification",
        reason: "signature_mismatch",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Process Stripe payment
  const processStripePayment = async () => {
    setIsProcessing(true)
    setPaymentStep("process")

    try {
      // Initialize Stripe
      const isLoaded = await initializeStripe()
      if (!isLoaded) {
        throw new Error("Failed to load Stripe SDK")
      }

      // Create payment intent on backend
      const intentResponse = await fetch("/api/payments/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotalAmount() * 100, // Convert to cents
          currency: currency.toLowerCase(),
          orderId,
          studentId,
          description,
          paymentMethod: selectedMethod,
        }),
      })

      const intentData = await intentResponse.json()

      if (!intentResponse.ok) {
        throw new Error(intentData.error || "Failed to create payment intent")
      }

      // In a real implementation, you would use Stripe Elements
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      // const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.client_secret)

      // Simulate Stripe payment for demo
      setTimeout(async () => {
        setPaymentStep("verify")
        await verifyStripePayment({
          id: `pi_${Date.now()}`,
          status: "succeeded",
          amount: calculateTotalAmount() * 100,
          currency: currency.toLowerCase(),
        })
      }, 2000)
    } catch (error: any) {
      setIsProcessing(false)
      setPaymentStep("select")
      setError(error.message)
      onFailure({
        code: "STRIPE_INIT_ERROR",
        description: error.message,
        source: "stripe",
        step: "initialization",
        reason: "sdk_error",
      })
    }
  }

  // Verify Stripe payment
  const verifyStripePayment = async (paymentIntent: any) => {
    try {
      const verificationResponse = await fetch("/api/payments/stripe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_intent_id: paymentIntent.id,
          orderId,
          studentId,
        }),
      })

      const verificationData = await verificationResponse.json()

      if (verificationResponse.ok && paymentIntent.status === "succeeded") {
        setPaymentStep("complete")
        const paymentResult: PaymentResult = {
          paymentId: paymentIntent.id,
          orderId,
          amount: calculateTotalAmount(),
          currency,
          status: "success",
          gateway: "stripe",
          method: selectedMethod,
          timestamp: new Date().toISOString(),
          transactionFee: calculateTotalAmount() - amount,
        }
        setPaymentData(paymentResult)
        onSuccess(paymentResult)
      } else {
        throw new Error(verificationData.error || "Payment verification failed")
      }
    } catch (error: any) {
      setPaymentStep("select")
      setError(error.message)
      onFailure({
        code: "STRIPE_VERIFICATION_FAILED",
        description: error.message,
        source: "stripe",
        step: "verification",
        reason: "payment_failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment initiation
  const handlePayment = () => {
    if (selectedGateway === "razorpay") {
      processRazorpayPayment()
    } else {
      processStripePayment()
    }
  }

  const renderPaymentSelection = () => (
    <div className="space-y-6">
      {/* Gateway Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Select Payment Gateway</Label>
        <Tabs value={selectedGateway} onValueChange={(value: any) => setSelectedGateway(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="razorpay" className="flex items-center space-x-2">
              <img src="/placeholder.svg?height=20&width=60" alt="Razorpay" className="h-5" />
              <span>Razorpay</span>
            </TabsTrigger>
            <TabsTrigger value="stripe" className="flex items-center space-x-2">
              <img src="/placeholder.svg?height=20&width=60" alt="Stripe" className="h-5" />
              <span>Stripe</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Select Payment Method</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all ${
                selectedMethod === method.id ? "ring-2 ring-blue-500 border-blue-500" : "hover:border-gray-300"
              } ${!method.supported ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => method.supported && setSelectedMethod(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{method.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{method.name}</h3>
                      {selectedMethod === method.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{method.processingTime}</span>
                      <span className="text-xs text-gray-500">
                        {method.processingFee > 0 ? `${method.processingFee}% fee` : "No fee"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Amount</span>
            <span>₹{amount.toLocaleString()}</span>
          </div>
          {calculateTotalAmount() > amount && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing Fee</span>
              <span>₹{(calculateTotalAmount() - amount).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>₹{calculateTotalAmount().toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secured by {selectedGateway === "razorpay" ? "Razorpay" : "Stripe"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Your payment information is encrypted and secure. We do not store your card details.
        </AlertDescription>
      </Alert>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handlePayment} disabled={isProcessing || !selectedMethod} className="flex-1">
          {isProcessing ? (
            <MiniPaymentLoader isLoading={true} text="Processing..." />
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ₹{calculateTotalAmount().toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderProcessingStep = () => (
    <PaymentLoader stage="processing" gateway={selectedGateway} amount={calculateTotalAmount()} />
  )

  const renderVerificationStep = () => (
    <PaymentLoader stage="verifying" gateway={selectedGateway} amount={calculateTotalAmount()} />
  )

  const renderCompleteStep = () => (
    <PaymentLoader stage="completed" gateway={selectedGateway} amount={calculateTotalAmount()} onComplete={onClose} />
  )

  return (
    <div className="max-w-md mx-auto">
      {paymentStep === "select" && renderPaymentSelection()}
      {paymentStep === "process" && renderProcessingStep()}
      {paymentStep === "verify" && renderVerificationStep()}
      {paymentStep === "complete" && renderCompleteStep()}
      <SpinnerOverlay
        isVisible={isProcessing && paymentStep === "process"}
        text={`Processing payment via ${selectedGateway === "razorpay" ? "Razorpay" : "Stripe"}...`}
      />
    </div>
  )
}

// Payment Gateway Manager Component
export function PaymentGatewayManager() {
  const [transactions, setTransactions] = useState<PaymentResult[]>([])
  const [webhookLogs, setWebhookLogs] = useState<any[]>([])
  const [gatewayStatus, setGatewayStatus] = useState({
    razorpay: { status: "active", uptime: "99.9%", lastCheck: new Date() },
    stripe: { status: "active", uptime: "99.8%", lastCheck: new Date() },
  })

  // Simulate real-time transaction updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new transactions
      const mockTransaction: PaymentResult = {
        paymentId: `txn_${Date.now()}`,
        orderId: `ord_${Date.now()}`,
        amount: Math.floor(Math.random() * 50000) + 10000,
        currency: "INR",
        status: Math.random() > 0.1 ? "success" : "failed",
        gateway: Math.random() > 0.5 ? "razorpay" : "stripe",
        method: ["card", "upi", "netbanking", "wallet"][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        transactionFee: Math.floor(Math.random() * 500) + 50,
      }

      if (Math.random() > 0.8) {
        // 20% chance of new transaction
        setTransactions((prev) => [mockTransaction, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Gateway Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <img src="/placeholder.svg?height=24&width=80" alt="Razorpay" className="h-6" />
              <span>Razorpay Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={gatewayStatus.razorpay.status === "active" ? "default" : "destructive"}>
                  {gatewayStatus.razorpay.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Uptime</span>
                <span>{gatewayStatus.razorpay.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Check</span>
                <span className="text-sm text-gray-500">{gatewayStatus.razorpay.lastCheck.toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <img src="/placeholder.svg?height=24&width=80" alt="Stripe" className="h-6" />
              <span>Stripe Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={gatewayStatus.stripe.status === "active" ? "default" : "destructive"}>
                  {gatewayStatus.stripe.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Uptime</span>
                <span>{gatewayStatus.stripe.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Check</span>
                <span className="text-sm text-gray-500">{gatewayStatus.stripe.lastCheck.toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Real-time payment transaction monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent transactions</p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.paymentId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.status === "success"
                          ? "bg-green-500"
                          : transaction.status === "failed"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{transaction.paymentId}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.gateway} • {transaction.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{transaction.amount.toLocaleString()}</p>
                    <Badge
                      variant={
                        transaction.status === "success"
                          ? "default"
                          : transaction.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
              <p className="text-2xl font-bold mt-1">96.8%</p>
              <p className="text-xs text-green-600 mt-1">+2.1% from last week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Avg. Processing Time</h3>
              <p className="text-2xl font-bold mt-1">2.3s</p>
              <p className="text-xs text-green-600 mt-1">-0.5s improvement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Total Volume</h3>
              <p className="text-2xl font-bold mt-1">₹12.4L</p>
              <p className="text-xs text-blue-600 mt-1">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600">Transaction Fees</h3>
              <p className="text-2xl font-bold mt-1">₹3,240</p>
              <p className="text-xs text-gray-600 mt-1">2.6% of volume</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
