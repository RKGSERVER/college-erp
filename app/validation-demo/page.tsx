"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentRegistrationForm } from "@/components/validated-forms/student-registration-form"
import { CourseForm } from "@/components/validated-forms/course-form"
import { AttendanceForm } from "@/components/validated-forms/attendance-form"
import { ScholarshipForm } from "@/components/validated-forms/scholarship-form"
import { NotificationForm } from "@/components/validated-forms/notification-form"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield } from "lucide-react"

// Mock data
const mockDepartments = [
  { id: "dept-1", name: "Computer Science" },
  { id: "dept-2", name: "Electronics Engineering" },
  { id: "dept-3", name: "Mechanical Engineering" },
  { id: "dept-4", name: "Civil Engineering" },
]

const mockStudents = [
  { id: "stu-1", name: "John Smith", rollNumber: "CS2024001" },
  { id: "stu-2", name: "Jane Doe", rollNumber: "CS2024002" },
  { id: "stu-3", name: "Mike Johnson", rollNumber: "CS2024003" },
]

const mockCourses = [
  { id: "course-1", name: "Database Management Systems", code: "CS301" },
  { id: "course-2", name: "Data Structures", code: "CS201" },
  { id: "course-3", name: "Computer Networks", code: "CS401" },
]

const mockUsers = [
  { id: "user-1", name: "John Smith", role: "student", email: "john@college.edu" },
  { id: "user-2", name: "Dr. Sarah Johnson", role: "faculty", email: "sarah@college.edu" },
  { id: "user-3", name: "Admin User", role: "admin", email: "admin@college.edu" },
]

export default function ValidationDemoPage() {
  const [submissions, setSubmissions] = useState<any[]>([])

  const handleFormSubmit = async (formType: string, data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmissions((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: formType,
        data,
        timestamp: new Date().toISOString(),
        status: "success",
      },
    ])

    console.log(`${formType} submitted:`, data)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Validation System Demo</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive form validation system with real-time validation, error handling, and security features for the
          College ERP application.
        </p>
      </div>

      {/* Validation Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Validation Features</span>
          </CardTitle>
          <CardDescription>Key features of the validation system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Real-time Validation</h3>
                <p className="text-sm text-gray-600">Instant feedback as users type</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Comprehensive Rules</h3>
                <p className="text-sm text-gray-600">Email, phone, password, and custom validations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Security Features</h3>
                <p className="text-sm text-gray-600">Input sanitization and XSS protection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Role-based Access</h3>
                <p className="text-sm text-gray-600">Permission-based form access</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Custom Validators</h3>
                <p className="text-sm text-gray-600">Business logic validation</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Error Handling</h3>
                <p className="text-sm text-gray-600">Clear error messages and recovery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Demos */}
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="student">Student Registration</TabsTrigger>
          <TabsTrigger value="course">Course Management</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="scholarship">Scholarship</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-4">
          <StudentRegistrationForm
            departments={mockDepartments}
            onSubmit={(data) => handleFormSubmit("Student Registration", data)}
          />
        </TabsContent>

        <TabsContent value="course" className="space-y-4">
          <CourseForm
            departments={mockDepartments}
            onSubmit={(data) => handleFormSubmit("Course Creation", data)}
            onCancel={() => console.log("Course form cancelled")}
          />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <AttendanceForm
            students={mockStudents}
            courses={mockCourses}
            onSubmit={(data) => handleFormSubmit("Attendance", data)}
          />
        </TabsContent>

        <TabsContent value="scholarship" className="space-y-4">
          <ScholarshipForm
            onSubmit={(data) => handleFormSubmit("Scholarship", data)}
            onCancel={() => console.log("Scholarship form cancelled")}
          />
        </TabsContent>

        <TabsContent value="notification" className="space-y-4">
          <NotificationForm
            users={mockUsers}
            onSubmit={(data) => handleFormSubmit("Notification", data)}
            onCancel={() => console.log("Notification form cancelled")}
          />
        </TabsContent>
      </Tabs>

      {/* Submission Log */}
      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Log of successfully validated and submitted forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions
                .slice(-5)
                .reverse()
                .map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">{submission.type}</h4>
                        <p className="text-sm text-gray-600">{new Date(submission.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Submission data:", submission.data)}
                    >
                      View Data
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
