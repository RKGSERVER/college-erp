"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceRules } from "@/components/attendance-rules"

export default function FacultyAttendanceRules() {
  const [user, setUser] = useState<any>(null)
  const [atRiskStudents, setAtRiskStudents] = useState<{ name: string; attendance: number }[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Fetch from backend API
      const fetchAtRiskStudents = async () => {
        try {
          const response = await fetch("/api/at-risk-students")
          if (!response.ok) throw new Error("Failed to fetch")
          const data = await response.json()
          setAtRiskStudents(data)
        } catch (error) {
          console.error("Error fetching at-risk students:", error)
        }
      }

      fetchAtRiskStudents()
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
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{user.name || "Faculty"}</h1>
              <p className="text-sm text-gray-600">{user.department || "Department"}</p>
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
            <p className="text-gray-600">Monitor student attendance compliance and manage exceptions</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/faculty")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="rules">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Attendance Policies</TabsTrigger>
            <TabsTrigger value="students">At-Risk Students</TabsTrigger>
            <TabsTrigger value="calculator">Attendance Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-4">
            <AttendanceRules userRole="faculty" />
          </TabsContent>

          <TabsContent value="students" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Students at Risk</CardTitle>
                <CardDescription>Students with attendance below required thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {atRiskStudents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No at-risk students found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {atRiskStudents.map((student, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 text-center">
                          <h3 className="text-sm font-medium text-gray-600">{student.name}</h3>
                          <p
                            className={`text-3xl font-bold mt-1 ${
                              student.attendance < 60
                                ? "text-red-600"
                                : student.attendance < 75
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {student.attendance}%
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Attendance</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calculator</CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">This section will help you calculate required attendance.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}