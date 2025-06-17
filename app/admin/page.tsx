"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, DollarSign, User, Bell, LogOut, Plus, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendanceCalendar } from "@/components/attendance-calendar"

export default function AdminDashboard() {
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
            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">System Administrator</p>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="font-semibold">2,456</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Faculty</p>
                  <p className="font-semibold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="font-semibold">₹1.2M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="font-semibold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "New student registration", user: "John Doe", time: "2 hours ago", type: "registration" },
                    { action: "Faculty added new course", user: "Dr. Smith", time: "4 hours ago", type: "course" },
                    { action: "Fee payment received", user: "Emily Davis", time: "6 hours ago", type: "payment" },
                    { action: "Grade submitted", user: "Prof. Johnson", time: "8 hours ago", type: "grade" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{activity.action}</h3>
                        <p className="text-sm text-gray-600">by {activity.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{activity.type}</Badge>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { service: "Database", status: "Operational", uptime: "99.9%" },
                    { service: "Authentication", status: "Operational", uptime: "99.8%" },
                    { service: "File Storage", status: "Operational", uptime: "99.7%" },
                    { service: "Email Service", status: "Maintenance", uptime: "98.5%" },
                  ].map((service) => (
                    <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{service.service}</h3>
                        <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                      </div>
                      <Badge variant={service.status === "Operational" ? "default" : "destructive"}>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">User Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Dr. Sarah Johnson", role: "Faculty", department: "Computer Science", status: "Active" },
                { name: "John Smith", role: "Student", department: "Computer Science", status: "Active" },
                { name: "Mike Wilson", role: "Employee", department: "Administration", status: "Active" },
                { name: "Emily Davis", role: "Student", department: "Electronics", status: "Inactive" },
              ].map((user, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600">
                          {user.role} • {user.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="academics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Management</CardTitle>
                <CardDescription>Manage courses, departments, and academic programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Departments</h3>
                    <div className="space-y-2">
                      {[
                        { name: "Computer Science", students: 456, faculty: 28 },
                        { name: "Electronics", students: 389, faculty: 22 },
                        { name: "Mechanical", students: 512, faculty: 31 },
                        { name: "Civil", students: 298, faculty: 19 },
                      ].map((dept) => (
                        <div key={dept.name} className="flex justify-between text-sm">
                          <span>{dept.name}</span>
                          <span className="text-gray-600">
                            {dept.students} students, {dept.faculty} faculty
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Course Statistics</h3>
                    <div className="space-y-2">
                      {[
                        { semester: "Semester 1", courses: 8, enrolled: 245 },
                        { semester: "Semester 2", courses: 9, enrolled: 234 },
                        { semester: "Semester 3", courses: 10, enrolled: 223 },
                        { semester: "Semester 4", courses: 11, enrolled: 212 },
                      ].map((sem) => (
                        <div key={sem.semester} className="flex justify-between text-sm">
                          <span>{sem.semester}</span>
                          <span className="text-gray-600">
                            {sem.courses} courses, {sem.enrolled} enrolled
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Institution Attendance Overview</CardTitle>
                <CardDescription>Monitor attendance across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCalendar userRole="admin" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Revenue, expenses, and financial reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-900">₹1,245,000</p>
                    <p className="text-sm text-green-600">This semester</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800">Pending Fees</h3>
                    <p className="text-2xl font-bold text-blue-900">₹156,000</p>
                    <p className="text-sm text-blue-600">From 89 students</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-medium text-purple-800">Expenses</h3>
                    <p className="text-2xl font-bold text-purple-900">₹890,000</p>
                    <p className="text-sm text-purple-600">This semester</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Recent Transactions</h3>
                  {[
                    { student: "John Smith", amount: "₹45,000", type: "Fee Payment", date: "2024-01-15" },
                    { student: "Emily Davis", amount: "₹42,000", type: "Fee Payment", date: "2024-01-14" },
                    { student: "Michael Brown", amount: "₹45,000", type: "Fee Payment", date: "2024-01-13" },
                    { student: "Sarah Wilson", amount: "₹40,000", type: "Partial Payment", date: "2024-01-12" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{transaction.student}</h4>
                        <p className="text-sm text-gray-600">{transaction.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
