"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, User, Bell, LogOut, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendanceCalendar } from "@/components/attendance-calendar"

export default function FacultyDashboard() {
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
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Dr. Sarah Johnson</h1>
              <p className="text-sm text-gray-600">Computer Science Department</p>
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
                  <p className="text-sm text-gray-600">Courses Teaching</p>
                  <p className="font-semibold">4 Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="font-semibold">156 Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Current Courses</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
            <div className="space-y-3">
              {[
                {
                  code: "CS301",
                  name: "Database Management Systems",
                  students: 45,
                  semester: "6th",
                  schedule: "Mon, Wed, Fri - 10:00 AM",
                },
                {
                  code: "CS201",
                  name: "Data Structures",
                  students: 52,
                  semester: "4th",
                  schedule: "Tue, Thu - 2:00 PM",
                },
                {
                  code: "CS401",
                  name: "Advanced Algorithms",
                  students: 28,
                  semester: "8th",
                  schedule: "Mon, Wed - 11:00 AM",
                },
                {
                  code: "CS101",
                  name: "Programming Fundamentals",
                  students: 31,
                  semester: "2nd",
                  schedule: "Daily - 9:00 AM",
                },
              ].map((course) => (
                <Card key={course.code}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{course.name}</h3>
                        <p className="text-sm text-gray-600">
                          {course.code} • {course.semester} Semester
                        </p>
                        <p className="text-sm text-gray-500">{course.schedule}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{course.students} Students</Badge>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm">Manage</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage students across all your courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "STU001", name: "John Smith", course: "CS301", semester: "6th", attendance: "92%" },
                  { id: "STU002", name: "Emily Davis", course: "CS201", semester: "4th", attendance: "88%" },
                  { id: "STU003", name: "Michael Brown", course: "CS401", semester: "8th", attendance: "95%" },
                  { id: "STU004", name: "Sarah Wilson", course: "CS101", semester: "2nd", attendance: "85%" },
                ].map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-600">
                        {student.id} • {student.course} • {student.semester} Sem
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{student.attendance}</Badge>
                      <div className="mt-1">
                        <Button size="sm" variant="outline">
                          Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>Mark and track student attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCalendar userRole="faculty" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Management</CardTitle>
                <CardDescription>Enter and manage student grades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">Pending Evaluations</h3>
                    <p className="text-sm text-gray-600">CS301 - Mid-term Exam (45 students)</p>
                  </div>
                  <Button>Enter Grades</Button>
                </div>

                {[
                  { course: "CS201", exam: "Final Exam", submitted: 52, total: 52, status: "Completed" },
                  { course: "CS401", exam: "Assignment 3", submitted: 28, total: 28, status: "Completed" },
                  { course: "CS101", exam: "Quiz 2", submitted: 31, total: 31, status: "Completed" },
                  { course: "CS301", exam: "Assignment 2", submitted: 43, total: 45, status: "Pending" },
                ].map((grade) => (
                  <div
                    key={`${grade.course}-${grade.exam}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">
                        {grade.course} - {grade.exam}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {grade.submitted}/{grade.total} graded
                      </p>
                    </div>
                    <Badge variant={grade.status === "Completed" ? "default" : "destructive"}>{grade.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
