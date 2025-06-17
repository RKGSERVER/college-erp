"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { courseSchema } from "@/lib/validation"
import { BookOpen, Loader2 } from "lucide-react"
import type { z } from "zod"

interface CourseFormProps {
  initialData?: Partial<z.infer<typeof courseSchema>>
  onSubmit: (data: z.infer<typeof courseSchema>) => Promise<void>
  onCancel: () => void
  departments: { id: string; name: string }[]
  isEditing?: boolean
}

export function CourseForm({ initialData, onSubmit, onCancel, departments, isEditing = false }: CourseFormProps) {
  const { values, errors, isValid, isSubmitting, handleSubmit, getFieldProps } = useFormValidation({
    schema: courseSchema,
    initialValues: initialData || {
      credits: 3,
      semester: 1,
      year: 1,
      maxStudents: 60,
    },
    validateOnChange: true,
    onSubmit,
  })

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>{isEditing ? "Edit Course" : "Create New Course"}</span>
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update course information" : "Add a new course to the curriculum"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Course Code"
                name="courseCode"
                required
                placeholder="CS301"
                description="Unique course identifier (e.g., CS301, EE201)"
                {...getFieldProps("courseCode")}
              />
              <FormField
                label="Department"
                name="departmentId"
                type="select"
                required
                options={departments.map((dept) => ({ value: dept.id, label: dept.name }))}
                {...getFieldProps("departmentId")}
              />
            </div>
            <FormField
              label="Course Name"
              name="courseName"
              required
              placeholder="Database Management Systems"
              {...getFieldProps("courseName")}
            />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              placeholder="Comprehensive course covering database design, SQL, and database administration..."
              rows={4}
              {...getFieldProps("description")}
            />
          </div>

          {/* Academic Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Credits"
                name="credits"
                type="number"
                min={1}
                max={6}
                required
                description="Credit hours for this course"
                {...getFieldProps("credits")}
              />
              <FormField
                label="Semester"
                name="semester"
                type="number"
                min={1}
                max={8}
                required
                description="Recommended semester"
                {...getFieldProps("semester")}
              />
              <FormField
                label="Year"
                name="year"
                type="number"
                min={1}
                max={4}
                required
                description="Academic year level"
                {...getFieldProps("year")}
              />
            </div>
            <FormField
              label="Maximum Students"
              name="maxStudents"
              type="number"
              min={1}
              max={200}
              required
              description="Maximum enrollment capacity"
              {...getFieldProps("maxStudents")}
            />
          </div>

          {/* Prerequisites */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Prerequisites (Optional)</h3>
            <FormField
              label="Prerequisite Courses"
              name="prerequisites"
              type="textarea"
              placeholder="CS201, CS202 (Enter course codes separated by commas)"
              description="List prerequisite course codes separated by commas"
              {...getFieldProps("prerequisites")}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Course" : "Create Course"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
