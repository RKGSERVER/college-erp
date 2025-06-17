"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-lg">
        {/* Animated Error Icon */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-red-500 rounded-full animate-bounce">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-in slide-in-from-top-4 duration-700">Oops!</h1>
          <p className="text-xl text-gray-600 animate-in slide-in-from-top-6 duration-700 delay-150">
            Something went wrong
          </p>
        </div>

        {/* Error Card */}
        <Card className="animate-in slide-in-from-bottom-4 duration-700 delay-300 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Bug className="w-5 h-5" />
              Error Details
            </CardTitle>
            <CardDescription>We encountered an unexpected error while processing your request.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800 mb-1">Error Message:</p>
              <p className="text-sm text-red-700 font-mono break-words">
                {error.message || "An unknown error occurred"}
              </p>
              {error.digest && <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={reset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="flex-1 transition-all duration-200 transform hover:scale-105"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact the system administrator.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Animation Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-300 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-orange-300 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-bounce opacity-50"></div>
        </div>
      </div>
    </div>
  )
}
