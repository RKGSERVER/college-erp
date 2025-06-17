"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CircleLoader, PulseLoader } from "./circle-loader"
import { CheckCircle, AlertTriangle, CreditCard, Shield, Clock } from "lucide-react"

interface PaymentLoaderProps {
  stage: "initializing" | "processing" | "verifying" | "completed" | "failed"
  gateway?: "razorpay" | "stripe"
  amount?: number
  onComplete?: () => void
}

export function PaymentLoader({ stage, gateway, amount, onComplete }: PaymentLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: "initializing", label: "Initializing Payment", icon: CreditCard },
    { id: "processing", label: "Processing Payment", icon: Clock },
    { id: "verifying", label: "Verifying Transaction", icon: Shield },
    { id: "completed", label: "Payment Completed", icon: CheckCircle },
  ]

  useEffect(() => {
    const stepIndex = steps.findIndex((step) => step.id === stage)
    setCurrentStep(stepIndex)

    // Simulate progress for current step
    if (stage === "processing" || stage === "verifying") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 10
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [stage])

  const getStageContent = () => {
    switch (stage) {
      case "initializing":
        return (
          <div className="text-center space-y-4">
            <CircleLoader size="lg" text="Initializing secure payment..." />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Setting up payment gateway</p>
              <PulseLoader color="primary" />
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="text-center space-y-4">
            <CircleLoader size="lg" color="warning" text="Processing payment..." />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Redirecting to {gateway === "razorpay" ? "Razorpay" : "Stripe"}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">Please complete payment in the popup window</p>
            </div>
          </div>
        )

      case "verifying":
        return (
          <div className="text-center space-y-4">
            <CircleLoader size="lg" color="primary" text="Verifying transaction..." />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Confirming payment details</p>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-500">Secure verification in progress</span>
              </div>
            </div>
          </div>
        )

      case "completed":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
              <p className="text-sm text-gray-600">
                Your payment of ₹{amount?.toLocaleString()} has been processed successfully
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Transaction secured by {gateway === "razorpay" ? "Razorpay" : "Stripe"}</span>
              </div>
            </div>
          </div>
        )

      case "failed":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-700">Payment Failed</h3>
              <p className="text-sm text-gray-600">There was an issue processing your payment. Please try again.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isFailed = stage === "failed" && index === currentStep

              return (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isFailed
                        ? "border-red-500 bg-red-50"
                        : isCompleted
                          ? "border-green-500 bg-green-50"
                          : isActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <StepIcon
                      className={`h-5 w-5 ${
                        isFailed
                          ? "text-red-500"
                          : isCompleted
                            ? "text-green-500"
                            : isActive
                              ? "text-blue-500"
                              : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs text-center ${
                      isFailed
                        ? "text-red-600"
                        : isCompleted
                          ? "text-green-600"
                          : isActive
                            ? "text-blue-600"
                            : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Progress Line */}
          <div className="mt-4 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded" />
            <div
              className="absolute top-0 left-0 h-1 bg-blue-500 rounded transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Stage Content */}
        {getStageContent()}

        {/* Gateway Info */}
        {gateway && stage !== "failed" && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <img src={`/placeholder.svg?height=20&width=60`} alt={gateway} className="h-5" />
              <span className="text-xs text-gray-600">Secured by {gateway === "razorpay" ? "Razorpay" : "Stripe"}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Mini payment loader for inline use
export function MiniPaymentLoader({
  isLoading,
  text = "Processing...",
}: {
  isLoading: boolean
  text?: string
}) {
  if (!isLoading) return null

  return (
    <div className="flex items-center space-x-2">
      <CircleLoader size="sm" showText={false} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}
