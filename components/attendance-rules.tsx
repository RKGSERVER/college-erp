"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, Settings, Shield } from "lucide-react"

interface AttendanceRulesProps {
  userRole: "student" | "faculty" | "admin" | "employee" | "principal"
}

export interface AttendancePolicy {
  id: string
  name: string
  minAttendancePercentage: number
  warningThreshold: number
  criticalThreshold: number
  consequenceType: "exam_block" | "grade_reduction" | "warning" | "probation"
  appliesTo: "all" | "department" | "course"
  targetId?: string
  isActive: boolean
  graceAllowance?: number
  medicalExemption: boolean
  specialCases?: string[]
}

export function AttendanceRules({ userRole }: AttendanceRulesProps) {
  // Sample policies - in a real app, these would come from an API
  const [policies, setPolicies] = useState<AttendancePolicy[]>([
    {
      id: "policy-1",
      name: "General Attendance Policy",
      minAttendancePercentage: 75,
      warningThreshold: 80,
      criticalThreshold: 75,
      consequenceType: "exam_block",
      appliesTo: "all",
      isActive: true,
      graceAllowance: 5,
      medicalExemption: true,
      specialCases: ["Sports representation", "Cultural events"],
    },
    {
      id: "policy-2",
      name: "Laboratory Course Policy",
      minAttendancePercentage: 85,
      warningThreshold: 90,
      criticalThreshold: 85,
      consequenceType: "grade_reduction",
      appliesTo: "course",
      targetId: "lab-courses",
      isActive: true,
      medicalExemption: true,
    },
    {
      id: "policy-3",
      name: "Computer Science Department Policy",
      minAttendancePercentage: 80,
      warningThreshold: 85,
      criticalThreshold: 80,
      consequenceType: "warning",
      appliesTo: "department",
      targetId: "computer-science",
      isActive: true,
      graceAllowance: 3,
      medicalExemption: true,
    },
  ])

  const [editingPolicy, setEditingPolicy] = useState<AttendancePolicy | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleTogglePolicy = (policyId: string) => {
    setPolicies(policies.map((policy) => (policy.id === policyId ? { ...policy, isActive: !policy.isActive } : policy)))
  }

  const handleEditPolicy = (policy: AttendancePolicy) => {
    setEditingPolicy({ ...policy })
    setIsEditing(true)
  }

  const handleSavePolicy = () => {
    if (editingPolicy) {
      setPolicies(policies.map((policy) => (policy.id === editingPolicy.id ? editingPolicy : policy)))
      setEditingPolicy(null)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingPolicy(null)
    setIsEditing(false)
  }

  const handleAddNewPolicy = () => {
    const newPolicy: AttendancePolicy = {
      id: `policy-${policies.length + 1}`,
      name: "New Policy",
      minAttendancePercentage: 75,
      warningThreshold: 80,
      criticalThreshold: 75,
      consequenceType: "warning",
      appliesTo: "all",
      isActive: false,
      medicalExemption: true,
    }
    setEditingPolicy(newPolicy)
    setIsEditing(true)
  }

  const renderConsequenceBadge = (type: string) => {
    switch (type) {
      case "exam_block":
        return <Badge variant="destructive">Exam Block</Badge>
      case "grade_reduction":
        return <Badge variant="warning">Grade Reduction</Badge>
      case "warning":
        return <Badge variant="secondary">Warning</Badge>
      case "probation":
        return <Badge variant="outline">Probation</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const renderStudentView = () => {
    // For students, we show their current attendance status against applicable policies
    const studentCourses = [
      {
        id: "cs301",
        name: "Database Management Systems",
        attendance: 82,
        isLab: false,
        department: "computer-science",
      },
      { id: "cs302", name: "Software Engineering", attendance: 78, isLab: false, department: "computer-science" },
      { id: "cs303", name: "Computer Networks", attendance: 92, isLab: false, department: "computer-science" },
      { id: "cs304-lab", name: "Machine Learning Lab", attendance: 88, isLab: true, department: "computer-science" },
    ]

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Requirements</CardTitle>
            <CardDescription>Your attendance status against college policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentCourses.map((course) => {
              // Find applicable policies
              const applicablePolicies = policies.filter(
                (p) =>
                  p.isActive &&
                  (p.appliesTo === "all" ||
                    (p.appliesTo === "department" && p.targetId === course.department) ||
                    (p.appliesTo === "course" && p.targetId === "lab-courses" && course.isLab)),
              )

              // Get the most restrictive policy
              const strictestPolicy = applicablePolicies.reduce(
                (prev, current) => (prev.minAttendancePercentage > current.minAttendancePercentage ? prev : current),
                applicablePolicies[0],
              )

              if (!strictestPolicy) return null

              const attendanceStatus =
                course.attendance < strictestPolicy.criticalThreshold
                  ? "critical"
                  : course.attendance < strictestPolicy.warningThreshold
                    ? "warning"
                    : "good"

              return (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-600">
                        Current Attendance: {course.attendance}% (Required: {strictestPolicy.minAttendancePercentage}%)
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Policy: {strictestPolicy.name}</p>
                    </div>
                    <div>
                      {attendanceStatus === "critical" && (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Critical</span>
                        </div>
                      )}
                      {attendanceStatus === "warning" && (
                        <div className="flex items-center text-amber-600">
                          <Info className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Warning</span>
                        </div>
                      )}
                      {attendanceStatus === "good" && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Good Standing</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {attendanceStatus === "critical" && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      Your attendance is below the required threshold. You may not be eligible for final exams.
                      {strictestPolicy.medicalExemption && (
                        <span className="block mt-1">
                          Medical exemptions may apply. Please contact your department.
                        </span>
                      )}
                    </div>
                  )}

                  {attendanceStatus === "warning" && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      Your attendance is below the warning threshold. Please improve your attendance to avoid
                      consequences.
                    </div>
                  )}

                  {/* Attendance improvement calculator */}
                  {(attendanceStatus === "critical" || attendanceStatus === "warning") && (
                    <div className="mt-3 text-sm">
                      <p className="font-medium">Attendance Improvement Plan:</p>
                      <p>
                        You need to attend{" "}
                        <span className="font-bold">
                          {Math.ceil(
                            (strictestPolicy.minAttendancePercentage * 30 - course.attendance * 25) /
                              (100 - strictestPolicy.minAttendancePercentage),
                          )}
                        </span>{" "}
                        more classes consecutively to reach the minimum requirement.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderFacultyView = () => {
    // For faculty, we show class attendance statistics and at-risk students
    const courseStudents = [
      { id: "stu001", name: "John Smith", attendance: 92, status: "good" },
      { id: "stu002", name: "Emily Davis", attendance: 78, status: "warning" },
      { id: "stu003", name: "Michael Brown", attendance: 65, status: "critical" },
      { id: "stu004", name: "Sarah Wilson", attendance: 85, status: "good" },
      { id: "stu005", name: "David Johnson", attendance: 72, status: "warning" },
    ]

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Class Attendance Overview</CardTitle>
            <CardDescription>Monitor student attendance against policy requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Database Management Systems (CS301)</h3>
                  <p className="text-sm text-gray-600">Required Attendance: 75%</p>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="good">Good Standing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {courseStudents.map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">ID: {student.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{student.attendance}%</span>
                        {student.status === "critical" && <Badge variant="destructive">Critical</Badge>}
                        {student.status === "warning" && <Badge variant="warning">Warning</Badge>}
                        {student.status === "good" && <Badge variant="default">Good</Badge>}
                      </div>
                      <Button size="sm" variant="outline" className="mt-1">
                        Send Alert
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Attendance Summary</h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="text-sm text-gray-600">Good Standing</p>
                    <p className="font-bold text-green-600">2</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="text-sm text-gray-600">Warning</p>
                    <p className="font-bold text-amber-600">2</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <p className="text-sm text-gray-600">Critical</p>
                    <p className="font-bold text-red-600">1</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderAdminView = () => {
    return (
      <Tabs defaultValue="policies">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policies">Attendance Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Attendance Policies</h2>
            <Button onClick={handleAddNewPolicy}>
              <Settings className="h-4 w-4 mr-2" />
              Add New Policy
            </Button>
          </div>

          {isEditing && editingPolicy ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingPolicy.id ? "Edit Policy" : "Create New Policy"}</CardTitle>
                <CardDescription>Configure attendance requirements and consequences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="policy-name">Policy Name</Label>
                  <Input
                    id="policy-name"
                    value={editingPolicy.name}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-attendance">Minimum Attendance (%)</Label>
                    <Input
                      id="min-attendance"
                      type="number"
                      min="0"
                      max="100"
                      value={editingPolicy.minAttendancePercentage}
                      onChange={(e) =>
                        setEditingPolicy({
                          ...editingPolicy,
                          minAttendancePercentage: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warning-threshold">Warning Threshold (%)</Label>
                    <Input
                      id="warning-threshold"
                      type="number"
                      min="0"
                      max="100"
                      value={editingPolicy.warningThreshold}
                      onChange={(e) =>
                        setEditingPolicy({
                          ...editingPolicy,
                          warningThreshold: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consequence">Consequence Type</Label>
                  <Select
                    value={editingPolicy.consequenceType}
                    onValueChange={(value: any) =>
                      setEditingPolicy({
                        ...editingPolicy,
                        consequenceType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam_block">Exam Block</SelectItem>
                      <SelectItem value="grade_reduction">Grade Reduction</SelectItem>
                      <SelectItem value="warning">Warning Only</SelectItem>
                      <SelectItem value="probation">Academic Probation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applies-to">Applies To</Label>
                  <Select
                    value={editingPolicy.appliesTo}
                    onValueChange={(value: any) =>
                      setEditingPolicy({
                        ...editingPolicy,
                        appliesTo: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="department">Specific Department</SelectItem>
                      <SelectItem value="course">Specific Course Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingPolicy.appliesTo !== "all" && (
                  <div className="space-y-2">
                    <Label htmlFor="target-id">
                      {editingPolicy.appliesTo === "department" ? "Department" : "Course Type"}
                    </Label>
                    <Select
                      value={editingPolicy.targetId}
                      onValueChange={(value) =>
                        setEditingPolicy({
                          ...editingPolicy,
                          targetId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {editingPolicy.appliesTo === "department" ? (
                          <>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="mechanical">Mechanical</SelectItem>
                            <SelectItem value="civil">Civil</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="lab-courses">Laboratory Courses</SelectItem>
                            <SelectItem value="theory-courses">Theory Courses</SelectItem>
                            <SelectItem value="electives">Elective Courses</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="grace-allowance">Grace Allowance (Classes)</Label>
                  <Input
                    id="grace-allowance"
                    type="number"
                    min="0"
                    value={editingPolicy.graceAllowance || 0}
                    onChange={(e) =>
                      setEditingPolicy({
                        ...editingPolicy,
                        graceAllowance: Number.parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-sm text-gray-500">Number of classes that can be missed without penalty</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="medical-exemption"
                    checked={editingPolicy.medicalExemption}
                    onCheckedChange={(checked) =>
                      setEditingPolicy({
                        ...editingPolicy,
                        medicalExemption: checked,
                      })
                    }
                  />
                  <Label htmlFor="medical-exemption">Allow Medical Exemptions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="policy-active"
                    checked={editingPolicy.isActive}
                    onCheckedChange={(checked) =>
                      setEditingPolicy({
                        ...editingPolicy,
                        isActive: checked,
                      })
                    }
                  />
                  <Label htmlFor="policy-active">Policy Active</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePolicy}>Save Policy</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => (
                <Card key={policy.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{policy.name}</h3>
                          <Badge variant={policy.isActive ? "default" : "secondary"}>
                            {policy.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Min: {policy.minAttendancePercentage}% | Warning: {policy.warningThreshold}%
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-600">
                            Applies to:{" "}
                            {policy.appliesTo === "all"
                              ? "All Courses"
                              : policy.appliesTo === "department"
                                ? `${policy.targetId} Department`
                                : `${policy.targetId}`}
                          </p>
                          {renderConsequenceBadge(policy.consequenceType)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditPolicy(policy)}>
                          Edit
                        </Button>
                        <Switch checked={policy.isActive} onCheckedChange={() => handleTogglePolicy(policy.id)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Analytics</CardTitle>
              <CardDescription>Institution-wide attendance statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Average Attendance</h3>
                      <p className="text-3xl font-bold mt-1">82.7%</p>
                      <p className="text-xs text-gray-500 mt-1">Across all departments</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Students Below Threshold</h3>
                      <p className="text-3xl font-bold mt-1">187</p>
                      <p className="text-xs text-gray-500 mt-1">7.6% of total students</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600">Departments at Risk</h3>
                      <p className="text-3xl font-bold mt-1">2</p>
                      <p className="text-xs text-gray-500 mt-1">Below 80% average</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Department-wise Attendance</h3>
                <div className="space-y-4">
                  {[
                    { dept: "Computer Science", attendance: 86.2, students: 456, atRisk: 32 },
                    { dept: "Electronics", attendance: 82.5, students: 389, atRisk: 41 },
                    { dept: "Mechanical", attendance: 78.9, students: 512, atRisk: 68 },
                    { dept: "Civil", attendance: 79.2, students: 298, atRisk: 46 },
                  ].map((dept) => (
                    <div key={dept.dept} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dept.dept}</span>
                        <span
                          className={`text-sm font-medium ${dept.attendance < 80 ? "text-red-600" : "text-green-600"}`}
                        >
                          {dept.attendance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${dept.attendance < 80 ? "bg-red-500" : "bg-green-500"}`}
                          style={{ width: `${dept.attendance}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{dept.students} students</span>
                        <span>{dept.atRisk} at risk</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Attendance Trends (Last 6 Months)</h3>
                <div className="h-40 flex items-end space-x-2">
                  {[78.2, 80.5, 82.1, 79.8, 81.3, 82.7].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full ${value < 80 ? "bg-red-400" : "bg-green-400"} rounded-t`}
                        style={{ height: `${value}px` }}
                      ></div>
                      <span className="text-xs mt-1">{["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  const renderPrincipalView = () => {
    // Similar to admin view but with more high-level analytics
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Policy Effectiveness</CardTitle>
            <CardDescription>Analysis of attendance policies and their impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-600">Overall Compliance</h3>
                    <p className="text-3xl font-bold mt-1">92.4%</p>
                    <p className="text-xs text-gray-500 mt-1">Students meeting requirements</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-600">YoY Improvement</h3>
                    <p className="text-3xl font-bold mt-1">+3.2%</p>
                    <p className="text-xs text-gray-500 mt-1">Compared to last year</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-600">Active Policies</h3>
                    <p className="text-3xl font-bold mt-1">{policies.filter((p) => p.isActive).length}</p>
                    <p className="text-xs text-gray-500 mt-1">Across all departments</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Policy Impact Analysis</h3>
              <div className="space-y-4">
                {policies
                  .filter((p) => p.isActive)
                  .map((policy) => (
                    <div key={policy.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{policy.name}</h4>
                        <Badge variant="outline">
                          {policy.appliesTo === "all"
                            ? "Global"
                            : policy.appliesTo === "department"
                              ? "Department"
                              : "Course-specific"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Requirement: {policy.minAttendancePercentage}% minimum attendance
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Compliance Rate</p>
                          <p className="font-medium">
                            {policy.id === "policy-1" ? "91.2%" : policy.id === "policy-2" ? "88.5%" : "93.7%"}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Students Affected</p>
                          <p className="font-medium">
                            {policy.id === "policy-1" ? "2,456" : policy.id === "policy-2" ? "876" : "456"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Recommendations</h3>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-blue-700">
                <li>Consider increasing the warning threshold for Mechanical Department to improve compliance</li>
                <li>Laboratory course policy is showing positive results with 3.8% improvement since implementation</li>
                <li>Medical exemption requests have decreased by 12% since last semester</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {userRole === "student" && renderStudentView()}
      {userRole === "faculty" && renderFacultyView()}
      {(userRole === "admin" || userRole === "employee") && renderAdminView()}
      {userRole === "principal" && renderPrincipalView()}
    </div>
  )
}
