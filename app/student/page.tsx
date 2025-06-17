"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, GraduationCap, User, Bell, LogOut, CreditCard, Receipt } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendanceCalendar } from "@/components/attendance-calendar"
import { StudentProfileEditor } from "@/components/student-profile-editor"

export default function StudentDashboard() {
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
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Semester</p>
                  <p className="font-semibold">Semester 6</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">CGPA</p>
                  <p className="font-semibold">8.5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Courses</CardTitle>
                <CardDescription>Semester 6 - 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { code: "CS301", name: "Database Management Systems", credits: 4, instructor: "Dr. Smith" },
                  { code: "CS302", name: "Software Engineering", credits: 3, instructor: "Prof. Johnson" },
                  { code: "CS303", name: "Computer Networks", credits: 4, instructor: "Dr. Brown" },
                  { code: "CS304", name: "Machine Learning", credits: 3, instructor: "Dr. Davis" },
                ].map((course) => (
                  <div key={course.code} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-600">
                        {course.code} • {course.instructor}
                      </p>
                    </div>
                    <Badge variant="secondary">{course.credits} Credits</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>View your attendance record</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCalendar userRole="student" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Semester-wise grades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { semester: "Semester 5", sgpa: 8.7, cgpa: 8.5, status: "Completed" },
                  { semester: "Semester 4", sgpa: 8.2, cgpa: 8.3, status: "Completed" },
                  { semester: "Semester 3", sgpa: 8.9, cgpa: 8.4, status: "Completed" },
                  { semester: "Semester 6", sgpa: "In Progress", cgpa: 8.5, status: "Current" },
                ].map((grade) => (
                  <div key={grade.semester} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{grade.semester}</h3>
                      <p className="text-sm text-gray-600">SGPA: {grade.sgpa}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={grade.status === "Current" ? "default" : "secondary"}>{grade.status}</Badge>
                      <p className="text-sm text-gray-600 mt-1">CGPA: {grade.cgpa}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Status</CardTitle>
                <CardDescription>Payment history and pending dues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-green-800">Current Semester Fee</h3>
                      <p className="text-sm text-green-600">Semester 6 - 2024</p>
                    </div>
                    <Badge className="bg-green-600">Paid</Badge>
                  </div>
                  <p className="text-sm text-green-600 mt-2">Amount: ₹45,000 • Paid on: 15 Jan 2024</p>
                </div>

                {[
                  { semester: "Semester 5", amount: "₹45,000", status: "Paid", date: "15 Aug 2023" },
                  { semester: "Semester 4", amount: "₹42,000", status: "Paid", date: "10 Jan 2023" },
                  { semester: "Semester 3", amount: "₹42,000", status: "Paid", date: "15 Aug 2022" },
                ].map((fee) => (
                  <div key={fee.semester} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{fee.semester}</h3>
                      <p className="text-sm text-gray-600">Amount: {fee.amount}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{fee.status}</Badge>
                      <p className="text-sm text-gray-600 mt-1">{fee.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Center</CardTitle>
                <CardDescription>Make payments and manage receipts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => router.push("/student/payments")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Make Payment</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/student/academic-receipts")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Receipt className="h-6 w-6" />
                    <span>View Receipts</span>
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600">• Pay semester fees online</p>
                    <p className="text-sm text-blue-600">• Download payment receipts</p>
                    <p className="text-sm text-blue-600">• View payment history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <StudentProfileEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
