"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { PaymentSystem } from "@/components/payment-system"

export default function StudentPayments() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Welcome, Student</h1>
              <p className="text-sm text-gray-600">ID: STU001</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fee Payments</h1>
            <p className="text-gray-600">Manage your fee payments and view payment history</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/student")}>
            Back to Dashboard
          </Button>
        </div>

        <PaymentSystem userRole="student" />
      </div>
    </div>
  )
}
