"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Plus, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface AttendanceCalendarProps {
  userRole: "student" | "faculty" | "admin" | "employee" | "principal"
}

interface AttendanceRecord {
  date: string
  status: "present" | "absent" | "late" | "leave" | "holiday"
  subject?: string
  hours?: number
  notes?: string
}

export function AttendanceCalendar({ userRole }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  // Mock data - in real app, this would come from API
  const attendanceData: Record<string, AttendanceRecord> = {
    "2024-01-15": { date: "2024-01-15", status: "present", subject: "Database Management", hours: 8 },
    "2024-01-14": { date: "2024-01-14", status: "present", subject: "Software Engineering", hours: 8 },
    "2024-01-13": { date: "2024-01-13", status: "late", subject: "Computer Networks", hours: 7.5 },
    "2024-01-12": { date: "2024-01-12", status: "leave", notes: "Medical appointment", hours: 0 },
    "2024-01-11": { date: "2024-01-11", status: "present", subject: "Machine Learning", hours: 8 },
    "2024-01-10": { date: "2024-01-10", status: "absent", subject: "Database Management", hours: 0 },
    "2024-01-09": { date: "2024-01-09", status: "present", subject: "Software Engineering", hours: 8 },
    "2024-01-08": { date: "2024-01-08", status: "present", subject: "Computer Networks", hours: 8 },
    "2024-01-07": { date: "2024-01-07", status: "holiday", notes: "Weekend", hours: 0 },
    "2024-01-06": { date: "2024-01-06", status: "holiday", notes: "Weekend", hours: 0 },
  }

  const courses = ["Database Management", "Software Engineering", "Computer Networks", "Machine Learning"]
  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "leave":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "holiday":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getStatusIcon = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-3 w-3" />
      case "absent":
        return <XCircle className="h-3 w-3" />
      case "late":
        return <AlertCircle className="h-3 w-3" />
      case "leave":
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === "next" ? 1 : -1), 1))
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 border border-gray-100"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
      const attendance = attendanceData[dateStr]
      const isToday = dateStr === new Date().toISOString().split("T")[0]

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-100 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? "ring-2 ring-blue-500" : ""
          } ${attendance ? getStatusColor(attendance.status) : ""}`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</span>
            {attendance && getStatusIcon(attendance.status)}
          </div>
          {attendance && (
            <div className="mt-1">
              <div className="text-xs truncate">{attendance.subject || "Work"}</div>
              {userRole === "employee" && attendance.hours && (
                <div className="text-xs text-gray-600">{attendance.hours}h</div>
              )}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  const renderRoleSpecificControls = () => {
    switch (userRole) {
      case "faculty":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Class Attendance</DialogTitle>
                  <DialogDescription>Select students and mark their attendance for today's class</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Course</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label>Students (45 total)</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {["John Smith", "Emily Davis", "Michael Brown", "Sarah Wilson", "David Johnson"].map(
                        (student) => (
                          <div key={student} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{student}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="text-green-600">
                                Present
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                Absent
                              </Button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <Button className="w-full">Save Attendance</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )

      case "admin":
      case "principal":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const renderAttendanceStats = () => {
    const totalDays = Object.keys(attendanceData).length
    const presentDays = Object.values(attendanceData).filter((record) => record.status === "present").length
    const absentDays = Object.values(attendanceData).filter((record) => record.status === "absent").length
    const lateDays = Object.values(attendanceData).filter((record) => record.status === "late").length
    const leaveDays = Object.values(attendanceData).filter((record) => record.status === "leave").length

    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0

    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="font-semibold">{presentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="font-semibold">{absentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="font-semibold">{lateDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Leave</p>
                <p className="font-semibold">{leaveDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="font-semibold">{attendancePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderAttendanceStats()}
      {renderRoleSpecificControls()}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
              <CardDescription>
                {userRole === "student" && "Your attendance record"}
                {userRole === "faculty" && "Class attendance management"}
                {userRole === "employee" && "Work attendance tracking"}
                {(userRole === "admin" || userRole === "principal") && "Institution attendance overview"}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendarGrid()}</div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center">
                <CheckCircle className="h-2 w-2 text-green-600" />
              </div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded flex items-center justify-center">
                <XCircle className="h-2 w-2 text-red-600" />
              </div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center">
                <AlertCircle className="h-2 w-2 text-yellow-600" />
              </div>
              <span className="text-sm">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded flex items-center justify-center">
                <Clock className="h-2 w-2 text-blue-600" />
              </div>
              <span className="text-sm">Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-sm">Holiday</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && attendanceData[selectedDate] && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attendance Details</DialogTitle>
              <DialogDescription>
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(attendanceData[selectedDate].status)}>
                  {attendanceData[selectedDate].status.charAt(0).toUpperCase() +
                    attendanceData[selectedDate].status.slice(1)}
                </Badge>
              </div>
              {attendanceData[selectedDate].subject && (
                <div>
                  <Label>Subject/Course</Label>
                  <p className="text-sm text-gray-600">{attendanceData[selectedDate].subject}</p>
                </div>
              )}
              {attendanceData[selectedDate].hours !== undefined && (
                <div>
                  <Label>Hours</Label>
                  <p className="text-sm text-gray-600">{attendanceData[selectedDate].hours} hours</p>
                </div>
              )}
              {attendanceData[selectedDate].notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-600">{attendanceData[selectedDate].notes}</p>
                </div>
              )}
              {userRole === "faculty" && (
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select defaultValue={attendanceData[selectedDate].status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">Update Attendance</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
