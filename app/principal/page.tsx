"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, BookOpen, User, Bell, LogOut, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendanceCalendar } from "@/components/attendance-calendar"

export default function PrincipalDashboard() {
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
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Dr. Margaret Thompson</h1>
              <p className="text-sm text-gray-600">Principal</p>
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
                  <p className="text-sm text-gray-600">Faculty Members</p>
                  <p className="font-semibold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="font-semibold">94.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Placement Rate</p>
                  <p className="font-semibold">87.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>College Performance Summary</CardTitle>
                  <CardDescription>Key metrics and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-800">Academic Excellence</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Average CGPA:</span>
                          <span className="font-medium">8.2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Students with 9+ CGPA:</span>
                          <span className="font-medium">342 (14%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pass Rate:</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-800">Placement Statistics</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Students Placed:</span>
                          <span className="font-medium">456 (87.5%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Package:</span>
                          <span className="font-medium">₹6.2 LPA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Highest Package:</span>
                          <span className="font-medium">₹24 LPA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Highlights</CardTitle>
                  <CardDescription>Important updates and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      title: "NAAC Accreditation Renewed",
                      description: "College received A+ grade from NAAC",
                      date: "Jan 10, 2024",
                      type: "achievement",
                    },
                    {
                      title: "New Research Lab Inaugurated",
                      description: "AI & ML Research Lab opened in CS Department",
                      date: "Jan 8, 2024",
                      type: "infrastructure",
                    },
                    {
                      title: "Industry Partnership Signed",
                      description: "MOU signed with TechCorp for internships",
                      date: "Jan 5, 2024",
                      type: "partnership",
                    },
                    {
                      title: "Student Achievement",
                      description: "Team won National Hackathon Competition",
                      date: "Jan 3, 2024",
                      type: "achievement",
                    },
                  ].map((highlight, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{highlight.title}</h3>
                        <p className="text-sm text-gray-600">{highlight.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{highlight.type}</Badge>
                        <p className="text-sm text-gray-500 mt-1">{highlight.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Overview</CardTitle>
                <CardDescription>Department-wise performance and statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { dept: "Computer Science", students: 456, faculty: 28, avgCGPA: 8.4, placement: 92 },
                  { dept: "Electronics & Communication", students: 389, faculty: 22, avgCGPA: 8.1, placement: 85 },
                  { dept: "Mechanical Engineering", students: 512, faculty: 31, avgCGPA: 7.9, placement: 78 },
                  { dept: "Civil Engineering", students: 298, faculty: 19, avgCGPA: 7.8, placement: 72 },
                  { dept: "Information Technology", students: 334, faculty: 24, avgCGPA: 8.3, placement: 89 },
                  { dept: "Electrical Engineering", students: 267, faculty: 18, avgCGPA: 8.0, placement: 81 },
                ].map((dept) => (
                  <Card key={dept.dept}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{dept.dept}</h3>
                          <p className="text-sm text-gray-600">
                            {dept.students} students • {dept.faculty} faculty
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex space-x-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Avg CGPA</p>
                              <Badge variant="secondary">{dept.avgCGPA}</Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Placement</p>
                              <Badge variant="default">{dept.placement}%</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Institution Attendance Analytics</CardTitle>
                <CardDescription>Comprehensive attendance overview and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCalendar userRole="principal" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Institutional Reports</CardTitle>
                <CardDescription>Generate and view various institutional reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Academic Performance Report",
                      description: "Semester-wise academic analysis",
                      status: "Ready",
                      date: "Jan 15, 2024",
                    },
                    {
                      title: "Financial Summary",
                      description: "Revenue and expense breakdown",
                      status: "Ready",
                      date: "Jan 14, 2024",
                    },
                    {
                      title: "Faculty Performance Review",
                      description: "Annual faculty evaluation report",
                      status: "In Progress",
                      date: "Jan 20, 2024",
                    },
                    {
                      title: "Infrastructure Audit",
                      description: "Facilities and equipment assessment",
                      status: "Pending",
                      date: "Jan 25, 2024",
                    },
                    {
                      title: "Student Satisfaction Survey",
                      description: "Annual student feedback analysis",
                      status: "Ready",
                      date: "Jan 12, 2024",
                    },
                    {
                      title: "Placement Statistics",
                      description: "Comprehensive placement report",
                      status: "Ready",
                      date: "Jan 10, 2024",
                    },
                  ].map((report, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{report.title}</h3>
                            <p className="text-sm text-gray-600">{report.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Due: {report.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                report.status === "Ready"
                                  ? "default"
                                  : report.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {report.status}
                            </Badge>
                            {report.status === "Ready" && (
                              <Button size="sm" variant="outline" className="mt-2">
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items requiring your approval and decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    type: "Budget Request",
                    title: "New Laboratory Equipment",
                    department: "Computer Science",
                    amount: "₹15,00,000",
                    priority: "High",
                  },
                  {
                    type: "Faculty Recruitment",
                    title: "Assistant Professor Position",
                    department: "Electronics",
                    amount: "₹8,00,000/year",
                    priority: "Medium",
                  },
                  {
                    type: "Infrastructure",
                    title: "Hostel Renovation Project",
                    department: "Administration",
                    amount: "₹25,00,000",
                    priority: "High",
                  },
                  {
                    type: "Academic Policy",
                    title: "New Examination Guidelines",
                    department: "Academic Office",
                    amount: "N/A",
                    priority: "Medium",
                  },
                  {
                    type: "Student Request",
                    title: "Cultural Event Funding",
                    department: "Student Affairs",
                    amount: "₹2,50,000",
                    priority: "Low",
                  },
                ].map((approval, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline">{approval.type}</Badge>
                            <Badge
                              variant={
                                approval.priority === "High"
                                  ? "destructive"
                                  : approval.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {approval.priority}
                            </Badge>
                          </div>
                          <h3 className="font-medium">{approval.title}</h3>
                          <p className="text-sm text-gray-600">{approval.department}</p>
                          <p className="text-sm text-gray-500">Amount: {approval.amount}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
