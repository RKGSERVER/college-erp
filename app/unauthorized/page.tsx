"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertTriangle, Lock, ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center mb-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100"
        >
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mt-2">You don't have permission to access this page</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg border-red-200">
          <CardHeader className="border-b border-red-100">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              Unauthorized Access
            </CardTitle>
            <CardDescription>Your current role doesn't have sufficient permissions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Why am I seeing this?</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      The middleware detected that you're trying to access a protected route without the required
                      permissions. This happens when your user role doesn't match the required roles for this page.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                className="flex justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{countdown}</div>
                  <div className="text-xs text-gray-500">Redirecting to login...</div>
                </div>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-red-100 pt-4">
            <Button variant="outline" onClick={() => router.back()} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700">
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 text-sm text-gray-500 max-w-md text-center"
      >
        If you believe this is an error, please contact your system administrator or try logging in with an account that
        has the required permissions.
      </motion.div>
    </div>
  )
}
