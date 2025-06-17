"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, LogOut, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendanceRules } from "@/components/attendance-rules"
import { AttendanceCalculator } from "@/components/attendance-calculator"

export default function StudentAttendanceRules() {
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
            <h1 className="text-2xl font-bold">Attendance Rules</h1>
            <p className="text-gray-600">View attendance requirements and your current status</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/student")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Important Notice</h3>
              <p className="text-sm text-amber-700">
                Students must maintain the minimum required attendance to be eligible for final examinations. Please
                review the attendance policies applicable to your courses.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="rules">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules">Attendance Policies</TabsTrigger>
            <TabsTrigger value="calculator">Attendance Calculator</TabsTrigger>
          </TabsList>
          <TabsContent value="rules" className="mt-4">
            <AttendanceRules userRole="student" />
          </TabsContent>
          <TabsContent value="calculator" className="mt-4">
            <AttendanceCalculator
              userRole="student"
              initialValues={{
                totalClasses: 40,
                attendedClasses: 30,
                requiredPercentage: 75,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
