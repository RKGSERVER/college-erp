"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FileText, User, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendanceCalendar } from "@/components/attendance-calendar"

export default function EmployeeDashboard() {
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
            <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Mike Wilson</h1>
              <p className="text-sm text-gray-600">Administrative Staff</p>
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
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Hours This Week</p>
                  <p className="font-semibold">38.5 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="font-semibold">7 Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Current assignments and responsibilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    task: "Process student admission documents",
                    priority: "High",
                    due: "Today",
                    status: "In Progress",
                  },
                  {
                    task: "Update faculty contact information",
                    priority: "Medium",
                    due: "Tomorrow",
                    status: "Pending",
                  },
                  { task: "Prepare monthly attendance report", priority: "High", due: "Jan 20", status: "Pending" },
                  { task: "Organize department meeting", priority: "Low", due: "Jan 25", status: "Completed" },
                  { task: "Update student records", priority: "Medium", due: "Jan 18", status: "In Progress" },
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{task.task}</h3>
                      <p className="text-sm text-gray-600">Due: {task.due}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          task.priority === "High"
                            ? "destructive"
                            : task.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "default"
                            : task.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Attendance Calendar</CardTitle>
                <CardDescription>Track your work attendance and hours</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCalendar userRole="employee" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Submit and track your leave applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Submit New Leave Request</Button>

                {[
                  {
                    type: "Sick Leave",
                    dates: "Jan 12, 2024",
                    days: 1,
                    status: "Approved",
                    reason: "Medical appointment",
                  },
                  {
                    type: "Casual Leave",
                    dates: "Dec 25-26, 2023",
                    days: 2,
                    status: "Approved",
                    reason: "Personal work",
                  },
                  {
                    type: "Annual Leave",
                    dates: "Nov 15-19, 2023",
                    days: 5,
                    status: "Approved",
                    reason: "Family vacation",
                  },
                  { type: "Sick Leave", dates: "Jan 20, 2024", days: 1, status: "Pending", reason: "Doctor visit" },
                ].map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{request.type}</h3>
                      <p className="text-sm text-gray-600">
                        {request.dates} • {request.days} day(s)
                      </p>
                      <p className="text-sm text-gray-500">{request.reason}</p>
                    </div>
                    <Badge
                      variant={
                        request.status === "Approved"
                          ? "default"
                          : request.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Profile</CardTitle>
                <CardDescription>Your personal and professional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span>Mike Wilson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employee ID:</span>
                        <span>EMP001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>mike.wilson@college.edu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Job Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span>Administration</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Position:</span>
                        <span>Administrative Staff</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Join Date:</span>
                        <span>March 15, 2020</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager:</span>
                        <span>Dr. Robert Smith</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
