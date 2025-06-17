"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { attendanceSchema } from "@/lib/validation"
import { Calendar, Loader2, Users } from "lucide-react"
import { z } from "zod"

interface AttendanceFormProps {
  students: { id: string; name: string; rollNumber: string }[]
  courses: { id: string; name: string; code: string }[]
  onSubmit: (data: z.infer<typeof attendanceSchema>[]) => Promise<void>
  selectedDate?: string
  selectedCourse?: string
}

export function AttendanceForm({ students, courses, onSubmit, selectedDate, selectedCourse }: AttendanceFormProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<
      string,
      {
        status: string
        notes?: string
      }
    >
  >({})

  const { values, errors, isValid, isSubmitting, handleSubmit, getFieldProps } = useFormValidation({
    schema: z.object({
      courseId: z.string().uuid("Please select a valid course"),
      date: attendanceSchema.shape.date,
    }),
    initialValues: {
      courseId: selectedCourse || "",
      date: selectedDate || new Date().toISOString().split("T")[0],
    },
    validateOnChange: true,
    onSubmit: async (formData) => {
      const attendanceData = students.map((student) => ({
        userId: student.id,
        courseId: formData.courseId,
        date: formData.date,
        status: attendanceRecords[student.id]?.status || "absent",
        notes: attendanceRecords[student.id]?.notes || "",
      }))

      await onSubmit(attendanceData)
    },
  })

  const updateAttendance = (studentId: string, field: string, value: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }))
  }

  const markAllAs = (status: string) => {
    const newRecords: Record<string, { status: string; notes?: string }> = {}
    students.forEach((student) => {
      newRecords[student.id] = {
        status,
        notes: attendanceRecords[student.id]?.notes || "",
      }
    })
    setAttendanceRecords(newRecords)
  }

  const getAttendanceStats = () => {
    const stats = { present: 0, absent: 0, late: 0, excused: 0 }
    Object.values(attendanceRecords).forEach((record) => {
      if (record.status in stats) {
        stats[record.status as keyof typeof stats]++
      }
    })
    return stats
  }

  const stats = getAttendanceStats()

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Mark Attendance</span>
        </CardTitle>
        <CardDescription>Record student attendance for the selected course and date</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Course"
              name="courseId"
              type="select"
              required
              options={courses.map((course) => ({
                value: course.id,
                label: `${course.code} - ${course.name}`,
              }))}
              {...getFieldProps("courseId")}
            />
            <FormField label="Date" name="date" type="date" required {...getFieldProps("date")} />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => markAllAs("present")}>
              Mark All Present
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => markAllAs("absent")}>
              Mark All Absent
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => markAllAs("late")}>
              Mark All Late
            </Button>
          </div>

          {/* Attendance Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-green-700">Present</div>
            </div>
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-red-700">Absent</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              <div className="text-sm text-yellow-700">Late</div>
            </div>
            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
              <div className="text-sm text-blue-700">Excused</div>
            </div>
          </div>

          {/* Student Attendance List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Student Attendance ({students.length} students)</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <div key={student.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FormField
                        label=""
                        name={`attendance-${student.id}`}
                        type="select"
                        value={attendanceRecords[student.id]?.status || "absent"}
                        options={[
                          { value: "present", label: "Present" },
                          { value: "absent", label: "Absent" },
                          { value: "late", label: "Late" },
                          { value: "excused", label: "Excused" },
                        ]}
                        onChange={(value) => updateAttendance(student.id, "status", value)}
                        className="w-32"
                      />
                    </div>
                  </div>

                  {attendanceRecords[student.id]?.status && attendanceRecords[student.id]?.status !== "present" && (
                    <div className="mt-3">
                      <FormField
                        label=""
                        name={`notes-${student.id}`}
                        type="textarea"
                        placeholder="Add notes (optional)"
                        value={attendanceRecords[student.id]?.notes || ""}
                        onChange={(value) => updateAttendance(student.id, "notes", value)}
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Attendance...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Save Attendance
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
