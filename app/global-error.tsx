"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
          <div className="w-full max-w-lg">
            {/* Critical Error Animation */}
            <div className="text-center mb-8">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-4 bg-red-300 rounded-full animate-ping opacity-50 animation-delay-1000"></div>
                <div className="relative flex items-center justify-center w-32 h-32 bg-red-600 rounded-full animate-pulse">
                  <AlertTriangle className="w-16 h-16 text-white animate-bounce" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-red-600 mb-2 animate-in slide-in-from-top-4 duration-700">
                Critical Error
              </h1>
              <p className="text-xl text-gray-700 animate-in slide-in-from-top-6 duration-700 delay-150">
                The application encountered a serious problem
              </p>
            </div>

            {/* Error Details Card */}
            <Card className="animate-in slide-in-from-bottom-4 duration-700 delay-300 shadow-2xl border-red-200">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  System Error
                </CardTitle>
                <CardDescription className="text-red-600">
                  A critical error has occurred that prevents the application from functioning properly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Error Information */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800 mb-2">Error Details:</p>
                  <p className="text-sm text-red-700 font-mono break-words mb-2">
                    {error.message || "An unknown critical error occurred"}
                  </p>
                  {error.digest && <p className="text-xs text-red-600">Error ID: {error.digest}</p>}
                  <p className="text-xs text-red-500 mt-2">
                    This error has been automatically logged for investigation.
                  </p>
                </div>

                {/* Recovery Actions */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Recovery Options:</h3>
                  <div className="grid gap-3">
                    <Button
                      onClick={reset}
                      className="w-full bg-red-600 hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restart Application
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/")}
                      className="w-full border-red-300 text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Return to Home
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "mailto:admin@college.edu?subject=Critical Error Report")}
                      className="w-full transition-all duration-200 transform hover:scale-105"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Report Error
                    </Button>
                  </div>
                </div>

                {/* Help Information */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">What happened?</h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    The College ERP system encountered an unexpected error that couldn't be recovered automatically.
                  </p>
                  <p className="text-sm text-yellow-700">
                    Please try restarting the application or contact the system administrator if the problem persists.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-300 rounded-full animate-ping opacity-30"></div>
              <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-orange-300 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-40"></div>
              <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-25"></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </body>
    </html>
  )
}
